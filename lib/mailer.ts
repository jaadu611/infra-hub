import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export interface InviteEmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export async function sendInviteEmail({
  to,
  subject,
  text,
  html,
}: InviteEmailOptions) {
  if (!process.env.EMAIL_FROM) {
    throw new Error("EMAIL_FROM is not set");
  }

  const msg = {
    to,
    from: {
      email: process.env.EMAIL_FROM,
      name: "InfraHub",
    },
    subject,
    text,
    html:
      html ||
      `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height:1.6; color:#1f2937; max-width:600px; margin:auto; padding:20px; border:1px solid #e5e7eb; border-radius:8px; background-color:#f9fafb;">
        <h2 style="color:#4f46e5; margin-bottom:16px;">You're invited to join a project on InfraHub!</h2>
        <p>Hi there,</p>
        <p>You've been invited to collaborate on a project. Click the button below to accept the invitation:</p>
        <p style="text-align:center; margin:24px 0;">
          <a href="${text.match(/(https?:\/\/[^\s]+)/)?.[0] || "#"}"
             style="display:inline-block; background-color:#4f46e5; color:#ffffff; padding:12px 24px; border-radius:6px; text-decoration:none; font-weight:600;">
            Join Project
          </a>
        </p>
        <p>If you did not expect this invitation, you can safely ignore this email.</p>
        <p style="margin-top:24px; color:#6b7280;">— The InfraHub Team</p>
      </div>
    `,
  };

  await sgMail.send(msg);
}
