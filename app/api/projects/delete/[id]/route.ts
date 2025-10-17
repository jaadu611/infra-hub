// app/api/projects/delete/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { deleteProject, deleteProjectDocuments } from "@/lib/db";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const projectId = params.id;

  if (!projectId) {
    return NextResponse.json({ error: "Missing projectId" }, { status: 400 });
  }

  try {
    await deleteProjectDocuments(projectId);

    const result = await deleteProject(projectId);

    return NextResponse.json(
      { message: "Project and all associated documents deleted", ...result },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error deleting project:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal Server Error" },
      { status: 404 } // Use 404 if project not found
    );
  }
}
