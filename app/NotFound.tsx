"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const NotFoundPage = () => {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      pathname
    );
  }, [pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-gray-600">Oops! Page not found</p>
        <button
          onClick={() => router.push("/")}
          className="text-blue-500 underline hover:text-blue-700"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
