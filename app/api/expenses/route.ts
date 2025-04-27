import { NextResponse } from "next/server";
import { prisma } from "../../../utils/prisma";

export async function GET() {
  try {
    const expenses = await prisma.expenseByCategory.findMany({
      orderBy: {
        date: "desc",
      },
    });

    // Convert BigInt to string for JSON serialization
    const serializedExpenses = expenses.map((expense) => ({
      ...expense,
      amount: expense.amount.toString(),
    }));

    return NextResponse.json(serializedExpenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return NextResponse.json(
      { error: "Failed to fetch expenses" },
      { status: 500 }
    );
  }
}
