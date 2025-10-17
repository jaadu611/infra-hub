import { NextRequest, NextResponse } from "next/server";
import Project from "@/models/Project";
import { connectDB } from "@/lib/mongodb";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  const { projectId } = await params;
  const { authSecret } = await req.json();

  if (!authSecret || typeof authSecret !== "string") {
    return NextResponse.json({ error: "Invalid authSecret" }, { status: 400 });
  }

  await connectDB();

  try {
    const updated = await Project.findByIdAndUpdate(
      projectId,
      { authSecret },
      { new: true }
    ).lean();

    if (!updated)
      return NextResponse.json({ error: "Project not found" }, { status: 404 });

    return NextResponse.json({
      success: true,
      authSecret: updated?.authSecret,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to update auth secret" },
      { status: 500 }
    );
  }
}
