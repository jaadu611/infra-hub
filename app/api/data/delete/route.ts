import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import APIRequest from "@/models/APIRequest";
import {
  getProjectConnection,
  connectToProjectDB,
  modelCache,
  getOrCreateProjectModel,
} from "@/lib/dbManager";
import User from "@/models/User";

export async function DELETE(req: Request) {
  const startTime = Date.now();

  try {
    const apiKey = req.headers.get("x-api-key");
    const userAgent = req.headers.get("user-agent") || "Unknown";
    const ipAddress =
      req.headers.get("x-forwarded-for") ||
      (req as { ip?: string }).ip ||
      "Unknown IP";

    const { model, id, filters = {}, many = false } = await req.json();

    if (!apiKey || !model) {
      return NextResponse.json(
        { error: "Missing required fields (x-api-key header, model)" },
        { status: 400 }
      );
    }

    await connectDB();

    // 🔐 Validate project
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

    // 🧩 Resolve user (fallback to owner/admin)
    const user =
      project.members?.[0]?.user ||
      (await User.findOne({ _id: project.owner })) ||
      null;

    // 🧩 Connect to project DB
    let conn = getProjectConnection(project._id.toString());
    if (!conn) {
      conn = await connectToProjectDB(project._id.toString(), project.mongoUrl);
    }

    // 🧩 Load model dynamically
    let Model = modelCache[project._id.toString()]?.[model];
    if (!Model) {
      const modelDoc = project.models?.find(
        (m: { name: string; schema?: Record<string, unknown> }) =>
          m.name === model
      );

      if (!modelDoc || !modelDoc.schema) {
        return NextResponse.json(
          { error: `Model "${model}" not found or missing schema` },
          { status: 404 }
        );
      }

      Model = await getOrCreateProjectModel(
        project._id.toString(),
        model,
        modelDoc.schema
      );
    }

    // 🧩 Validate ID format if provided
    if (id && !id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json(
        { error: "Invalid document ID format" },
        { status: 400 }
      );
    }

    // 🧩 Safety check
    if (!id && Object.keys(filters).length === 0) {
      return NextResponse.json(
        { error: "Provide either an id or filters to delete documents" },
        { status: 400 }
      );
    }

    // 🧩 Perform deletion
    let result,
      message = "";

    if (id) {
      result = await Model.findByIdAndDelete(id);
      if (!result) {
        return NextResponse.json(
          { error: `No document found with id "${id}"` },
          { status: 404 }
        );
      }
      message = `Deleted document with id "${id}"`;
    } else if (many) {
      const res = await Model.deleteMany(filters);
      message = `Deleted ${res.deletedCount} documents from "${model}"`;
      result = { deletedCount: res.deletedCount };
    } else {
      const deletedOne = await Model.findOneAndDelete(filters);
      if (!deletedOne) {
        return NextResponse.json(
          { error: "No document matched the given filters" },
          { status: 404 }
        );
      }
      message = `Deleted one document from "${model}"`;
      result = deletedOne;
    }

    // 🔄 Increment API request count
    await Project.updateOne({ apiKey }, { $inc: { apiRequests: 1 } });

    // 🧾 Log API request (success)
    await APIRequest.create({
      user: user?._id,
      project: project._id,
      endpoint: "/api/data",
      method: "DELETE",
      status: "success",
      statusCode: 200,
      responseTimeMs: Date.now() - startTime,
      requestBody: { model, id, filters, many },
      responseBody: result,
      headers: { "x-api-key": apiKey },
      ipAddress,
      userAgent,
      metadata: {
        model,
        deletedCount: result?.deletedCount ?? (result ? 1 : 0),
        message,
      },
    });

    return NextResponse.json({
      success: true,
      message,
      data: result,
    });
  } catch (err) {
    console.error("[DELETE /api/data] Error deleting document:", err);

    // 🧾 Log failure too
    try {
      await APIRequest.create({
        endpoint: "/api/data",
        method: "DELETE",
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
