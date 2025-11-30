import React from "react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

const WelcomeNavbar = () => {
  return (
    <nav className="w-full border-b border-gray-200/50 dark:border-gray-700/50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl sticky top-0 z-50 shadow-sm dark:shadow-gray-900/50">
      <div className="mx-auto flex items-center justify-between px-6 lg:px-8 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/30 dark:shadow-blue-500/20 group-hover:shadow-blue-500/50 dark:group-hover:shadow-blue-500/40 transition-all duration-300 group-hover:scale-105" />
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 bg-clip-text text-transparent group-hover:from-blue-500 group-hover:to-purple-500 transition-all duration-300">
            InfraHub
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="flex items-center gap-2">
          <Link
            href="/features"
            className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-200 font-medium"
          >
            Features
          </Link>

          <Link
            href="/templates"
            className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-200 font-medium"
          >
            Templates
          </Link>

          <Link
            href="/docs"
            className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-200 font-medium"
          >
            Docs
          </Link>

          <Link
            href="/pricing"
            className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-200 font-medium"
          >
            Pricing
          </Link>

          <Link
            href="https://github.com/"
            target="_blank"
            className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-200 font-medium"
          >
            GitHub
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/login"
            className="px-5 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-all duration-200 font-medium border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
          >
            Log in
          </Link>

          <Link
            href="/signup"
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold shadow-lg shadow-blue-500/30 dark:shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/40 dark:hover:shadow-blue-500/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default WelcomeNavbar;
