"use client";

import {
  Archive,
  CircleDollarSign,
  Clipboard,
  Layout,
  LucideIcon,
  Menu,
  SlidersHorizontal,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isCollapsed: boolean;
}

const SidebarLink = ({
  href,
  icon: Icon,
  label,
  isCollapsed,
}: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive =
    pathname === href || (pathname === "/" && href === "/dashboard");

  return (
    <Link href={href} title={isCollapsed ? label : undefined}>
      <div
        className={`
          group cursor-pointer flex items-center gap-3
          transition-all duration-300
          border-l-4 text-sm
          ${isCollapsed ? "justify-center px-3 py-4" : "px-6 py-4"}
          ${
            isActive
              ? "border-indigo-500 bg-slate-300/60 dark:bg-slate-700"
              : "border-transparent hover:bg-slate-300/50 dark:hover:bg-slate-700/40"
          }
        `}
      >
        <Icon
          className={`w-5 h-5 transition-colors duration-300 ${
            isActive
              ? "text-indigo-600 dark:text-indigo-400"
              : "text-slate-500 group-hover:text-indigo-600 dark:text-slate-400 dark:group-hover:text-indigo-400"
          }`}
        />
        <span
          className={`
            font-medium transition-all duration-300
            overflow-hidden whitespace-nowrap
            ${
              isCollapsed
                ? "w-0 opacity-0"
                : "w-auto opacity-100 text-slate-700 dark:text-slate-300"
            }
          `}
        >
          {label}
        </span>
      </div>
    </Link>
  );
};

const Sidebar = ({
  isSidebarCollapsed,
  setIsSidebarCollapsed,
}: {
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const navigationLinks = [
    { href: "/", icon: Layout, label: "Dashboard" },
    { href: "/inventory", icon: Archive, label: "Inventory" },
    { href: "/products", icon: Clipboard, label: "Products" },
    { href: "/users", icon: User, label: "Users" },
    { href: "/settings", icon: SlidersHorizontal, label: "Settings" },
    { href: "/expenses", icon: CircleDollarSign, label: "Expenses" },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <aside
      className={`
        fixed z-40 h-full flex flex-col
        transition-all duration-300 ease-in-out
        bg-slate-200 dark:bg-slate-900 border-r border-slate-300 dark:border-slate-700
        ${isSidebarCollapsed ? "w-16" : "w-64"}
      `}
    >
      {/* TOP LOGO */}
      <div
        className={`
          flex items-center h-16 border-b border-slate-300 dark:border-slate-700
          transition-all duration-300
          ${isSidebarCollapsed ? "justify-center" : "justify-between px-6"}
        `}
      >
        <Image
          src="https://res.cloudinary.com/ijamy/image/upload/v1742133730/inventory/qp6xlabvjlstlky5tf8i.png"
          alt="BOMS-logo"
          width={28}
          height={28}
          className="rounded-lg"
          onError={(e) => {
            e.currentTarget.src = "/assets/default-logo.png";
          }}
        />
        {!isSidebarCollapsed && (
          <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">BOMS</h1>
        )}
        <button
          className="md:hidden p-2 rounded-md hover:bg-slate-300/50 dark:hover:bg-slate-700/40 transition"
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-5 h-5 text-slate-500 dark:text-slate-400" />
        </button>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-grow">
        {navigationLinks.map((link) => (
          <SidebarLink
            key={link.href}
            {...link}
            isCollapsed={isSidebarCollapsed}
          />
        ))}
      </nav>

      {/* FOOTER */}
      <footer
        className={`
          text-xs text-slate-500 dark:text-slate-400
          border-t border-slate-300 dark:border-slate-700
          py-4 transition-all duration-300
          ${isSidebarCollapsed ? "text-center px-2" : "px-6"}
        `}
      >
        &copy; {currentYear} BOMS
      </footer>
    </aside>
  );
};

export default Sidebar;
