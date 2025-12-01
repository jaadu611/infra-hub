"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DocsSidebar() {
  const pathname = usePathname();

  const sections = [
    {
      title: "Overview",
      items: [
        "What is InfraHub?",
        "Why InfraHub exists?",
        "Core features at a glance",
      ],
    },
    {
      title: "Getting Started",
      items: [
        "Quick start guide",
        "Creating your first project",
        "CLI Commands",
      ],
    },
    {
      title: "Projects",
      items: [
        "How projects work",
        "Managing project settings",
        "Viewing activity history",
        "Project analytics overview",
      ],
    },
    {
      title: "Members & Collaboration",
      items: ["Invite team members", "Roles & permissions", "Removing members"],
    },
    {
      title: "Workspace & Documents",
      items: [
        "Uploading Markdown documents",
        "Organizing folders",
        "Previewing files",
        "Document editor features",
      ],
    },
    {
      title: "Databases",
      items: [
        "Connecting MongoDB",
        "Viewing/editing collections",
        "Running queries",
        "Database security rules",
      ],
    },
    {
      title: "API Requests & Analytics",
      items: [
        "Live request logs",
        "Graph view",
        "Debug mode",
        "Error tracking",
      ],
    },
    {
      title: "Templates",
      items: [
        "What templates are",
        "How to use a template",
        "Template categories",
        "Contributing templates",
      ],
    },
    {
      title: "GitHub Integration",
      items: ["Linking GitHub", "Importing repos", "Sync behavior"],
    },
    {
      title: "Authentication",
      items: [
        "Integrated auth",
        "Resetting passwords",
        "Email verification",
        "Auth API",
      ],
    },
    {
      title: "FAQ",
      items: [
        "Common issues",
        "Auth troubleshooting",
        "GitHub issues",
        "Database errors",
      ],
    },
  ];

  const generateSlug = (section: string, item: string) =>
    `/docs/${section.toLowerCase().replace(/ /g, "-")}/${item
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/\?/g, "")}`;

  return (
    <aside className="w-64 border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 h-screen flex flex-col overflow-y-auto">
      <nav className="px-4 py-6 space-y-6">
        {sections.map((section, i) => (
          <div key={i} className="space-y-2">
            <h2 className="text-xs uppercase tracking-wider font-semibold text-neutral-500 dark:text-neutral-400">
              {section.title}
            </h2>

            <ul className="space-y-1">
              {section.items.length === 0 && (
                <li className="text-neutral-500 dark:text-neutral-500 text-sm italic">
                  (No pages yet)
                </li>
              )}

              {section.items.map((item, j) => {
                const slug = generateSlug(section.title, item);

                const isActive =
                  pathname === slug || pathname.startsWith(slug + "/");

                return (
                  <li key={j}>
                    <Link
                      href={slug}
                      className={`block text-sm px-3 py-1.5 rounded-md transition-all hover:bg-neutral-100 hover:dark:bg-neutral-800 ${
                        isActive
                          ? "bg-neutral-200 dark:bg-neutral-700 font-medium text-neutral-900 dark:text-neutral-100 shadow-sm"
                          : ""
                      }`}
                    >
                      {item}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
