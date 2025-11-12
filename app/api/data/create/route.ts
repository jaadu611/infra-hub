import { createDocument } from "@/lib/dbManager";
import { NextResponse } from "next/server";
import Project from "@/models/Project";
import { connectDB } from "@/lib/mongodb";
import APIRequest from "@/models/APIRequest";
import User from "@/models/User";

export async function POST(req: Request) {
  const startTime = Date.now();

  try {
    await connectDB();

    const apiKey = req.headers.get("x-api-key");
    const userAgent = req.headers.get("user-agent") || "Unknown";
    const ipAddress =
      req.headers.get("x-forwarded-for") ||
      (req as { ip?: string }).ip ||
      "Unknown IP";

    const { model, data } = await req.json();

    if (!apiKey || !model || !data) {
      return NextResponse.json(
        { error: "Missing required fields (x-api-key header, model, data)" },
        { status: 400 }
      );
    }

    // ✅ Find project by API key
    const project = await Project.findOne({ apiKey }).populate({
      path: "members.user",
      select: "_id email name",
    });

    if (!project) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 403 });
    }

    // The user is the project admin (first member or owner)
    const user =
      project.members?.[0]?.user ||
      (await User.findOne({ _id: project.owner })) ||
      null;

    // ✅ Create document in the project DB
    const created = await createDocument(apiKey, model, data);

    // ✅ Increment API request count for the project
    await Project.updateOne({ apiKey }, { $inc: { apiRequests: 1 } });

    // ✅ Log the API request (success)
    await APIRequest.create({
      user: user?._id,
      project: project._id,
      endpoint: "/api/data/create",
      method: "POST",
      status: "success",
      statusCode: 201,
      responseTimeMs: Date.now() - startTime,
      requestBody: { model, data },
      responseBody: created,
      headers: {
        "x-api-key": apiKey,
      },
      ipAddress,
      userAgent,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Document created successfully",
        data: created,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[POST /api/data/create] Error:", err);

    try {
      await APIRequest.create({
        endpoint: "/api/data/create",
        method: "POST",
        status: "failure",
        statusCode: 500,
        responseTimeMs: Date.now() - startTime,
        requestBody: {},
        responseBody: { error: err },
      });
    } catch (logErr) {
      console.error("Failed to log APIRequest:", logErr);
    }

    return NextResponse.json({ success: false, error: err }, { status: 500 });
  }
}
