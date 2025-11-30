import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Project from "@/models/Project";
import APIRequest from "@/models/APIRequest";
import { connectDB } from "@/lib/mongodb";
import {
  connectToProjectDB,
  getProjectConnection,
  modelCache,
  getOrCreateProjectModel,
} from "@/lib/dbManager";

export async function POST(req: Request) {
  const startTime = Date.now();

  try {
    // 1️⃣ Extract API key and body
    const apiKey = req.headers.get("x-api-key");
    const userAgent = req.headers.get("user-agent") || "Unknown";
    const ipAddress =
      req.headers.get("x-forwarded-for") ||
      (req as { ip?: string }).ip ||
      "Unknown IP";

    if (!apiKey)
      return NextResponse.json({ error: "Missing API key" }, { status: 401 });

    const { modelName, email, password } = await req.json();
    if (!modelName || !email || !password)
      return NextResponse.json(
        { error: "modelName, email, and password are required" },
        { status: 400 }
      );

    // 2️⃣ Connect to main DB
    await connectDB();

    const project = await Project.findOne({ apiKey });
    if (!project)
      return NextResponse.json({ error: "Invalid API key" }, { status: 403 });

    await Project.updateOne({ _id: project._id }, { $inc: { apiRequests: 1 } });

    // 3️⃣ Connect to the project's MongoDB
    let conn = getProjectConnection(project._id.toString());
    if (!conn) {
      conn = await connectToProjectDB(project._id.toString(), project.mongoUrl);
    }

    // 4️⃣ Get or create model dynamically
    if (!modelCache[project._id.toString()])
      modelCache[project._id.toString()] = {};

    let UserModel = modelCache[project._id.toString()][modelName];
    if (!UserModel) {
      const modelDef = project.models.find(
        (m: { name: string }) => m.name === modelName
      );
      if (!modelDef)
        return NextResponse.json(
          { error: `Model "${modelName}" not found in project` },
          { status: 404 }
        );

      UserModel = await getOrCreateProjectModel(
        project._id.toString(),
        modelName,
        modelDef.schema
      );
      modelCache[project._id.toString()][modelName] = UserModel;
    }

    // 5️⃣ Find user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      await logAttempt(
        "failure",
        project,
        { modelName, email },
        ipAddress,
        userAgent,
        startTime
      );
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // 6️⃣ Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      await logAttempt(
        "failure",
        project,
        { modelName, email },
        ipAddress,
        userAgent,
        startTime
      );
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // 7️⃣ Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      project.authSecret,
      { expiresIn: "7d" }
    );

    // 8️⃣ Store JWT in secure cookie
    const cookieStore = cookies();
    (await cookieStore).set("infra_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/dashboard",
      maxAge: 7 * 24 * 60 * 60,
    });

    // 9️⃣ Log success
    await logAttempt(
      "success",
      project,
      { modelName, email },
      ipAddress,
      userAgent,
      startTime
    );

    // 🔟 Return response
    return NextResponse.json({
      success: true,
      message: "Logged in successfully",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    console.error("[POST /api/client/login] Error:", err);
    try {
      await APIRequest.create({
        endpoint: "/api/client/login",
        method: "POST",
        status: "failure",
        statusCode: 500,
        responseTimeMs: Date.now() - startTime,
        responseBody: { error: err },
      });
    } catch {}
    return NextResponse.json(
      { success: false, error: err || "Internal Server Error" },
      { status: 500 }
    );
  }
}

// 🔹 Helper function for clean logging
async function logAttempt(
  status: "success" | "failure",
  project: { _id: string },
  body: { modelName: string; email: string },
  ip: string,
  ua: string,
  start: number
) {
  try {
    await APIRequest.create({
      project: project._id,
      endpoint: "/api/client/login",
      method: "POST",
      status,
      statusCode: status === "success" ? 200 : 401,
      responseTimeMs: Date.now() - start,
      requestBody: body,
      ipAddress: ip,
      userAgent: ua,
      metadata: { action: "login", model: body.modelName },
    });
  } catch (err) {
    console.error("Failed to log login attempt:", err);
  }
}
