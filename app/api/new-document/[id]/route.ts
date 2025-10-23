import { NextResponse } from "next/server";
import Project from "@/models/Project";
import Document from "@/models/Docs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const body = await req.json();

    const { name, content, ownerEmail } = body;

    if (!name || !content || !ownerEmail) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, content, and ownerEmail are required",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const { _id } = await User.findOne({ email: ownerEmail });

    const newDoc = await Document.create({
      name,
      content,
      owner: _id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const project = await Project.findByIdAndUpdate(id, {
      $push: { documents: newDoc._id },
    });

    if (!project) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, document: newDoc });
  } catch (err) {
    console.error("Error saving document:", err);
    return NextResponse.json(
      { success: false, message: (err as Error).message },
      { status: 500 }
    );
  }
}
