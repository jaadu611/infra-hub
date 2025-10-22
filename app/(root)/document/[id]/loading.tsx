import React from "react";

const loading = () => {
  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between animate-pulse">
        <div className="flex flex-col gap-2">
          <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        <div className="h-10 w-24 bg-red-400 dark:bg-red-600 rounded"></div>
      </div>

      {/* Content & Metadata Skeleton */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Document Content */}
        <div className="md:col-span-2 space-y-4">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-[500px] bg-gray-100 dark:bg-gray-800 rounded-md"></div>
        </div>

        {/* Metadata */}
        <div className="space-y-4">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default loading;
