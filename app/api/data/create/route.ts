/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import {
  getProjectConnection,
  connectToProjectDB,
  modelCache,
  getOrCreateProjectModel,
} from "@/lib/dbManager";

/**
 * Manually validate incoming data against schema
 */
function validateAgainstSchema(
  schema: Record<string, any>,
  data: Record<string, any>
) {
  const schemaFields = Object.keys(schema);
  const dataFields = Object.keys(data);

  // 1️⃣ Extra fields not in schema
  const extraFields = dataFields.filter((f) => !schemaFields.includes(f));
  if (extraFields.length > 0) {
    throw new Error(`Extra fields not allowed: ${extraFields.join(", ")}`);
  }

  // 2️⃣ Type check (optional)
  for (const key of schemaFields) {
    const expectedType = schema[key]?.type?.name; // 'String', 'Number', etc.
    if (expectedType && data[key] != null) {
      const actualType = data[key].constructor.name;
      if (actualType !== expectedType) {
        throw new Error(
          `Field "${key}" should be of type ${expectedType}, got ${actualType}`
        );
      }
    }
  }

  // 3️⃣ Required fields
  for (const key of schemaFields) {
    if (schema[key]?.required && !(key in data)) {
      throw new Error(`Missing required field: "${key}"`);
    }
  }

  return true;
}

export async function POST(req: Request) {
  try {
    const { apiKey, model, data } = await req.json();

    if (!apiKey || !model || !data) {
      console.log("[POST /api/data] Missing required fields");
      return NextResponse.json(
        { error: "Missing required fields (apiKey, model, data)" },
        { status: 400 }
      );
    }

    // 1️⃣ Connect to main DB
    await connectDB();
    console.log("[POST /api/data] Connected to main DB");

    // 2️⃣ Find project by API key
    const project = await Project.findOne({ apiKey });
    if (!project) {
      console.log("[POST /api/data] Project not found for API key:", apiKey);
      return NextResponse.json(
        { error: "Invalid API key or project not found" },
        { status: 404 }
      );
    }
    console.log("[POST /api/data] Found project:", project._id.toString());

    // 3️⃣ Ensure project DB connection
    let conn = getProjectConnection(project._id.toString());
    if (!conn) {
      console.log(
        "[POST /api/data] Project DB not connected, connecting now..."
      );
      try {
        conn = await connectToProjectDB(
          project._id.toString(),
          project.mongoUrl
        );
        console.log(
          "[POST /api/data] Connected to project DB:",
          project._id.toString()
        );
      } catch (err) {
        console.error("[POST /api/data] Failed to connect to project DB:", err);
        return NextResponse.json(
          { error: "Project database not connected" },
          { status: 500 }
        );
      }
    }

    // 4️⃣ Ensure model exists in cache or fetch from Project.models
    let Model = modelCache[project._id.toString()]?.[model];

    if (!Model) {
      console.log(
        "[POST /api/data] Model not in cache, fetching schema from project..."
      );
      const modelDoc = project.models?.find(
        (m: { name: string; schema?: Record<string, any> }) => m.name === model
      );

      if (!modelDoc) {
        console.error("[POST /api/data] Model schema not found:", model);
        return NextResponse.json(
          { error: `Model "${model}" schema not found` },
          { status: 404 }
        );
      }

      if (!modelDoc.schema) {
        console.error(
          "[POST /api/data] Model exists but schema missing:",
          model
        );
        return NextResponse.json(
          { error: `Model "${model}" exists but has no schema defined` },
          { status: 400 }
        );
      }

      // Only register model if schema exists
      Model = await getOrCreateProjectModel(
        project._id.toString(),
        model,
        modelDoc.schema
      );
      console.log("[POST /api/data] Model registered and cached:", model);
    }

    // 5️⃣ Log schema and data
    console.log("[POST /api/data] Model schema:", Model.schema.obj);
    console.log("[POST /api/data] Incoming data:", data);

    // 6️⃣ Manual validation
    try {
      validateAgainstSchema(Model.schema.obj, data);
      console.log("[POST /api/data] Manual validation passed");
    } catch (validationError) {
      console.error(
        "[POST /api/data] Manual validation failed:",
        validationError
      );
      return NextResponse.json(
        {
          error: "Validation failed",
          details: (validationError as Error).message,
        },
        { status: 400 }
      );
    }

    // 7️⃣ Insert document
    const created = await Model.create(data);
    console.log("[POST /api/data] Document created:", created._id.toString());

    return NextResponse.json(
      {
        success: true,
        message: "Document created successfully",
        data: created,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[POST /api/data] Error creating data:", err);
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}
