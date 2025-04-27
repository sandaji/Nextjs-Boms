"use client";

import ThemeToggle from "@/app/context/ThemeToggle";
import { Bell, Menu, Settings, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";

const Navbar = ({
  isSidebarCollapsed,
  setIsSidebarCollapsed,
}: {
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { logout, isAuthenticated, user } = useAuth();

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleLogout = async () => {
    logout();
  };

  const iconButton =
    "p-2 rounded-full hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors duration-300";

  return (
    <div className="w-full h-16 top-0 z-50 bg-slate-200 dark:bg-slate-800 border-b border-slate-900 dark:border-slate-300 transition-colors duration-300">
      <div className="flex justify-between items-center h-full w-full px-4 sm:px-6 md:px-8">
        {/* LEFT SIDE */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className={iconButton}
            aria-label="Toggle Sidebar"
          >
            <Menu className="w-5 h-5 text-slate-800 dark:text-slate-100" />
          </button>

          <div className="relative">
            <input
              type="search"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 w-44 sm:w-56 md:w-64 rounded-lg border border-slate-400 dark:border-slate-600
              bg-white dark:bg-slate-700 text-sm text-slate-800 dark:text-slate-100
              placeholder-slate-500 dark:placeholder-slate-400
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
              transition-colors duration-300"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Bell className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

          <div className="relative">
            <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            <span className="absolute -top-2 -right-2 flex items-center justify-center px-[0.4rem] py-1 text-xs font-semibold leading-none text-white bg-indigo-600 dark:bg-indigo-500 rounded-full">
              3
            </span>
          </div>

          {/* Profile section - shown only if authenticated */}
          {isAuthenticated && user && (
            <div className="hidden md:flex items-center gap-2">
              <Image
                src="/assets/profile.jpg"
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full object-cover ring-2 ring-slate-400 dark:ring-slate-600"
                onError={(e) => {
                  e.currentTarget.src = "/assets/default-profile.jpg";
                }}
              />
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                {user.userName}
              </span>
            </div>
          )}

          <Link
            href="/settings"
            className={iconButton}
            aria-label="Settings"
          >
            <Settings className="w-5 h-5 text-slate-700 dark:text-slate-300" />
          </Link>

          <button
            onClick={handleLogout}
            className={iconButton}
            aria-label="Logout"
          >
            <LogOut className="w-5 h-5 text-slate-700 dark:text-slate-300" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
