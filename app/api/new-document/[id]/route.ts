import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import Document from "@/models/Docs";
import User from "@/models/User";
import Activity from "@/models/Activity";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // project ID
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

    const user = await User.findOne({ email: ownerEmail });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Owner not found" },
        { status: 404 }
      );
    }

    const newDoc = await Document.create({
      name,
      content,
      owner: user._id,
      project: id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // ✅ Add to project documents array
    const project = await Project.findByIdAndUpdate(
      id,
      { $push: { documents: newDoc._id } },
      { new: true }
    );

    if (!project) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 }
      );
    }

    await Activity.create({
      user: user._id,
      action: `Created document "${name}"`,
      collectionName: "Document",
      type: "create",
    });

    return NextResponse.json({ success: true, document: newDoc });
  } catch (err) {
    console.error("Error saving document:", err);
    return NextResponse.json(
      { success: false, message: (err as Error).message },
      { status: 500 }
    );
  }
}
