import React from "react";

const loading = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-pulse">
      <div className="space-y-4 p-4 h-[654px] rounded-lg shadow-md bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <div className="h-5 w-1/3 bg-gray-300 dark:bg-gray-700 rounded" />
        <div className="h-10 w-full bg-gray-300 dark:bg-gray-700 rounded" />
        <div className="h-8 w-1/4 bg-gray-300 dark:bg-gray-700 rounded mt-6" />
        <div className="h-[435px] w-full bg-gray-300 dark:bg-gray-700 rounded" />
      </div>

      <div className="p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 h-[654px] w-[600px]">
        <div className="h-5 w-1/3 bg-gray-300 dark:bg-gray-700 rounded mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default loading;
