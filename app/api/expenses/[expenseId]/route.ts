import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { expenseId: string } }
) {
  try {
    const expense = await prisma.expenses.findUnique({
      where: { expenseId: params.expenseId },
    });

    if (!expense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    return NextResponse.json(expense);
  } catch (error) {
    console.error("Error fetching expense:", error);
    return NextResponse.json(
      { error: "Failed to fetch expense" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { expenseId: string } }
) {
  try {
    const body = await req.json();
    const { amount, category } = body;

    if (!amount || !category) {
      return NextResponse.json(
        { error: "Amount and category are required" },
        { status: 400 }
      );
    }

    const expense = await prisma.expenses.update({
      where: { expenseId: params.expenseId },
      data: { amount, category },
    });

    return NextResponse.json(expense);
  } catch (error) {
    console.error("Error updating expense:", error);
    return NextResponse.json(
      { error: "Failed to update expense" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { expenseId: string } }
) {
  try {
    await prisma.expenses.delete({
      where: { expenseId: params.expenseId },
    });

    return NextResponse.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Error deleting expense:", error);
    return NextResponse.json(
      { error: "Failed to delete expense" },
      { status: 500 }
    );
  }
}
