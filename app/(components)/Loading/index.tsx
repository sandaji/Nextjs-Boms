"use client";

import Spinner from "./Spinner";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900 bg-opacity-75 z-50">
      <Spinner />
    </div>
  );
}
