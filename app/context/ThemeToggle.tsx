"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-10 h-10 flex items-center justify-center">
        <div className="w-5 h-5 rounded-full bg-slate-300 dark:bg-slate-600 animate-pulse" />
      </div>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="
        p-2 rounded-full
        bg-slate-200 dark:bg-slate-800
        hover:bg-slate-300 dark:hover:bg-slate-700
        text-slate-700 dark:text-slate-300
        focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500
        transition-all duration-300
      "
    >
      {isDark ? (
        <Sun
          className="
            w-5 h-5 text-slate-300 
            hover:text-indigo-400 
            transition-all duration-300 transform hover:rotate-12
          "
        />
      ) : (
        <Moon
          className="
            w-5 h-5 text-slate-700 
            hover:text-indigo-600 
            transition-all duration-300 transform hover:rotate-12
          "
        />
      )}
    </button>
  );
};

export default ThemeToggle;
