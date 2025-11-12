import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import APIRequest from "@/models/APIRequest";
import User from "@/models/User";
import {
  getProjectConnection,
  connectToProjectDB,
  modelCache,
  getOrCreateProjectModel,
  validateAgainstSchema,
} from "@/lib/dbManager";

export async function PATCH(req: Request) {
  const startTime = Date.now();

  try {
    const apiKey = req.headers.get("x-api-key");
    const userAgent = req.headers.get("user-agent") || "Unknown";
    const ipAddress =
      req.headers.get("x-forwarded-for") ||
      (req as { ip?: string }).ip ||
      "Unknown IP";

    const { model, id, filters = {}, data } = await req.json();

    // 1️⃣ Validate input
    if (!apiKey || !model || !data || Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: "Missing required fields (x-api-key, model, data)" },
        { status: 400 }
      );
    }

    // 2️⃣ Connect to main DB
    await connectDB();
    const project = await Project.findOne({ apiKey }).populate({
      path: "members.user",
      select: "_id email name",
    });
    if (!project) {
      return NextResponse.json(
        { error: "Invalid API key or project not found" },
        { status: 404 }
      );
    }

    const user =
      project.members?.[0]?.user ||
      (await User.findOne({ _id: project.owner })) ||
      null;

    // 3️⃣ Connect to project DB
    let conn = getProjectConnection(project._id.toString());
    if (!conn) {
      conn = await connectToProjectDB(project._id.toString(), project.mongoUrl);
    }

    // 4️⃣ Load model dynamically
    let Model = modelCache[project._id.toString()]?.[model];
    if (!Model) {
      const modelDoc = project.models?.find(
        (m: { name: string; schema?: Record<string, unknown> }) =>
          m.name === model
      );
      if (!modelDoc || !modelDoc.schema) {
        return NextResponse.json(
          { error: `Model "${model}" not found or has no schema` },
          { status: 404 }
        );
      }
      Model = await getOrCreateProjectModel(
        project._id.toString(),
        model,
        modelDoc.schema
      );
    }

    // 5️⃣ Validate data against schema
    try {
      validateAgainstSchema(Model.schema.obj, data);
    } catch (validationError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: (validationError as Error).message,
        },
        { status: 400 }
      );
    }

    // 6️⃣ Build query
    let query;
    if (id) {
      query = { _id: id };
    } else if (Object.keys(filters).length) {
      query = filters;
    } else {
      return NextResponse.json(
        { error: "You must provide either id or filters to update" },
        { status: 400 }
      );
    }

    // 7️⃣ Perform update
    const updated = await Model.updateMany(query, { $set: data });

    if (updated.matchedCount === 0) {
      return NextResponse.json(
        { error: "No matching document found to update" },
        { status: 404 }
      );
    }

    // 8️⃣ Increment API usage
    await Project.updateOne({ apiKey }, { $inc: { apiRequests: 1 } });

    const responseTime = Date.now() - startTime;

    // 9️⃣ Log API request
    await APIRequest.create({
      user: user?._id,
      project: project._id,
      endpoint: "/api/data",
      method: "PATCH",
      status: "success",
      statusCode: 200,
      responseTimeMs: responseTime,
      requestBody: { model, id, filters, data },
      responseBody: {
        matchedCount: updated.matchedCount,
        modifiedCount: updated.modifiedCount,
      },
      headers: { "x-api-key": apiKey },
      ipAddress,
      userAgent,
      metadata: {
        model,
        action: "update",
        matchedCount: updated.matchedCount,
        modifiedCount: updated.modifiedCount,
      },
    });

    // ✅ Success response
    return NextResponse.json({
      success: true,
      message: `${updated.modifiedCount} document(s) updated successfully`,
      data: updated,
    });
  } catch (err) {
    console.error("[PATCH /api/data] Error updating document:", err);

    // 🧾 Log failed attempt
    try {
      await APIRequest.create({
        endpoint: "/api/data",
        method: "PATCH",
        status: "failure",
        statusCode: 500,
        responseTimeMs: Date.now() - startTime,
        responseBody: { error: err },
      });
    } catch (logErr) {
      console.error("Failed to log APIRequest:", logErr);
    }

    return NextResponse.json({ success: false, error: err }, { status: 500 });
  }
}
