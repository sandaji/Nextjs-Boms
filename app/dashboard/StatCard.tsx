import { LucideIcon } from "lucide-react";
import React from "react";

type StatDetail = {
  title: string;
  amount: string;
  changePercentage: number;
  IconComponent: LucideIcon;
};

type StatCardProps = {
  title: string;
  primaryIcon: React.ReactNode;
  details: StatDetail[];
  dateRange: string;
};

const StatCard = ({
  title,
  primaryIcon,
  details,
  dateRange,
}: StatCardProps) => {
  const formatPercentage = (value: number) => {
    const signal = value >= 0 ? "+" : "";
    return `${signal}${value.toFixed()}%`;
  };

  const getChangeColor = (value: number) =>
    value >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500";

  return (
    <div className="col-span-1 md:row-span-1 xl:row-span-2 rounded-2xl flex flex-col bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-700 border border-slate-300 dark:border-slate-600 shadow-md transition-all duration-300 hover:scale-[1.015] hover:shadow-lg">
      {/* HEADER */}
      <div>
        <div className="flex justify-between px-4 pt-4 pb-2 items-center">
          <h2 className="font-semibold text-lg text-slate-800 dark:text-slate-100">
            {title}
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {dateRange}
          </span>
        </div>
        <hr className="border-slate-300 dark:border-slate-600" />
      </div>

      {/* BODY */}
      <div className="flex items-center justify-around gap-4 px-4 pb-5 pt-">
        {/* Icon */}
        <div className="rounded-full p-1 bg-indigo-100 dark:bg-indigo-400/10 border border-indigo-300 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400">
          {primaryIcon}
        </div>

        {/* Stat details */}
        <div className="flex-1 space-y-4">
          {details.map((detail, index) => (
            <React.Fragment key={index}>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-700 dark:text-slate-300">
                  {detail.title}
                </span>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {detail.amount}
                </span>
                <div className="flex items-center">
                  <detail.IconComponent
                    className={`w-4 h-4 mr-1 ${getChangeColor(
                      detail.changePercentage
                    )}`}
                  />
                  <span className={`font-medium ${getChangeColor(detail.changePercentage)}`}>
                    {formatPercentage(detail.changePercentage)}
                  </span>
                </div>
              </div>
              {index < details.length - 1 && (
                <hr className="border-slate-300 dark:border-slate-600" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
