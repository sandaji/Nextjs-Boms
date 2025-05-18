import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

// Custom JWT payload interface
export interface JWTPayload {
  adminId: string;
  userName: string;
}

// Secret key for signing JWTs
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Generate a JWT token from payload
export const generateToken = (payload: JWTPayload): string => {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "2h" });
};

// Verify the token and return the payload if valid
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded === "string") return null;
    return decoded as JWTPayload;
  } catch (error) {
    console.error("Invalid JWT:", error);
    return null;
  }
}

// Extract the token from request cookies
export function getTokenFromRequest(request: NextRequest): string | null {
  return request.cookies.get("token")?.value || null;
}

// Password hashing
export const hashPassword = async (password: string): Promise<string> => {
  const bcrypt = require("bcryptjs");
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Password comparison
export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  const bcrypt = require("bcryptjs");
  return bcrypt.compare(password, hashedPassword);
};
