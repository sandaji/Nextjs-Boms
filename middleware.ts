import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const publicPaths = ["/api/auth/login"];

  if (publicPaths.includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ✅ Don't verify JWT here — just proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/products/:path*",
    "/inventory/:path*",
    "/expenses/:path*",
    "/users/:path*",
    "/settings/:path*",
    "/api/:path*",
  ],
};
