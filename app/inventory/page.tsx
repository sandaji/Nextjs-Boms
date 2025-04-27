"use client";

import { useState } from "react";
import Header from "../(components)/Header";
import Loading from "../(components)/Loading";
import { useGetProductsQuery } from "../../state/api";
import { CirclePlus } from "lucide-react";
import { useToast } from "../context/ToastContext";

const ROWS_PER_PAGE = 10; // Maximum rows per page

const Inventory = () => {
  const { data: products, isError, isLoading } = useGetProductsQuery();
  const [currentPage, setCurrentPage] = useState(1);
  const { addToast } = useToast();

  if (isLoading) {
    return (
      <div className="py-4 bg-gray-100 dark:bg-gray-900">
        <Loading />
      </div>
    );
  }

  if (isError || !products) {
    addToast("error", "Failed to fetch Products", "Error");
    return (
      <div className="flex items-center justify-center py-4 text-red-600 dark:text-red-400">
        <button
          onClick={() => window.location.reload()}
          className="underline hover:text-red-700 dark:hover:text-red-300 transition-colors"
        >
          Failed to load products. Click to retry.
        </button>
      </div>
    );
  }

  // Pagination Logic
  const totalPages = Math.ceil(products.length / ROWS_PER_PAGE);
  const paginatedProducts = products.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  );

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxButtons = Math.min(5, totalPages);

    for (let i = 0; i < maxButtons; i++) {
      let page;
      if (currentPage <= 3) {
        page = i + 1;
      } else if (currentPage >= totalPages - 2) {
        page = totalPages - maxButtons + i + 1;
      } else {
        page = currentPage - 2 + i;
      }

      buttons.push(
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`w-10 h-10 rounded-md text-sm font-medium ${
            currentPage === page
              ? "bg-blue-600 text-white dark:bg-blue-700"
              : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          }`}
        >
          {page}
        </button>
      );
    }

    return (
      <>
        {buttons}
        {totalPages > maxButtons && currentPage < totalPages - 2 && (
          <span className="px-2 text-gray-500">...</span>
        )}
      </>
    );
  };

  return (
<div className="container mx-auto px-4 py-6 bg-slate-100 dark:bg-slate-900">
  {/* HEADER */}
  <Header name="Inventory" />

  {/* TABLE */}
  <div className="overflow-x-auto my-6 rounded-lg border border-slate-300 dark:border-slate-700 shadow-md">
    <table className="w-full text-sm min-w-max">
      <thead>
        <tr className="bg-slate-200 dark:bg-slate-800 text-left">
          <th className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">No.</th>
          <th className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">ID</th>
          <th className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">Product Name</th>
          <th className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">Price</th>
          <th className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">Rating</th>
          <th className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">Available</th>
          <th className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-300 dark:divide-slate-700">
        {paginatedProducts.map((product, index) => (
          <tr
            key={product.productId}
            className={`
              transition-colors
              ${index % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50 dark:bg-slate-800/50"}
              hover:bg-slate-200 dark:hover:bg-slate-800
            `}
          >
            <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
              {(currentPage - 1) * ROWS_PER_PAGE + index + 1}
            </td>
            <td className="px-4 py-3 text-slate-700 dark:text-slate-300 font-mono">
              {product.productId}
            </td>
            <td className="px-4 py-3 text-slate-900 dark:text-slate-100 font-medium">
              {product.name}
            </td>
            <td className="px-4 py-3 text-slate-900 dark:text-slate-100">
              {product.price.toLocaleString()}
            </td>
            <td className="px-4 py-3">
              {product.rating ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                  {product.rating}/5
                </span>
              ) : (
                <span className="text-slate-500 dark:text-slate-400">N/A</span>
              )}
            </td>
            <td className="px-4 py-3">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  product.stockQuantity > 0
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                    : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                }`}
              >
                {product.stockQuantity}
              </span>
            </td>
            <td className="px-4 py-3">
              <button
                onClick={() =>
                  addToast("success", `${product.name} added`, "Success")
                }
                className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors"
                aria-label={`Add ${product.name}`}
              >
                <CirclePlus className="w-5 h-5" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* PAGINATION */}
  <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
    <div className="text-sm text-slate-700 dark:text-slate-300">
      Showing {(currentPage - 1) * ROWS_PER_PAGE + 1} to{" "}
      {Math.min(currentPage * ROWS_PER_PAGE, products.length)} of{" "}
      {products.length} products
    </div>
    <div className="flex items-center gap-2">
      <button
        disabled={currentPage === 1}
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          currentPage === 1
            ? "bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed"
            : "bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500"
        }`}
      >
        Previous
      </button>
      <div className="flex items-center gap-1">
        {renderPaginationButtons()}
      </div>
      <button
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          currentPage === totalPages
            ? "bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed"
            : "bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500"
        }`}
      >
        Next
      </button>
    </div>
  </div>
</div>

  );
};

export default Inventory;
