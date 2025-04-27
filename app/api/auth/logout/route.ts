import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });

  // Clear the authentication cookie by setting it with an expired date
  response.cookies.set("token", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0), // Expire immediately
  });

  return response;
}
