import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = cookies();
    const existingToken = (await cookieStore).get("infra_token");

    if (!existingToken) {
      return NextResponse.json({
        success: true,
        message: "No active session found — already logged out.",
      });
    }

    (await cookieStore).set({
      name: "infra_token",
      value: "",
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/dashboard",
      expires: new Date(0),
    });

    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    console.error("[POST /api/client/logout] Error:", err);

    // Fallback: always clear cookie even if something goes wrong
    const res = NextResponse.json(
      { success: false, error: "Logout failed — cookie cleared defensively" },
      { status: 500 }
    );
    res.cookies.set("infra_token", "", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/dashboard",
      expires: new Date(0),
    });
    return res;
  }
}
