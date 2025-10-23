import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import { connectToProjectDB, getOrCreateProjectModel } from "@/lib/dbManager";

export async function POST(req: Request) {
  try {
    const { apiKey, model, data } = await req.json();

    if (!apiKey || !model || !data) {
      return NextResponse.json(
        { error: "Missing required fields (apiKey, model, data)" },
        { status: 400 }
      );
    }

    // 1️⃣ Connect to main DB
    await connectDB();

    // 2️⃣ Find project by API key
    const project = await Project.findOne({ apiKey });
    if (!project) {
      return NextResponse.json(
        { error: "Invalid API key or project not found" },
        { status: 404 }
      );
    }

    // 3️⃣ Connect to that project's MongoDB
    await connectToProjectDB(project._id.toString(), project.mongoUrl);

    // 4️⃣ Load or create the model in that DB
    const Model = getOrCreateProjectModel(
      project._id.toString(),
      model,
      {} // Schema can be empty for now (we’ll enhance this later)
    );

    // 5️⃣ Create document
    const [created] = await Model.insertMany([data]);

    // 6️⃣ Return result
    return NextResponse.json(
      {
        success: true,
        message: "Document created successfully",
        data: created,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error creating data:", err);
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}
