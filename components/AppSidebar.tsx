"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Home, Folder, User } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const mainItems = [
  { title: "Home", url: "/dashboard", icon: Home },
  { title: "Projects", url: "/projects", icon: Folder },
  { title: "Profile", url: "/profile", icon: User },
];

export function AppSheetMenu() {
  const pathname = usePathname();

  const isActive = (url: string) => pathname === url;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-64 p-4">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <div
              className="h-8 w-8 rounded-lg"
              style={{ background: "var(--gradient-primary)" }}
            />
            <span className="font-semibold">BaaS Platform</span>
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 flex flex-col gap-4">
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
        </div>
      </SheetContent>
    </Sheet>
  );
}
