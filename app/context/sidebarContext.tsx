import React, { createContext, useState } from "react";

interface SidebarContextType {
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

// Initialize the context with a default value
export const SidebarContext = createContext<SidebarContextType | undefined>(
  undefined
);

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  return (
    <SidebarContext.Provider value={{ isSidebarCollapsed, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};