"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Mail } from "lucide-react";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [step, setStep] = useState<"email" | "otp" | "reset" | "success">(
    "email"
  );
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to send OTP");

      toast.success("OTP sent! Check your email.");
      setStep("otp");
      inputRefs.current[0]?.focus();
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    const val = e.target.value.replace(/\D/g, "");
    const newOtp = [...otp];
    newOtp[idx] = val;
    setOtp(newOtp);

    if (val && idx < 5) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    idx: number
  ) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      const newOtp = [...otp];
      newOtp[idx - 1] = "";
      setOtp(newOtp);
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const otpValue = otp.join("");

      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpValue }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "OTP verification failed");

      toast.success("OTP verified! Set your new password.");
      setStep("reset");
    } catch (err) {
      console.error(err);
      toast.error(
        err instanceof Error ? err.message : "OTP verification failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Password reset failed");

      toast.success("Password reset successfully! Logging you in...");
      setStep("success");

      // Auto-login using Auth.js
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password: newPassword,
      });

      if (!result?.ok) {
        throw new Error(result?.error || "Login failed");
      }

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-950 text-gray-100 p-4">
      <Card className="w-full max-w-md py-6 bg-gray-900 border border-gray-800 shadow-xl rounded-2xl animate-in fade-in-50">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
          </div>
          <CardTitle className="text-2xl text-center text-white">
            {step === "email" && "Reset Password"}
            {step === "otp" && "Enter OTP"}
            {step === "reset" && "Set New Password"}
            {step === "success" && "Success!"}
          </CardTitle>
          <CardDescription className="text-center text-gray-400">
            {step === "email" && "Enter your email to receive a 6-digit OTP"}
            {step === "otp" && `Enter the OTP sent to ${email}`}
            {step === "reset" && "Enter your new password"}
            {step === "success" && "Your password has been reset successfully!"}
          </CardDescription>
        </CardHeader>

        {step === "email" && (
          <CardContent>
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-90 transition-opacity text-white font-medium"
                disabled={loading}
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </Button>
            </form>
          </CardContent>
        )}

        {step === "otp" && (
          <CardContent>
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-300">6-digit OTP</Label>
                <div className="flex justify-between gap-2">
                  {otp.map((digit, idx) => (
                    <Input
                      key={idx}
                      type="text"
                      inputMode="numeric"
                      pattern="\d*"
                      maxLength={1}
                      value={digit}
                      ref={(el) => {
                        inputRefs.current[idx] = el;
                      }}
                      onChange={(e) => handleOtpChange(e, idx)}
                      onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                      className="w-12 h-12 text-center text-white bg-gray-800 border border-gray-700 placeholder:text-gray-500 focus:ring-2 focus:ring-indigo-500 text-lg rounded"
                      required
                    />
                  ))}
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-90 transition-opacity text-white font-medium"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </Button>
            </form>
          </CardContent>
        )}

        {step === "reset" && (
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-gray-300">
                  New Password
                </Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-gray-300">
                  Confirm Password
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-90 transition-opacity text-white font-medium"
                disabled={loading}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          </CardContent>
        )}

        {step === "success" && (
          <CardContent className="space-y-4 text-center flex flex-col items-center justify-center">
            <Loader2 className="animate-spin w-8 h-8 text-indigo-500 mx-auto mb-2" />
            <p className="text-gray-400">Logging in...</p>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
