import { NextResponse } from "next/server";
import { connectToProjectDB } from "@/lib/dbManager";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const projectId = (await params).id;
  const project = await Project.findById(projectId);
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  try {
    await connectToProjectDB(project._id.toString(), project.mongoUrl);
    return NextResponse.json({ message: "Successfully connected!" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
