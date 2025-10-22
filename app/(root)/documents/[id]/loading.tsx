import React from "react";

const loading = () => {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="h-8 w-48 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-md" />
        <div className="h-10 w-40 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-lg" />
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="relative p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm flex flex-col gap-4"
          >
            <div className="absolute top-3 right-3 h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded-full" />

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-md bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-600" />
              <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded-md" />
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 mt-auto pt-3 flex items-center justify-between text-xs text-gray-400">
              <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded-md" />
              <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default loading;
