"use client";

import { ThemeToggle } from "@/components/ThemeToggle";
import { Bell, User, Key, Folder, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppSheetMenu } from "./AppSidebar";
import { useUser } from "@/context/UserProvider";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const { user } = useUser();

  const mainItems = [
    { title: "Home", url: "/", icon: Home },
    { title: "Projects", url: "/projects", icon: Folder },
    { title: "API Keys", url: "/api-keys", icon: Key },
    { title: "Profile", url: "/profile", icon: User },
  ];

  const isActive = (url: string) => pathname === url;

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-b from-background/90 to-background/100 text-foreground">
      {/* Sidebar (visible on md+) */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card/80 backdrop-blur-md p-4 h-screen sticky top-0 overflow-hidden">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-6 shrink-0">
          <div
            className="h-8 w-8 rounded-lg"
            style={{ background: "var(--gradient-primary)" }}
          />
          <span className="font-semibold text-lg">BaaS Platform</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-8 overflow-y-auto pr-2">
          {/* Main Items */}
          <div className="flex flex-col gap-1">
            {mainItems.map((item) => (
              <Link
                key={item.title}
                href={item.url}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                  isActive(item.url)
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "hover:bg-sidebar-accent/50"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            ))}
          </div>
        </nav>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="border-b border-sidebar-border bg-card/90 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between px-4 md:px-6 lg:px-8 h-16 shadow-sm text-foreground shrink-0">
          <div className="lg:hidden">
            <AppSheetMenu />
          </div>

          <div className="flex-1" />

          <div className="flex items-center gap-3">
            {user && (
              <Button
                variant="ghost"
                size="icon"
                className="relative text-foreground hover:bg-blue-400!"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-gradient-primary animate-pulse" />
              </Button>
            )}

            <ThemeToggle />

            {user ? (
              <Button
                variant="ghost"
                className="gap-2 hover:bg-muted text-foreground"
              >
                <Avatar
                  className="h-7 w-7"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  <AvatarFallback className="bg-gradient-primary text-white text-xs">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:inline text-sm font-medium">
                  {user.name}
                </span>
              </Button>
            ) : (
              <Button
                variant="ghost"
                className="gap-2 py-2 px-4 text-white hover:opacity-90 transition-opacity"
                style={{ background: "var(--gradient-primary)" }}
              >
                Get Started
              </Button>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto text-foreground">
          {children}
        </main>
      </div>
    </div>
  );
}
