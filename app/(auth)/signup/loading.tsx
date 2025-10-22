import React from "react";

const loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-950">
      <div className="w-full max-w-md space-y-6 animate-pulse">
        {/* Card Skeleton */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-xl p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col items-center space-y-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
            <div className="h-6 w-40 bg-gray-700 rounded" />
            <div className="h-4 w-60 bg-gray-700 rounded" />
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-24 bg-gray-700 rounded mx-2" />
                <div className="h-10 bg-gray-800 rounded border border-gray-700" />
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="h-10 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded" />

          {/* Footer */}
          <div className="h-4 w-60 bg-gray-700 rounded mx-auto mt-4" />
        </div>
      </div>
    </div>
  );
};

export default loading;
