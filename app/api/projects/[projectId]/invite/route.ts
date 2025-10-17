import { NextRequest, NextResponse } from "next/server";
import { inviteUserToProject, getProjectById } from "@/lib/db";
import User from "@/models/User";
import { sendInviteEmail } from "@/lib/mailer";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;
    const { userId } = await req.json();

    if (!userId)
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });

    const project = await getProjectById(projectId);
    if (!project)
      return NextResponse.json({ error: "Project not found" }, { status: 404 });

    const user = await User.findById(userId);
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (project.invitedEmails?.includes(user.email)) {
      return NextResponse.json(
        { error: "User is already invited" },
        { status: 400 }
      );
    }

    const updatedProject = await inviteUserToProject(projectId, userId);
    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/projects/${projectId}/join`;

    // ✅ properly formatted email call
    await sendInviteEmail({
      to: user.email,
      subject: `You're invited to join "${project.name}" on InfraHub!`,
      text: `Hi ${
        user.name || "there"
      },\n\nYou've been invited to join the project "${
        project.name
      }". Click the link to join:\n${inviteLink}\n\n— InfraHub Team`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6;">
          <h2 style="color: #4f46e5;">You're invited to join "${
            project.name
          }"</h2>
          <p>Hi ${user.name || "there"},</p>
          <p>You've been invited to collaborate on <strong>${
            project.name
          }</strong>.</p>
          <p>
            <a href="${inviteLink}" 
               style="display:inline-block;background-color:#4f46e5;color:#fff;
                      padding:10px 18px;border-radius:6px;text-decoration:none;">
              Join Project
            </a>
          </p>
          <p style="margin-top:24px;color:#6b7280;">— The InfraHub Team</p>
        </div>
      `,
    });

    return NextResponse.json({
      message: "Invite sent successfully",
      project: updatedProject,
    });
  } catch (err) {
    console.error("Error inviting user:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
