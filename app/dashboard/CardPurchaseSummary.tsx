import { useGetDashboardMetricsQuery } from "../../state/api";
import { TrendingDown, TrendingUp } from "lucide-react";
import numeral from "numeral";
import React from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Loading from "../(components)/Loading";

const CardPurchaseSummary = () => {
  const { data, isLoading } = useGetDashboardMetricsQuery();
  const purchaseData = React.useMemo(() => {
    if (!data?.purchaseSummary) return [];
    return data.purchaseSummary.map((item) => ({
      ...item,
      date: new Date(item.date).toISOString(),
    }));
  }, [data?.purchaseSummary]);

  const lastDataPoint = purchaseData[purchaseData.length - 1] || null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-100 dark:bg-slate-900">
        <Loading />
      </div>
    );
  }

  return (
    <div
      className="flex flex-col justify-between row-span-3 xl:row-span-4 col-span-1 md:col-span-2 xl:col-span-1 
      bg-slate-200 dark:bg-slate-800 shadow-lg rounded-2xl p-6 h-full border border-slate-900 dark:border-slate-300"
      aria-label="Purchase Summary"
    >
      {/* HEADER */}
      <div>
        <h2 className="text-lg font-semibold mb-2 text-slate-900 dark:text-slate-100">
          Purchase Summary
        </h2>
        <hr className="border-slate-300 dark:border-slate-600" />
      </div>

      {/* BODY */}
      <div className="flex-1 flex flex-col justify-between mt-4">
        {/* BODY HEADER */}
        <div className="mb-4">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Purchased
          </p>
          <div className="flex items-center mt-2">
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {lastDataPoint
                ? numeral(lastDataPoint.totalPurchased).format("ksh0.00a")
                : "0"}
            </p>
            {lastDataPoint && (
              <p
                className={`text-sm ml-3 flex items-center ${
                  lastDataPoint.changePercentage! >= 0
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {lastDataPoint.changePercentage! >= 0 ? (
                  <TrendingUp className="w-5 h-5 mr-1" />
                ) : (
                  <TrendingDown className="w-5 h-5 mr-1" />
                )}
                {Math.abs(lastDataPoint.changePercentage!)}%
              </p>
            )}
          </div>
        </div>

        {/* CHART */}
        <div className="flex-1">
          {purchaseData.length === 0 ? (
            <div className="text-center text-slate-500 dark:text-slate-400">
              No purchase data available.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={purchaseData}
                margin={{ top: 20, right: 0, left: -10, bottom: 30 }}
              >
                <defs>
                  <linearGradient
                    id="colorPurchased"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>{" "}
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => {
                    if (!value) return "";
                    try {
                      const date = new Date(value);
                      if (isNaN(date.getTime())) return "";
                      return new Intl.DateTimeFormat("en-US", {
                        month: "short",
                        day: "numeric",
                      }).format(date);
                    } catch (error) {
                      console.error("Error formatting date:", error);
                      return "";
                    }
                  }}
                  minTickGap={10}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "currentColor" }}
                />
                <YAxis
                  tickFormatter={(value: number) =>
                    `ksh ${(value / 1_000_000).toFixed(2)}m`
                  }
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "currentColor" }}
                />
                <Tooltip
                  formatter={(value: number) => [
                    numeral(value).format("ksh0.0a"),
                  ]}
                  labelFormatter={(label) => {
                    if (!label) return "No date";
                    try {
                      const date = new Date(label);
                      if (isNaN(date.getTime())) return "Invalid date";
                      return date.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      });
                    } catch (error) {
                      console.error("Error formatting tooltip date:", error);
                      return "Invalid date format";
                    }
                  }}
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderColor: "#e5e7eb",
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem",
                    color: "#111827",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="totalPurchased"
                  stroke="#6366f1"
                  fill="url(#colorPurchased)"
                  dot={{ stroke: "#6366f1", strokeWidth: 2, r: 3 }}
                  activeDot={{ r: 5, fill: "#6366f1" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardPurchaseSummary;
