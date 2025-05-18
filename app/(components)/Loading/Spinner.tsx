"use client";

import React from "react";

interface SpinnerProps {
  size?: "small" | "medium" | "large";
  color?: string;
  label?: string;
}

const Spinner = React.memo(({ size = "medium", color = "indigo-600", label = "Loading..." }: SpinnerProps) => {
  const sizeClasses = {
    small: "h-6 w-6 border-b-2",
    medium: "h-12 w-12 border-b-2",
    large: "h-16 w-16 border-b-4",
  };

  return (
    <div className="flex items-center justify-center" role="status">
      <div
        className={`animate-spin rounded-full ${sizeClasses[size]} border-${color}`}
      ></div>
      <span className="sr-only">{label}</span>
    </div>
  );
});

export default Spinner;