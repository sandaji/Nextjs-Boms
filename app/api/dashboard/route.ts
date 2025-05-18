import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

// Helper function to safely serialize BigInt values and format dates
const serializeData = (data: any): any => {
  if (Array.isArray(data)) {
    return data.map(serializeData);
  }
  if (typeof data === "object" && data !== null) {
    if (data instanceof Date) {
      return data.toISOString();
    }
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, serializeData(value)])
    );
  }
  if (typeof data === "bigint") {
    return data.toString();
  }
  return data;
};

export async function GET(req: NextRequest) {
  try {
    const popularProducts = await prisma.products.findMany({
      take: 15,
      orderBy: {
        stockQuantity: "desc",
      },
    });

    const salesSummary = await prisma.salesSummary.findMany({
      take: 5,
      orderBy: {
        date: "desc",
      },
    });

    const purchaseSummary = await prisma.purchaseSummary.findMany({
      take: 5,
      orderBy: {
        date: "desc",
      },
    });

    const expenseSummary = await prisma.expenseSummary.findMany({
      take: 5,
      orderBy: {
        date: "desc",
      },
    });

    const expenseByCategorySummary = await prisma.expenseByCategory.findMany({
      take: 5,
      orderBy: {
        date: "desc",
      },
    }); // Serialize all data to handle BigInt values and dates
    const serializedData = serializeData({
      popularProducts,
      salesSummary,
      purchaseSummary,
      expenseSummary,
      expenseByCategorySummary,
    });

    return NextResponse.json(serializedData);
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard metrics" },
      { status: 500 }
    );
  }
}
