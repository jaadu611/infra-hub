import { NextRequest, NextResponse } from "next/server";
import { inviteUserToProject, getProjectById } from "@/lib/db";
import User from "@/models/User";
import Activity from "@/models/Activity";
import { sendInviteEmail } from "@/lib/mailer";
import { auth } from "@/auth";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await context.params;
    const { userId, role } = await req.json();

    if (!userId || !role)
      return NextResponse.json(
        { error: "Missing userId or role" },
        { status: 400 }
      );

    const project = await getProjectById(projectId);
    if (!project)
      return NextResponse.json({ error: "Project not found" }, { status: 404 });

    const user = await User.findById(userId);
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const { token } = await inviteUserToProject(projectId, userId, role);
    const inviteLink = `${process.env.NEXTAUTH_URL}/projects/${projectId}/join?token=${token}`;

    await sendInviteEmail({
      to: user.email,
      subject: `You're invited to join "${project.name}" on InfraHub!`,
      text: `You've been invited to join as ${role}. Join here: ${inviteLink}`,
      html: `<div style="font-family:sans-serif;line-height:1.6;">
              <h2 style="color:#4f46e5;">You're invited to join "${project.name}"</h2>
              <p>You’ve been invited as a <strong>${role}</strong>.</p>
              <a href="${inviteLink}" style="background:#4f46e5;color:white;padding:10px 18px;border-radius:6px;text-decoration:none;">Join Project</a>
              <p style="color:#6b7280;">— The InfraHub Team</p>
            </div>`,
    });

    const session = await auth();
    const userEmail = session?.user?.email;

    if (userEmail) {
      const currentUser = await User.findOne({ email: userEmail });
      if (currentUser) {
        const newActivity = new Activity({
          user: currentUser._id,
          action: `Invited ${user.name} as ${role}`,
          collectionName: project.name,
          type: "invite",
        });
        await newActivity.save();
      }
    }

    return NextResponse.json({ message: "Invite sent successfully" });
  } catch (err) {
    console.error("Error inviting user:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
