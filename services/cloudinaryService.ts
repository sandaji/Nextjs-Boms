import cloudinary from "../config/cloudinary";
import fs from "fs";

export const uploadImageToCloudinary = async (filePath: string): Promise<string> => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "inventory/uploads",
      resource_type: "image",
      transformation: [
        { width: 500, height: 500, crop: "fill" },
        { quality: "auto" },
        { fetch_format: "auto" },
      ],
    });
    return result.secure_url;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw new Error("Failed to upload image to Cloudinary");
  } finally {
    fs.unlinkSync(filePath); // Clean up temporary file
  }
};