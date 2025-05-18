"use client";

import {
  ExpenseByCategorySummary,
  useGetExpensesByCategoryQuery,
} from "../../state/api";
import { useMemo, useState } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import Header from "../(components)/Header";
import Loading from "../(components)/Loading";

type AggregatedDataItem = {
  name: string;
  color?: string;
  amount: number;
};

type AggregatedData = {
  [category: string]: AggregatedDataItem;
};

const Expenses = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const {
    data: expensesResponse,
    isLoading,
    isError,
  } = useGetExpensesByCategoryQuery();
  const expenses = useMemo(
    () => expensesResponse?.expenses ?? [],
    [expensesResponse]
  );

  const parseDate = (dateString: string) => {
    try {
      // The date might be in ISO format or another format
      const date = new Date(dateString);
      if (date.toString() === "Invalid Date") {
        return dateString;
      }
      return date.toISOString().split("T")[0];
    } catch (error) {
      console.error("Error parsing date:", error);
      return dateString; // Return original string if parsing fails
    }
  };

  const aggregatedData: AggregatedDataItem[] = useMemo(() => {
    const filtered: AggregatedData = expenses
      .filter((data: ExpenseByCategorySummary) => {
        const matchesCategory =
          selectedCategory === "All" || data.category === selectedCategory;
        const dataDate = parseDate(data.date);
        const matchesDate =
          !startDate ||
          !endDate ||
          (dataDate >= startDate && dataDate <= endDate);
        return matchesCategory && matchesDate;
      })
      .reduce((acc: AggregatedData, data: ExpenseByCategorySummary) => {
        const amount = parseFloat(data.amount);
        if (!acc[data.category]) {
          acc[data.category] = {
            name: data.category,
            amount: 0,
            color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
          };
        }
        acc[data.category].amount += amount;
        return acc;
      }, {});

    return Object.values(filtered);
  }, [expenses, selectedCategory, startDate, endDate]);

  const classNames = {
    container: "bg-gray-100 dark:bg-gray-900",
    label: "block text-sm font-medium text-gray-700 dark:text-gray-300",
    selectInput: `
      mt-1 block w-full pl-3 pr-10 py-2 text-base 
      bg-gray-100 dark:bg-gray-900
      border-gray-200 dark:border-gray-800 
      text-gray-900 dark:text-gray-100
      focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500
      focus:border-indigo-600 dark:focus:border-indigo-500
      hover:border-indigo-500 dark:hover:border-indigo-400
      rounded-md transition-colors duration-300
    `,
    filterCard: `
      w-full md:w-1/3 
      bg-gray-100 dark:bg-gray-900 
      shadow-lg rounded-lg p-6
      border border-gray-200 dark:border-gray-800
    `,
    chartCard: `
      flex-grow 
      bg-gray-100 dark:bg-gray-900 
      shadow-lg rounded-lg p-4 md:p-6
      border border-gray-200 dark:border-gray-800
    `,
  };

  if (isLoading) {
    return (
      <div className="py-4">
        <Loading />
      </div>
    );
  }

  if (isError || !expensesResponse) {
    return (
      <div className="w-full p-3 mt-4 bg-slate-200 dark:bg-gray-900 rounded-lg border border-red-200 dark:border-red-800 flex items-center">
        <div
          aria-label="error icon"
          role="img"
          className="w-8 h-8 border rounded-full border-red-600 dark:border-red-400 flex items-center justify-center"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M14 2V14C14 14.1768 13.9298 14.3464 13.8047 14.4714C13.6797 14.5964 13.5101 14.6667 13.3333 14.6667H2.66667C2.48986 14.6667 2.32029 14.5964 2.19526 14.4714C2.07024 14.3464 2 14.1768 2 14V2C2 1.82319 2.07024 1.65362 2.19526 1.5286C2.32029 1.40357 2.48986 1.33334 2.66667 1.33334H13.3333C13.5101 1.33334 13.6797 1.40357 13.8047 1.5286C13.9298 1.65362 14 1.82319 14 2ZM3.33333 10.6667V13.3333H12.6667V10.6667H3.33333ZM10 11.3333H11.3333V12.6667H10V11.3333Z"
              fill="#DC2626"
            />
          </svg>
        </div>
        <div className="pl-3 w-full flex items-center justify-between">
          <p className="text-sm text-red-600 dark:text-red-400">
            Failed to fetch expenses
          </p>
          <button
            onClick={() => window.location.reload()}
            className="text-xs underline text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={classNames.container}>
      {/* HEADER */}
      <div className="mb-5 ml-6">
        <Header name="Expenses" />
        <p className="text-sm text-gray-700 dark:text-gray-300">
          A visual representation of expenses over time.
        </p>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className={classNames.filterCard}>
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Filter by Category and Date
          </h3>
          <div className="space-y-4">
            {/* CATEGORY */}
            <div>
              <label htmlFor="category" className={classNames.label}>
                Category
              </label>
              <select
                id="category"
                name="category"
                className={classNames.selectInput}
                defaultValue="All"
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option>All</option>
                <option>Office</option>
                <option>Professional</option>
                <option>Salaries</option>
              </select>
            </div>
            {/* DATE INPUTS */}
            <div>
              <label htmlFor="start-date" className={classNames.label}>
                Start Date
              </label>
              <input
                type="date"
                id="start-date"
                name="start-date"
                className={classNames.selectInput}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="end-date" className={classNames.label}>
                End Date
              </label>
              <input
                type="date"
                id="end-date"
                name="end-date"
                className={classNames.selectInput}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* PIE CHART */}
        <div className={classNames.chartCard}>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={aggregatedData}
                cx="50%"
                cy="50%"
                label
                outerRadius={150}
                fill="#6366f1"
                dataKey="amount"
                onMouseEnter={(_, index) => setActiveIndex(index)}
              >
                {aggregatedData.map(
                  (entry: AggregatedDataItem, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === activeIndex ? "#4f46e5" : entry.color}
                    />
                  )
                )}
              </Pie>

              <Tooltip
                contentStyle={{
                  backgroundColor: "#f8fafc",
                  borderColor: "#cbd5e1",
                  borderRadius: "0.5rem",
                  color: "#0f172a",
                  fontSize: "0.875rem",
                }}
                labelStyle={{ color: "#64748b" }}
                itemStyle={{ color: "#334155" }}
              />

              <Legend
                formatter={(value) => (
                  <span className="text-gray-900 dark:text-gray-100">
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Expenses;
