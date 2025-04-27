import Image from "next/image";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { useToast } from "../context/ToastContext";
import InputField from "../context/InputField";

interface ProductFormData {
  name: string;
  price: number;
  stockQuantity: number;
  rating: number;
  imageUrl?: string;
  min?: number;
}

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (formData: ProductFormData) => void;
}

const classNames = {
  overlay:
    "fixed inset-0 bg-black/40 dark:bg-black/60 overflow-y-auto h-full w-full z-20",
  modal:
    "relative top-20 mx-auto p-5 w-96 rounded-2xl shadow-xl bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-600",
  title: "text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4",
  fileInput: `
    block w-full mb-4 p-2 rounded-md
    bg-white dark:bg-slate-700
    border border-slate-300 dark:border-slate-600
    text-slate-800 dark:text-slate-100
    placeholder-slate-500 dark:placeholder-slate-400
    hover:border-indigo-500 dark:hover:border-indigo-400
    focus:outline-none focus:ring-2 
    focus:ring-indigo-500
    transition-all duration-300
  `,
  imagePreview: "mt-4 flex justify-center",
  image:
    "w-32 h-32 object-cover rounded-xl border border-slate-300 dark:border-slate-600",
  buttonContainer: "flex justify-end mt-6 gap-2",
  submitButton: `
    px-4 py-2 rounded-lg
    bg-indigo-600 hover:bg-indigo-700 
    dark:bg-indigo-500 dark:hover:bg-indigo-400
    text-white font-semibold
    disabled:bg-slate-300 dark:disabled:bg-slate-700
    disabled:text-slate-500 dark:disabled:text-slate-400
    transition-colors duration-300
  `,
  cancelButton: `
    px-4 py-2 rounded-lg
    bg-slate-300 hover:bg-slate-400 
    dark:bg-slate-700 dark:hover:bg-slate-600
    text-slate-900 dark:text-slate-100
    font-medium
    transition-colors duration-300
  `,
};


const CreateProductModal: React.FC<CreateProductModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    price: 0,
    stockQuantity: 0,
    rating: 0,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "price" || name === "stockQuantity" || name === "rating"
          ? parseFloat(value)
          : value,
    });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const validateForm = (): boolean => {
    const { name, price, stockQuantity, rating } = formData;

    if (!name || price <= 0 || stockQuantity < 0 || rating < 0 || rating > 5) {
      addToast(
        "error",
        "Please fill in all fields correctly.",
        "Validation Error"
      );
      return false;
    }

    if (!imageFile) {
      addToast("error", "Please select an image file.", "Validation Error");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    const formDataToSend = new FormData();
    if (imageFile) formDataToSend.append("image", imageFile);

    try {
      const response = await fetch("/api/upload/uploadImage", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.imageUrl) {
        setFormData((prev) => ({ ...prev, imageUrl: data.imageUrl }));
        onCreate({ ...formData, imageUrl: data.imageUrl });
        onClose();
        addToast("success", "Product created successfully!", "Success");
      } else {
        throw new Error("Invalid response from server: Missing imageUrl");
      }
    } catch (error: any) {
      console.error("Error uploading image:", error.message || error);
      addToast("error", "Failed to upload image. Please try again.", "Error");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={classNames.overlay}>
      <div className={classNames.modal}>
        <h1 className={classNames.title}>Create New Product</h1>
        <form onSubmit={handleSubmit} className="mt-5">
          <InputField
            label="Product Name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required={true}
          />

          <InputField
            label="Price"
            name="price"
            type="number"
            value={formData.price.toString()}
            onChange={handleChange}
            required={true}
          />

          <InputField
            label="Stock Quantity"
            name="stockQuantity"
            type="number"
            value={formData.stockQuantity.toString()}
            onChange={handleChange}
            required={true}
          />

          <InputField
            label="Rating"
            name="rating"
            type="number"
            value={formData.rating.toString()}
            onChange={handleChange}
            min={0}
            max={5}
            step={0.1}
            required={true}
          />

          <label
            htmlFor="productImage"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Product Image
          </label>
          <input
            type="file"
            id="productImage"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className={classNames.fileInput}
            required={true}
          />

          {imagePreview && (
            <div className={classNames.imagePreview}>
              <Image
                src={imagePreview}
                alt="Preview"
                width={128}
                height={128}
                className={classNames.image}
              />
            </div>
          )}

          <div className={classNames.buttonContainer}>
            <button
              type="submit"
              className={classNames.submitButton}
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create"}
            </button>
            <button
              onClick={onClose}
              type="button"
              className={classNames.cancelButton}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProductModal;
