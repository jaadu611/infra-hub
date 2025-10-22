import { NextResponse } from "next/server";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Convert OTP expiry to Date if necessary
    const otpExpiry = user.otpExpiresAt ? new Date(user.otpExpiresAt) : null;

    if (user.passwordResetOtp?.toString() !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    if (!otpExpiry || new Date() > otpExpiry) {
      return NextResponse.json({ error: "OTP has expired" }, { status: 400 });
    }

    // Clear OTP fields
    user.passwordResetOtp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    return NextResponse.json({ message: "OTP verified" });
  } catch (err) {
    console.error("Verify OTP error:", err);
    return NextResponse.json(
      { error: "Failed to verify OTP" },
      { status: 500 }
    );
  }
}
