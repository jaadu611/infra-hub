export interface InviteEmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export interface OtpEmailOptions {
  to: string;
  otp: string;
  expiresInMinutes?: number;
}

export async function sendInviteEmail({
  to,
  subject,
  text,
  html,
}: InviteEmailOptions) {
  if (!process.env.BREVO_API_KEY) {
    throw new Error("BREVO_API_KEY is not set");
  }
  if (!process.env.EMAIL_FROM) {
    throw new Error("EMAIL_FROM is not set");
  }

  const senderEmail = process.env.EMAIL_FROM;
  const senderName = "InfraHub";

  const body = {
    sender: { email: senderEmail, name: senderName },
    to: [{ email: to }],
    subject,
    textContent: text,
    htmlContent:
      html ||
      `
  <div style="background-color:#f4f5f7; padding:40px 0; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <table align="center" width="100%" style="max-width:600px; background-color:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 2px 6px rgba(0,0,0,0.05);">
      <tr>
        <td style="padding:40px 30px; text-align:center;">
          <h1 style="color:#4f46e5; font-size:24px; margin-bottom:16px;">You’re Invited to Collaborate on InfraHub 🚀</h1>
          <p style="color:#374151; font-size:16px; margin-bottom:24px;">
            Hello,
            <br /><br />
            You’ve been invited to join a project on <strong>InfraHub</strong>.  
            Click the button below to accept your invitation and get started.
          </p>

          <a href="${text.match(/(https?:\/\/[^\s]+)/)?.[0] || "#"}"
            style="display:inline-block; background-color:#4f46e5; color:#ffffff; text-decoration:none;
                   font-weight:600; padding:14px 28px; border-radius:6px; font-size:16px;">
            Accept Invitation
          </a>

          <p style="color:#6b7280; font-size:14px; margin-top:32px;">
            If the button doesn’t work, you can also copy and paste this link into your browser:
          </p>
          <p style="color:#2563eb; word-break:break-all; font-size:14px;">
            ${text.match(/(https?:\/\/[^\s]+)/)?.[0] || "https://infrahub.app"}
          </p>

          <hr style="border:none; border-top:1px solid #e5e7eb; margin:32px 0;" />

          <p style="color:#9ca3af; font-size:13px;">
            Didn’t expect this invitation? You can safely ignore this email.
          </p>
          <p style="color:#9ca3af; font-size:13px;">— The InfraHub Team</p>
        </td>
      </tr>
    </table>
  </div>
  `,
  };

  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Brevo API error: ${res.status} ${text}`);
    }
  } catch (err) {
    console.error("❌ Error sending email via Brevo:", err);
    throw err;
  }
}

export async function sendOtpEmail({
  to,
  otp,
  expiresInMinutes = 5,
}: OtpEmailOptions) {
  if (!process.env.BREVO_API_KEY) {
    throw new Error("BREVO_API_KEY is not set");
  }
  if (!process.env.EMAIL_FROM) {
    throw new Error("EMAIL_FROM is not set");
  }

  const senderEmail = process.env.EMAIL_FROM;
  const senderName = "InfraHub";

  const body = {
    sender: { email: senderEmail, name: senderName },
    to: [{ email: to }],
    subject: `Your InfraHub OTP Code`,
    textContent: `Your OTP code is: ${otp}. It will expire in ${expiresInMinutes} minutes.`,
    htmlContent: `
      <div style="background-color:#f4f5f7; padding:40px 0; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <table align="center" width="100%" style="max-width:600px; background-color:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 2px 6px rgba(0,0,0,0.05);">
          <tr>
            <td style="padding:40px 30px; text-align:center;">
              <h1 style="color:#4f46e5; font-size:24px; margin-bottom:16px;">Your OTP Code 🚀</h1>
              <p style="color:#374151; font-size:16px; margin-bottom:24px;">
                Hello,
                <br /><br />
                Your One-Time Password (OTP) for InfraHub is:
              </p>

              <p style="font-size:28px; font-weight:bold; color:#1e3a8a; margin-bottom:24px;">
                ${otp}
              </p>

              <p style="color:#6b7280; font-size:14px;">
                This OTP will expire in ${expiresInMinutes} minutes.
              </p>

              <hr style="border:none; border-top:1px solid #e5e7eb; margin:32px 0;" />

              <p style="color:#9ca3af; font-size:13px;">
                If you did not request this, you can safely ignore this email.
              </p>
              <p style="color:#9ca3af; font-size:13px;">— The InfraHub Team</p>
            </td>
          </tr>
        </table>
      </div>
    `,
  };

  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Brevo API error: ${res.status} ${text}`);
    }
  } catch (err) {
    console.error("❌ Error sending OTP email via Brevo:", err);
    throw err;
  }
}
