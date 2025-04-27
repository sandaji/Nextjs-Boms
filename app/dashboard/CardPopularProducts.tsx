import { useGetDashboardMetricsQuery } from "../../state/api";
import { ShoppingBag } from "lucide-react";
import React from "react";
import Rating from "../(components)/Rating";
import Image from "next/image";
import Loading from "../(components)/Loading";

const CardPopularProducts = () => {
  const { data: dashboardMetrics, isLoading } = useGetDashboardMetricsQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loading />
      </div>
    );
  }

  if (!dashboardMetrics || !dashboardMetrics.popularProducts) {
    return (
      <div className="text-center py-4 text-slate-600 dark:text-slate-400">
        <p>Failed to load popular products.</p>
      </div>
    );
  }

  return (
    <div className="row-span-3 xl:row-span-6 h-full shadow-lg rounded-2xl bg-slate-200 dark:bg-slate-800 border border-slate-900 dark:border-slate-300 transition-all duration-300 flex flex-col">
      {/* HEADER */}
      <div className="px-7 pt-5 pb-2">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Popular Products
        </h3>
      </div>
      <hr className="border-slate-300 dark:border-slate-600" />

      {/* BODY */}
      <div className="flex-1 overflow-auto divide-y divide-slate-300 dark:divide-slate-600">
        {dashboardMetrics.popularProducts.map((product) => (
          <div
            key={product.productId}
            className="flex items-center justify-between gap-3 px-5 py-2 transition-colors duration-300"
          >
            {/* PRODUCT IMAGE AND DETAILS */}
            <div className="flex items-center gap-3">
              <Image
                src={product.imageUrl || "/assets/product1.png"}
                alt={product.name}
                width={48}
                height={48}
                className="rounded-lg w-14 h-14 object-cover bg-slate-200 dark:bg-slate-700"
                onError={(e) => {
                  e.currentTarget.src = "/assets/product1.png";
                }}
              />
              <div className="flex flex-col justify-between gap-1">
                <div className="font-bold text-slate-900 dark:text-slate-100">
                  {product.name}
                </div>
                <div className="flex text-sm items-center">
                  <span className="font-bold text-xs">KSH {product.price}</span>
                  <span className="mx-2 text-slate-400 dark:text-slate-500">|</span>
                  <Rating rating={product.rating || 0} />
                </div>
              </div>
            </div>

            {/* ACTION BUTTON AND STOCK INFO */}
            <div className="text-xs flex items-center">
              <button
                className="p-2 rounded-full 
                  bg-indigo-100 dark:bg-indigo-600/20 
                  text-indigo-600 dark:text-indigo-400 
                  hover:bg-indigo-200 dark:hover:bg-indigo-600/30 
                  focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 
                  focus:outline-none transition-colors duration-300"
                aria-label={`View ${product.name}`}
              >
                <ShoppingBag className="w-4 h-4" />
              </button>
              <span className="text-slate-700 dark:text-slate-300 ml-2">
                {Math.round(product.stockQuantity / 1000)}k Sold
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardPopularProducts;
