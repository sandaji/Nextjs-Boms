import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const expenses = await prisma.expenses.findMany({
      skip,
      take: limit,
      orderBy: {
        timestamp: "desc",
      },
    });

    const total = await prisma.expenses.count();

    return NextResponse.json({
      expenses,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return NextResponse.json(
      { error: "Failed to fetch expenses" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, category } = body;

    if (!amount || !category) {
      return NextResponse.json(
        { error: "Amount and category are required" },
        { status: 400 }
      );
    }

    const expense = await prisma.expenses.create({
      data: {
        amount,
        category,
        timestamp: new Date(),
      },
    });

    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    console.error("Error creating expense:", error);
    return NextResponse.json(
      { error: "Failed to create expense" },
      { status: 500 }
    );
  }
}
