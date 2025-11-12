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

export async function POST(req: Request) {
  const startTime = Date.now();

  try {
    const apiKey = req.headers.get("x-api-key");
    const userAgent = req.headers.get("user-agent") || "Unknown";
    const ipAddress =
      req.headers.get("x-forwarded-for") ||
      (req as { ip?: string }).ip ||
      "Unknown IP";

    const {
      model,
      id,
      filters = {},
      search,
      fields,
      populate = [],
      limit = 20,
      skip = 0,
      sort = {},
      countOnly = false,
      distinct,
      pipeline,
    } = await req.json();

    // 1️⃣ Validate inputs
    if (!apiKey || !model) {
      return NextResponse.json(
        { error: "Missing required fields (x-api-key header, model)" },
        { status: 400 }
      );
    }

    await connectDB();

    // 2️⃣ Validate project
    const project = await Project.findOne({ apiKey }).populate({
      path: "members.user",
      select: "_id email name",
    });
    if (!project)
      return NextResponse.json(
        { error: "Invalid API key or project not found" },
        { status: 404 }
      );

    const user =
      project.members?.[0]?.user ||
      (await User.findOne({ _id: project.owner })) ||
      null;

    // 3️⃣ Connect to project DB
    let conn = getProjectConnection(project._id.toString());
    if (!conn)
      conn = await connectToProjectDB(project._id.toString(), project.mongoUrl);

    // 4️⃣ Load model dynamically
    let Model = modelCache[project._id.toString()]?.[model];
    if (!Model) {
      const modelDoc = project.models?.find(
        (m: { name: string; schema?: Record<string, unknown> }) =>
          m.name === model
      );
      if (!modelDoc)
        return NextResponse.json(
          { error: `Model "${model}" not found in project` },
          { status: 404 }
        );

      Model = await getOrCreateProjectModel(
        project._id.toString(),
        model,
        modelDoc.schema
      );
    }

    // 5️⃣ Validate ID and preprocess filters
    if (id && !id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json(
        { error: "Invalid document ID format" },
        { status: 400 }
      );
    }

    const safeLimit = Math.min(Number(limit) || 20, 200);

    // Auto-cast numeric filters
    Object.entries(filters).forEach(([key, val]) => {
      const type = Model.schema.paths[key]?.instance;
      if (type === "Number" && typeof val === "string")
        filters[key] = Number(val);
    });

    let result;
    let message = "";
    let queryType = "find";

    // 6️⃣ Special query modes
    if (pipeline) {
      queryType = "aggregate";
      result = await Model.aggregate(pipeline);
      message = `Executed aggregation on "${model}"`;
    } else if (distinct) {
      queryType = "distinct";
      result = await Model.distinct(distinct, filters);
      message = `Fetched distinct values of "${distinct}" from "${model}"`;
    } else if (countOnly) {
      queryType = "count";
      const count = await Model.countDocuments(filters);
      result = { count };
      message = `Counted ${count} documents in "${model}"`;
    } else {
      // 7️⃣ Build query
      let query;
      if (id) {
        queryType = "findById";
        query = Model.findById(id);
      } else {
        queryType = "find";
        const combinedFilters = { ...filters };

        // Fuzzy search
        if (search) {
          const schema = Model.schema.obj;
          const textFields = Object.keys(schema).filter((key) => {
            const t = (schema[key] as { type?: unknown }).type;
            return t === String || t === "String";
          });

          if (textFields.length) {
            combinedFilters["$or"] = textFields.map((field) => ({
              [field]: { $regex: search, $options: "i" },
            }));
          }
        }

        if (!search && Object.keys(combinedFilters).length === 0) {
          return NextResponse.json(
            { error: "Provide at least one filter, search term, or ID" },
            { status: 400 }
          );
        }

        query = Model.find(combinedFilters)
          .limit(safeLimit)
          .skip(Number(skip))
          .sort(sort);

        if (fields) query.select(fields.join(" "));
      }

      // 8️⃣ Populate
      if (populate.length) {
        const validPaths = Object.keys(Model.schema.paths);
        populate
          .filter((p: string) => validPaths.includes(p))
          .forEach((p: string) => query.populate(p));
      }

      // 9️⃣ Execute
      result = await query.exec();
      message = `Fetched ${
        Array.isArray(result) ? result.length : 1
      } document(s) from "${model}"`;
    }

    // 🔟 Increment usage
    await Project.updateOne({ apiKey }, { $inc: { apiRequests: 1 } });

    // 🧾 Log API request
    await APIRequest.create({
      user: user?._id,
      project: project._id,
      endpoint: "/api/data/find",
      method: "POST",
      status: "success",
      statusCode: 200,
      responseTimeMs: Date.now() - startTime,
      requestBody: {
        model,
        id,
        filters,
        search,
        fields,
        populate,
        limit,
        skip,
        sort,
        countOnly,
        distinct,
        pipeline,
      },
      responseBody: Array.isArray(result) ? { count: result.length } : result,
      headers: { "x-api-key": apiKey },
      ipAddress,
      userAgent,
      metadata: {
        model,
        queryType,
        message,
        returnedCount: Array.isArray(result) ? result.length : 1,
      },
    });

    return NextResponse.json({
      success: true,
      message,
      data: result,
    });
  } catch (err) {
    console.error("[POST /api/data/find] Error:", err);

    try {
      await APIRequest.create({
        endpoint: "/api/data/find",
        method: "POST",
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
