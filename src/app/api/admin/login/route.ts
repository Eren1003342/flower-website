import { NextResponse } from "next/server";
import { ADMIN_COOKIE, createSessionToken, verifyCredentials } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const { username, password } = await request.json();

  if (!verifyCredentials(username, password)) {
    return NextResponse.json({ message: "Geçersiz giriş" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, createSessionToken(username), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
