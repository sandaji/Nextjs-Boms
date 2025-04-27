import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../utils/prisma";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const search = searchParams.get("search");

    const products = await prisma.products.findMany({
      where: search
        ? {
            name: {
              contains: search,
              mode: "insensitive",
            },
          }
        : undefined,
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, price, rating, stockQuantity, imageUrl } = body;

    if (!name || !price || !stockQuantity) {
      return NextResponse.json(
        { error: "Missing required fields: name, price, or stockQuantity." },
        { status: 400 }
      );
    }

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required." },
        { status: 400 }
      );
    }

    const product = await prisma.products.create({
      data: {
        name,
        price,
        rating,
        stockQuantity,
        imageUrl,
      },
    });

    return NextResponse.json(
      { message: "Product created successfully", product },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
