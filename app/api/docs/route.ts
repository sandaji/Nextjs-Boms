import { NextRequest, NextResponse } from "next/server";
import { getSwaggerSpec } from "@/config/swagger";

export async function GET(req: NextRequest) {
  const spec = getSwaggerSpec();
  return NextResponse.json(spec);
}
