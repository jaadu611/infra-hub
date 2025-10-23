import { NextResponse } from "next/server";
import {
  connectToProjectDB,
  getOrCreateProjectModel,
  getProjectModelNames,
} from "@/lib/dbManager";
import Project from "@/models/Project";
import { connectDB } from "@/lib/mongodb";

type ModelDoc = { _id: { toString(): string } | string; name: string };

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const projectId = (await params).id;

  if (!projectId)
    return NextResponse.json({ error: "Missing projectId" }, { status: 400 });

  const project = await Project.findById(projectId);
  if (!project)
    return NextResponse.json({ error: "Project not found" }, { status: 404 });

  try {
    await connectToProjectDB(projectId, project.mongoUrl);

    const modelDocs = await getProjectModelNames(projectId);

    const models = modelDocs.map((m: ModelDoc) => ({
      _id: typeof m._id === "string" ? m._id : m._id.toString(),
      name: m.name,
    }));

    return NextResponse.json({ models });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const projectId = (await params).id;
  if (!projectId)
    return NextResponse.json({ error: "Missing projectId" }, { status: 400 });

  const project = await Project.findById(projectId);
  if (!project)
    return NextResponse.json({ error: "Project not found" }, { status: 404 });

  const { modelName, schema } = await req.json();
  if (!modelName || !schema)
    return NextResponse.json(
      { error: "Model name and schema are required" },
      { status: 400 }
    );

  try {
    await connectToProjectDB(projectId, project.mongoUrl);

    const existingModels = await getProjectModelNames(projectId);
    if (existingModels.includes(modelName)) {
      return NextResponse.json(
        { error: `Model "${modelName}" already exists` },
        { status: 400 }
      );
    }

    await getOrCreateProjectModel(projectId, modelName, schema);

    const models = await getProjectModelNames(projectId);

    return NextResponse.json({
      message: `Model "${modelName}" created successfully`,
      models,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
