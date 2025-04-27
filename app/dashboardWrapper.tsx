"use client";

import React, { useState } from "react";
import Navbar from "./(components)/Navbar";
import Sidebar from "./(components)/Sidebar";
import StoreProvider from "./redux";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen w-full overflow-hidden">
      <Sidebar
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />

      <div
        className={`flex flex-col flex-1 transition-all duration-300 
          ${isSidebarCollapsed ? "md:ml-16" : "md:ml-64"}`}
      >
        <Navbar
          isSidebarCollapsed={isSidebarCollapsed}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
        />

        <main className="flex-1 p-4 md:p-6 lg:p-8 bg-background text-foreground">
          {children}
        </main>
      </div>
    </div>
  );
};

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </StoreProvider>
  );
};

export default DashboardWrapper;
