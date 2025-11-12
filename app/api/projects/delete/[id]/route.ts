import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import { deleteProject, deleteProjectDocuments } from "@/lib/db";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await context.params;

  if (!projectId) {
    return NextResponse.json({ error: "Missing projectId" }, { status: 400 });
  }

  try {
    await connectDB();

    const project = await Project.findById(projectId).select("members");
    if (!project)
      return NextResponse.json({ error: "Project not found" }, { status: 404 });

    const adminMember = project.members.find(
      (m: { role: string }) => m.role === "admin"
    );

    const userId = adminMember?.user || null;

    await deleteProjectDocuments(projectId);

    const result = await deleteProject(projectId, userId);

    return NextResponse.json(
      {
        message: "Project and all associated documents deleted successfully",
        ...result,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error deleting project:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
