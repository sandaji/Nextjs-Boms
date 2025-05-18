"use client";

import { PlusCircleIcon, SearchIcon } from "lucide-react";
import { useState } from "react";
import CreateProductModal from "./CreateProductModal";
import Image from "next/image";
import { useCreateProductMutation, useGetProductsQuery } from "../../state/api";
import Header from "../(components)/Header";
import Rating from "../(components)/Rating";
import Loading from "../(components)/Loading";

type ProductFormData = {
  name: string;
  price: number;
  stockQuantity: number;
  rating: number;
};

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: products,
    isLoading,
    isError,
  } = useGetProductsQuery(searchTerm);

  const [createProduct] = useCreateProductMutation();
  const handleCreateProduct = async (productData: ProductFormData) => {
    await createProduct(productData);
  };

  if (isLoading) {
    return (
      <div className="py-4 text-center text-slate-500 dark:text-slate-300">
        <Loading />
      </div>
    );
  }

  if (isError || !products) {
    return (
      <div className="text-center text-red-600 dark:text-red-400 py-4">
        Failed to fetch products
      </div>
    );
  }

  return (
    <div className="mx-auto pb-8 px-4 bg-slate-200 dark:bg-slate-800 min-h-screen">
      {/* SEARCH BAR */}
      <div className="mb-6">
        <div className="flex items-center bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm">
          <SearchIcon className="w-5 h-5 text-slate-500 m-2" />
          <input
            className="w-full py-2 px-3 rounded-r-md bg-transparent focus:outline-none text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* HEADER BAR */}
      <div className="flex justify-between items-center mb-6">
        <Header name="Products" />
        <button
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          onClick={() => setIsModalOpen(true)}
        >
          <PlusCircleIcon className="w-5 h-5" />
          Create Product
        </button>
      </div>

      {/* PRODUCT GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.productId}
            className="rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 shadow hover:shadow-md transition-shadow p-5 flex flex-col items-center text-center"
          >
            <Image
              src={product.imageUrl || "/assets/product1.png"}
              alt={product.name}
              width={150}
              height={150}
              className="mb-3 rounded-xl object-cover w-36 h-36"
            />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {product.name}
            </h3>
            <p className="text-slate-700 dark:text-slate-300 font-medium">
              ksh {product.price.toFixed(2)}
            </p>
            <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Stock: {product.stockQuantity}
            </div>
            {product.rating && (
              <div className="mt-2">
                <Rating rating={product.rating} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* MODAL */}
      <CreateProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateProduct}
      />
    </div>
  );
};

export default Products;
