import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest, verifyToken } from "@/utils/auth";

export async function GET(req: NextRequest) {
  try {
    const token =  getTokenFromRequest(req); // <-- await + pass req

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        adminId: decoded.adminId,
        userName: decoded.userName,
      },
    });
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
