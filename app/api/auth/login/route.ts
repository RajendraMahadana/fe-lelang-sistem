import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { token, user } = await request.json();

    // Validasi minimal
    if (!token || !user?.id) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const response = NextResponse.json({ user });

    // ✅ Set HTTP-only cookie (aman dari XSS)
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 hari
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}