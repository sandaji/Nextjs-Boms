import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/config/cloudinary";

const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
const maxSize = 10 * 1024 * 1024; // 10MB

interface CloudinaryResponse {
  secure_url: string;
  [key: string]: any;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, and GIF are allowed." },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size exceeds 10MB limit." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "products",
        },
        (error, result) => {
          if (error) reject(error);
          if (result) resolve(result);
        }
      );

      require("stream").Readable.from(buffer).pipe(uploadStream);
    });

    return NextResponse.json({
      success: true,
      imageUrl: result.secure_url,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
