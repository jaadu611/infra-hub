import { NextResponse } from "next/server";
import User from "@/models/User";
import { sendOtpEmail } from "@/lib/mailer";
import { connectDB } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    user.passwordResetOtp = otp;
    user.otpExpiresAt = expiresAt;
    await user.save();

    console.log(user);

    await sendOtpEmail({ to: email, otp: otp.toString() });

    return NextResponse.json({
      message: "OTP sent successfully",
    });
  } catch (err) {
    console.error("Error sending OTP:", err);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
