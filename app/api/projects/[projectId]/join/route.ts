import { NextRequest, NextResponse } from "next/server";
import Project from "@/models/Project";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";

interface Invite {
  email: string;
  role: "viewer" | "editor";
  token: string;
  createdAt: Date;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    await connectDB();
    const token = req.nextUrl.searchParams.get("token");
    const { projectId } = params;

    if (!token)
      return NextResponse.json({ error: "Missing token" }, { status: 400 });

    const project = await Project.findById(projectId);
    if (!project)
      return NextResponse.json({ error: "Project not found" }, { status: 404 });

    const invite = (project.pendingInvites as Invite[]).find(
      (inv) => inv.token === token
    );

    if (!invite)
      return NextResponse.json(
        { error: "Invalid or expired invite" },
        { status: 400 }
      );

    const user = await User.findOne({ email: invite.email });
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const alreadyMember = project.members.some(
      (m: { user: string }) => m.user.toString() === user._id.toString()
    );
    if (alreadyMember)
      return NextResponse.json(
        { message: "User already part of this project" },
        { status: 200 }
      );

    project.members.push({
      user: user._id,
      role: invite.role,
    });

    project.pendingInvites = project.pendingInvites.filter(
      (i: Invite) => i.token !== token
    );

    await project.save();

    return NextResponse.json({
      message: "Invite accepted successfully",
      projectId,
      userId: user._id,
    });
  } catch (err) {
    console.error("Error verifying invite:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
