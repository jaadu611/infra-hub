import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  const { projectId } = params;
  const { mongoUrl } = await req.json();

  if (!mongoUrl || typeof mongoUrl !== "string") {
    return NextResponse.json({ error: "Invalid mongoUrl" }, { status: 400 });
  }

  await connectDB();

  try {
    const updated = await Project.findByIdAndUpdate(
      projectId,
      { mongoUrl },
      { new: true }
    ).lean();

    if (!updated)
      return NextResponse.json({ error: "Project not found" }, { status: 404 });

    return NextResponse.json({ success: true, mongoUrl: updated.mongoUrl });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to update MongoDB URL" },
      { status: 500 }
    );
  }
}
