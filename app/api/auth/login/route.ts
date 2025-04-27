import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/utils/prisma";
import { comparePassword, generateToken } from "@/utils/auth";

export async function POST(req: NextRequest) {
  try {
    const { userName, password } = await req.json();

    if (!userName || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    const admin = await prisma.admin.findUnique({
      where: { userName },
    });

    if (!admin) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isPasswordValid = await comparePassword(password, admin.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = generateToken({
      adminId: admin.adminId,
      userName: admin.userName,
    });

    // Set HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 2 * 60 * 60, // 2 hours
    });
    
      
    return NextResponse.json({
      success: true,
      admin: {
        adminId: admin.adminId,
        userName: admin.userName,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
