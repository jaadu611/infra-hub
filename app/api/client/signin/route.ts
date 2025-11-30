import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Project from "@/models/Project";
import APIRequest from "@/models/APIRequest";
import { connectDB } from "@/lib/mongodb";
import {
  createDocument,
  getOrCreateProjectModel,
  getProjectConnection,
  connectToProjectDB,
  modelCache,
} from "@/lib/dbManager";

export async function POST(req: Request) {
  const startTime = Date.now();

  try {
    const apiKey = req.headers.get("x-api-key");
    const userAgent = req.headers.get("user-agent") || "Unknown";
    const ipAddress =
      req.headers.get("x-forwarded-for") ||
      (req as { ip?: string }).ip ||
      "Unknown IP";

    if (!apiKey)
      return NextResponse.json({ error: "Missing API key" }, { status: 401 });

    const { modelName, email, password, name } = await req.json();
    if (!modelName || !email || !password || !name)
      return NextResponse.json(
        { error: "modelName, email, name, and password are required" },
        { status: 400 }
      );

    // 1️⃣ Connect to main DB and find project
    await connectDB();
    const project = await Project.findOne({ apiKey });
    if (!project)
      return NextResponse.json({ error: "Invalid API key" }, { status: 403 });

    // 2️⃣ Connect to project DB
    let conn = getProjectConnection(project._id.toString());
    if (!conn)
      conn = await connectToProjectDB(project._id.toString(), project.mongoUrl);

    // 3️⃣ Load model dynamically if it exists
    if (!modelCache[project._id.toString()])
      modelCache[project._id.toString()] = {};

    let UserModel = modelCache[project._id.toString()][modelName];
    if (!UserModel) {
      const modelDoc = project.models?.find(
        (m: { name: string }) => m.name === modelName
      );
      if (!modelDoc)
        return NextResponse.json(
          { error: `Model "${modelName}" not found` },
          { status: 404 }
        );

      UserModel = await getOrCreateProjectModel(
        project._id.toString(),
        modelName,
        modelDoc.schema
      );
      modelCache[project._id.toString()][modelName] = UserModel;
    }

    // 4️⃣ Prevent duplicate email (no logging or increment)
    const existingUser = await UserModel.findOne({ email }).lean();
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }

    // 5️⃣ Hash password & create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = await createDocument(apiKey, modelName, {
      name,
      email,
      password: hashedPassword,
    });

    // 6️⃣ Generate JWT token
    const token = jwt.sign(
      { id: createdUser._id, email: createdUser.email },
      project.authSecret,
      { expiresIn: "7d" }
    );

    // 7️⃣ Store token securely
    const cookieStore = cookies();
    (await cookieStore).set("infra_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/dashboard",
      maxAge: 7 * 24 * 60 * 60,
    });

    // 8️⃣ Increment API usage counter
    await Project.updateOne({ apiKey }, { $inc: { apiRequests: 1 } });

    // 9️⃣ Log successful signup
    await logRequest(
      "success",
      project,
      { modelName, email, name },
      ipAddress,
      userAgent,
      startTime,
      "User signed up successfully"
    );

    // ✅ Return success
    return NextResponse.json({
      success: true,
      message: "Signed up successfully",
      user: createdUser,
    });
  } catch (err) {
    console.error("[POST /api/client/signup] Error:", err);

    // Log failure
    try {
      await APIRequest.create({
        endpoint: "/api/client/signup",
        method: "POST",
        status: "failure",
        statusCode: 500,
        responseTimeMs: Date.now() - startTime,
        responseBody: { error: err },
        metadata: { action: "signup" },
      });
    } catch {}

    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

// 🔹 Helper for consistent logging
async function logRequest(
  status: "success" | "failure",
  project: { _id: string },
  body: { modelName: string; email: string; name?: string },
  ip: string,
  ua: string,
  start: number,
  message: string
) {
  try {
    await APIRequest.create({
      project: project._id,
      endpoint: "/api/client/signup",
      method: "POST",
      status,
      statusCode: status === "success" ? 201 : 400,
      responseTimeMs: Date.now() - start,
      requestBody: body,
      ipAddress: ip,
      userAgent: ua,
      metadata: { action: "signup", message, model: body.modelName },
    });
  } catch (err) {
    console.error("Failed to log APIRequest (signup):", err);
  }
}
