import DocsSidebar from "@/components/docsSidebar";
import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function DocsLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex h-full overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 h-full flex-shrink-0 border-r bg-white dark:bg-neutral-900">
        <div className="h-full overflow-y-auto">
          <DocsSidebar />
        </div>
      </aside>

      {/* Scrollable content */}
      <main className="flex-1 h-full overflow-y-auto p-6">{children}</main>
    </div>
  );
}
