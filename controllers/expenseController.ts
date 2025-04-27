import { Request, Response } from "express";
import { prisma } from "../utils/prisma";

export const getExpensesByCategory = async (req: Request, res: Response) => {
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

    res.status(200).json(serializedExpenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
};
