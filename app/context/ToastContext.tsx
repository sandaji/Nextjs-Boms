"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { AlertTriangle, CheckCircle, Info, X, XCircle } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: number;
  type: ToastType;
  message: string;
  title?: string;
}

interface ToastContextType {
  addToast: (type: ToastType, message: string, title?: string) => void;
  removeToast: (id: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (type: ToastType, message: string, title?: string) => {
    const id = Date.now();
    setToasts((prevToasts) => [...prevToasts, { id, type, message, title }]);
  };

  const removeToast = (id: number) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  const toastStyles = {
    success: {
      container:
        "bg-green-100 dark:bg-green-900/20 border-green-500 dark:border-green-500/50",
      icon: "text-green-500 dark:text-green-400",
      title: "text-green-800 dark:text-green-200",
      message: "text-green-700 dark:text-green-300",
    },
    error: {
      container:
        "bg-red-100 dark:bg-red-900/20 border-red-500 dark:border-red-500/50",
      icon: "text-red-500 dark:text-red-400",
      title: "text-red-800 dark:text-red-200",
      message: "text-red-700 dark:text-red-300",
    },
    warning: {
      container:
        "bg-yellow-100 dark:bg-yellow-900/20 border-yellow-500 dark:border-yellow-500/50",
      icon: "text-yellow-500 dark:text-yellow-400",
      title: "text-yellow-800 dark:text-yellow-200",
      message: "text-yellow-700 dark:text-yellow-300",
    },
    info: {
      container:
        "bg-indigo-100 dark:bg-indigo-900/20 border-indigo-500 dark:border-indigo-500/50",
      icon: "text-indigo-500 dark:text-indigo-400",
      title: "text-indigo-800 dark:text-indigo-200",
      message: "text-indigo-700 dark:text-indigo-300",
    },
  };

  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-4">
        {toasts.map((toast) => {
          const Icon = icons[toast.type];
          const styles = toastStyles[toast.type];

          return (
            <div
              key={toast.id}
              className={`flex items-start p-4 rounded-lg border ${styles.container} 
                shadow-lg animate-fade-in transition-all duration-300`}
              role="alert"
            >
              <Icon className={`w-5 h-5 ${styles.icon} mt-0.5`} />
              <div className="ml-3 flex-1">
                {toast.title && (
                  <h3 className={`text-sm font-medium ${styles.title}`}>
                    {toast.title}
                  </h3>
                )}
                <p className={`text-sm ${styles.message}`}>{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className={`ml-4 inline-flex ${styles.icon} hover:opacity-75 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${toast.type}-500 
                  dark:focus:ring-offset-gray-900 rounded-lg transition-colors duration-300`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};
