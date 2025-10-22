"use client";

import ProjectCard from "@/components/ProjectCard";
import ProjectsPageHeader from "@/components/ProjectsPageHeader";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Loader2, FolderPlus } from "lucide-react";

export interface Project {
  _id: string;
  name: string;
  members?: {
    _id: string;
    name?: string;
    email?: string;
    role?: string;
  }[];
  createdAt: string;
  documentsCount?: number;
  mongoUrl?: string;
  authSecret?: string;
  apiKey?: string;
}

export default function ProjectsPage() {
  const { data: session, status } = useSession();
  const userEmail = session?.user?.email;

  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingProjectIds, setDeletingProjectIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!userEmail) {
        setProjects([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: userEmail }),
        });
        const data: Project[] = await res.json();
        setProjects(data || []);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, [userEmail]);

  const handleDelete = async (id: string) => {
    if (deletingProjectIds.includes(id)) return;
    setDeletingProjectIds((prev) => [...prev, id]);

    try {
      const res = await fetch(`/api/projects/delete/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete project");
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Error deleting project:", err);
    } finally {
      setDeletingProjectIds((prev) => prev.filter((pid) => pid !== id));
    }
  };

  const filteredProjects =
    search.trim() === ""
      ? projects
      : projects.filter((p) =>
          p.name.toLowerCase().includes(search.toLowerCase())
        );

  if (status === "loading" || isLoading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-500 dark:text-indigo-400" />
      </div>
    );
  }

  if (!userEmail) {
    return (
      <div className="h-[80vh] flex items-center justify-center text-gray-600 dark:text-gray-400">
        Please log in to view your projects.
      </div>
    );
  }

  return (
    <div className="p-6 h-[80vh] transition-colors duration-0 text-gray-900 dark:text-white bg-background/90">
      {projects.length > 0 ? (
        <>
          {/* Search and Header */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="w-full p-3 rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all"
            />
            <ProjectsPageHeader
              onProjectCreated={(newProject: Project) =>
                setProjects((prev) => [newProject, ...prev])
              }
            />
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((p) => (
              <ProjectCard
                key={p._id}
                project={{ ...p, members: p.members ?? [] }}
                onDelete={handleDelete}
                isDeleting={deletingProjectIds.includes(p._id)}
              />
            ))}
            {filteredProjects.length === 0 && (
              <p className="text-gray-600 dark:text-gray-400 col-span-full text-center mt-6">
                No projects match your search.
              </p>
            )}
          </div>
        </>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center py-24 rounded-2xl shadow-md bg-white dark:bg-gray-900 transition-colors">
          <FolderPlus className="w-12 h-12 text-indigo-500 dark:text-indigo-400 mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
            No projects yet
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You haven’t created any projects yet. Start by creating your first
            project.
          </p>
          <ProjectsPageHeader
            onProjectCreated={(newProject: Project) =>
              setProjects([newProject])
            }
          />
        </div>
      )}
    </div>
  );
}
