// app/AppClientWrapper.tsx
"use client";

import { usePathname } from "next/navigation";
import { ToastProvider } from "./context/ToastContext";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardWrapper from "./dashboardWrapper"; // Contains Redux Provider

export function AppClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  // If you want Theme/Toast on login page too, adjust logic here
  if (isLoginPage) {
    return <>{children}</>; // Render only children for login page
  }

  // Structure for non-login pages
  return (

      <ToastProvider>
        <DashboardWrapper> {/* Includes Redux StoreProvider */}
          <ProtectedRoute>{children}</ProtectedRoute>
        </DashboardWrapper>
      </ToastProvider>
  
  );
}
