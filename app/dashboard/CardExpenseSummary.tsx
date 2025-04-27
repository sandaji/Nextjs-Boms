"use client";

import {
  ExpenseByCategorySummary,
  useGetDashboardMetricsQuery,
} from "../../state/api";
import { TrendingUp } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import Loading from "../(components)/Loading";

type ExpenseSums = {
  [category: string]: number;
};

const colors = [
  "#22c55e", // emerald-500
  "#6366f1", // indigo-500
  "#f97316", // orange-500
  "#eab308", // yellow-500
  "#3b82f6", // blue-500
];

const calculateExpenseCategories = (
  expenseByCategorySummary: ExpenseByCategorySummary[]
) => {
  const expenseSums = expenseByCategorySummary.reduce(
    (acc: ExpenseSums, item: ExpenseByCategorySummary) => {
      const category = item.category + " Expenses";
      const amount = parseInt(item.amount, 10);
      if (!acc[category]) acc[category] = 0;
      acc[category] += amount;
      return acc;
    },
    {}
  );

  return Object.entries(expenseSums).map(([name, value]) => ({
    name,
    value,
  }));
};

const CardExpenseSummary = () => {
  const { data: dashboardMetrics, isLoading } = useGetDashboardMetricsQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-200 dark:bg-slate-800 rounded-2xl">
        <Loading />
      </div>
    );
  }

  if (!dashboardMetrics || !dashboardMetrics.expenseByCategorySummary) {
    return (
      <div className="text-center py-6 text-sm text-slate-500 dark:text-slate-400">
        Failed to load expense summary.
      </div>
    );
  }

  const expenseSummary = dashboardMetrics?.expenseSummary?.[0] || {
    totalExpenses: 0,
  };

  const expenseByCategorySummary =
    dashboardMetrics?.expenseByCategorySummary || [];
  const expenseCategories = calculateExpenseCategories(
    expenseByCategorySummary
  );

  const totalExpenses = expenseCategories.reduce(
    (acc, category) => acc + category.value,
    0
  );

  const formattedTotalExpenses = totalExpenses.toLocaleString("en-KE");

  return (
    <div className="row-span-3 min-h-[440px] bg-slate-200 dark:bg-slate-800 rounded-2xl flex flex-col justify-between border border-slate-900 dark:border-slate-300 shadow-md transition-colors duration-300">
      {/* HEADER */}
      <div>
        <h2 className="text-lg font-semibold px-7 pt-5 pb-2 text-slate-900 dark:text-slate-100">
          Expense Summary
        </h2>
        <hr className="border-border" />
      </div>

      {/* BODY */}
      <div className="xl:flex justify-between items-center px-7 pt-6 gap-4">
        {/* PIE CHART */}
        <div className="relative basis-3/5">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={expenseCategories}
                innerRadius={70}
                outerRadius={90}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
              >
                {expenseCategories.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#f1f5f9", // slate-100
                  border: "1px solid #cbd5e1", // slate-300
                  borderRadius: "8px",
                  padding: "10px",
                  color: "#0f172a", // slate-900
                }}
                formatter={(value: number, name: string) => [
                  `Ksh ${value.toLocaleString("en-KE")}`,
                  name,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <span className="font-bold text-xl text-slate-900 dark:text-slate-200">
              KSH {formattedTotalExpenses}
            </span>
          </div>
        </div>

        {/* LEGENDS */}
        <ul className="flex flex-col justify-center xl:items-start py-2 gap-3 text-sm text-slate-700 dark:text-slate-300">
          {expenseCategories.map((entry, index) => (
            <li
              key={`legend-${index}`}
              className="flex items-center hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
            >
              <span
                className="mr-2 w-3 h-3 rounded-full"
                style={{ backgroundColor: colors[index % colors.length] }}
              ></span>
              {entry.name}
            </li>
          ))}
        </ul>
      </div>

      {/* FOOTER */}
      <div className="px-7 pt-3 pb-5">
        <hr className="border-border" />
        <div className="flex justify-between items-center text-sm text-slate-700 dark:text-slate-300 pt-3">
          <p>
            Average:{" "}
            <span className="font-semibold text-foreground">
              Ksh {expenseSummary.totalExpenses.toLocaleString("en-KE")}
            </span>
          </p>
          <span className="flex items-center text-green-600 dark:text-green-400">
            <TrendingUp className="w-4 h-4 mr-1" />
            30%
          </span>
        </div>
      </div>
    </div>
  );
};

export default CardExpenseSummary;
