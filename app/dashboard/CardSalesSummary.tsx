import { TrendingUp } from "lucide-react";
import React, { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useGetDashboardMetricsQuery } from "../../state/api";
import Loading from "../(components)/Loading";

const CardSalesSummary = () => {
  const { data, isLoading, isError } = useGetDashboardMetricsQuery();
  const salesData = data?.salesSummary || [];

  const [timeframe, setTimeframe] = useState("weekly");

  const totalValueSum =
    salesData.reduce((acc, curr) => acc + curr.totalValue, 0) || 0;

  const averageChangePercentage =
    salesData.reduce((acc, curr, _, array) => {
      return acc + curr.changePercentage! / array.length;
    }, 0) || 0;

  const highestValueData = salesData.reduce((acc, curr) => {
    return acc.totalValue > curr.totalValue ? acc : curr;
  }, salesData[0] || {});

  const highestValueDate = highestValueData.date
    ? new Date(highestValueData.date).toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "2-digit",
      })
    : "N/A";

  if (isError) {
    return <div className="m-5 text-destructive">Failed to fetch data</div>;
  }

  return (
    <div className="row-span-3 xl:row-span-6 h-full bg-slate-200 dark:bg-slate-800 shadow-md rounded-2xl flex flex-col border border-slate-900 dark:border-slate-300 text-slate-900 dark:text-slate-100">
      {isLoading ? (
        <div className="m-5">
          <Loading />
        </div>
      ) : (
        <>
          {/* HEADER */}
          <div className="px-7 pt-5 pb-2">
            <h3 className="text-lg font-semibold">Sales Summary</h3>
          </div>
          <hr className="border-slate-300 dark:border-slate-600" />

          {/* BODY */}
          <div className="flex-1 flex flex-col">
            {/* Top section */}
            <div className="flex justify-between items-center mb-4 px-7 mt-5">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                  Value
                </p>
                <div className="text-2xl font-bold flex items-center">
                  <span>
                    Ksh{" "}
                    {(totalValueSum / 1_000_000).toLocaleString("en", {
                      maximumFractionDigits: 2,
                    })}
                    m
                  </span>
                  <span className="text-green-500 text-sm ml-3 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {averageChangePercentage.toFixed(2)}%
                  </span>
                </div>
              </div>

              <select
                className="bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            {/* Chart section */}
            <div className="flex-1 px-7 pb-4">
              {salesData.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-slate-500 dark:text-slate-400">
                  No sales data available.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={salesData}
                    margin={{ top: 0, right: 0, left: -10, bottom: 9 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#cbd5e1"
                    />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        if (isNaN(date.getTime())) return "";
                        return new Intl.DateTimeFormat("en-US", {
                          month: "short",
                          day: "numeric",
                        }).format(date);
                      }}
                      minTickGap={10}
                      tick={{ fill: "currentColor", fontSize: 12 }}
                      axisLine={{ stroke: "#d1d5db" }}
                    />
                    <YAxis
                      tickFormatter={(value) =>
                        `ksh ${(value / 1_000_000).toFixed(0)}m`
                      }
                      tick={{ fontSize: 12, fill: "currentColor", dx: -1 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        borderColor: "#e5e7eb",
                        borderRadius: "0.5rem",
                        fontSize: "0.875rem",
                      }}
                      formatter={(value: number) => [
                        `ksh ${(value / 1_000_000).toFixed(2)}m`,
                      ]}
                      labelFormatter={(label) => {
                        const date = new Date(label);
                        return isNaN(date.getTime())
                          ? "Invalid date"
                          : date.toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            });
                      }}
                    />
                    <Bar
                      dataKey="totalValue"
                      fill="#6366f1"
                      barSize={10}
                      radius={[10, 10, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* FOOTER */}
          <hr className="border-slate-300 dark:border-slate-600" />
          <div className="flex justify-between items-center text-sm text-slate-600 dark:text-slate-400 px-7 py-4">
            <p>{salesData.length || 0} days</p>
            <p>
              Highest Sales Date:{" "}
              <span className="font-bold text-slate-800 dark:text-slate-100">
                {highestValueDate}
              </span>
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default CardSalesSummary;
