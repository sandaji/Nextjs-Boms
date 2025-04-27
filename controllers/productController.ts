import { Request, Response } from "express";
import { prisma } from "../utils/prisma";

export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, price, rating, stockQuantity, imageUrl } = req.body;

    // Validate required fields
    if (!name || !price || !stockQuantity) {
      res
        .status(400)
        .json({
          error: "Missing required fields: name, price, or stockQuantity.",
        });
      return;
    }

    // Validate imageUrl
    if (!imageUrl) {
      res.status(400).json({ error: "Image URL is required." });
      return;
    }

    // Log the received data
    console.log("Received product data:", {
      name,
      price,
      rating,
      stockQuantity,
      imageUrl,
    });

    // Create product in the database
    const product = await prisma.products.create({
      data: {
        name,
        price,
        rating,
        stockQuantity,
        imageUrl,
      },
    });

    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    console.error("Error creating product:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to create product" });
    }
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.products.findMany();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};
