"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Bell,
  User,
  Folder,
  Home,
  LogOut,
  Zap,
  GitPullRequestIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AppSheetMenu } from "./AppSidebar";
import { signOut, useSession } from "next-auth/react";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const user = session?.user;

  const mainItems = [
    { title: "Home", url: "/", icon: Home },
    { title: "Projects", url: "/projects", icon: Folder },
    { title: "API Requests", url: "/api-requests", icon: GitPullRequestIcon },
    { title: "Recent Activities", url: "/recent-activities", icon: Zap },
    { title: "Profile", url: "/profile", icon: User },
  ];

  const isActive = (url: string) => pathname === url;

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-gray-200 dark:border-gray-800 bg-card/90 backdrop-blur-md p-4 h-screen sticky top-0">
        <div className="flex items-center gap-2 mb-8">
          <div
            className="h-10 w-10 rounded-lg"
            style={{ background: "var(--gradient-primary)" }}
          />
          <span className="font-bold text-lg text-foreground">InfraHub</span>
        </div>

        <nav className="flex-1 space-y-4 overflow-y-auto">
          {mainItems.map((item) => (
            <Link
              key={item.title}
              href={item.url}
              className={`flex items-center gap-3 p-4 rounded-lg transition-colors duration-200 font-medium text-sm ${
                isActive(item.url)
                  ? "bg-blue-400/20 dark:bg-blue-400/30 text-blue-600 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.title}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="border-b border-gray-200 dark:border-gray-800 bg-card/90 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between px-4 md:px-6 h-16 shadow-sm">
          <div className="lg:hidden">
            <AppSheetMenu />
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {user && (
              <Button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="hover:text-red-400! hover:scale-110 dark:text-white bg-transparent hover:bg-transparent"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            )}

            {user && (
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-indigo-400/40!"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-gradient-primary animate-pulse" />
              </Button>
            )}

            <ThemeToggle />

            {status === "loading" ? null : user ? (
              <Button
                variant="ghost"
                className="gap-2 py-6 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-white text-xs">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:inline text-sm font-medium text-foreground">
                  {user.name}
                </span>
              </Button>
            ) : (
              <Button
                asChild
                className="gap-2 py-2 px-4 bg-gradient-primary text-white hover:opacity-90 transition-opacity rounded-md"
              >
                <Link href="/login">Get Started</Link>
              </Button>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-background/90">
          {children}
        </main>
      </div>
    </div>
  );
}
