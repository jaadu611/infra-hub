import React from "react";

const loading = () => {
  return (
    <div className="h-[80vh] flex flex-col items-center justify-center text-center p-6 space-y-4 animate-pulse">
      <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 mx-auto"></div>

      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>

      <div className="space-y-2 mt-4">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mx-auto"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/6 mx-auto"></div>
      </div>

      <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mx-auto mt-6"></div>
    </div>
  );
};

export default loading;
