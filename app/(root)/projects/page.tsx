"use client";

import ProjectCard from "@/components/ProjectCard";
import ProjectsPageHeader from "@/components/ProjectsPageHeader";
import { useUser } from "@/context/UserProvider";
import { useState, useEffect } from "react";
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
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingProjectIds, setDeletingProjectIds] = useState<string[]>([]);
  const { user } = useUser();
  const userEmail = user?.email;

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      if (!userEmail) {
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
        setProjects(data || []); // make sure it’s always an array
      } catch (err) {
        console.error("Error fetching projects:", err);
        setProjects([]); // fallback to empty array
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, [userEmail]);

  // Delete project
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

  // Filtered projects based on search
  const filteredProjects =
    search.trim() === ""
      ? projects
      : projects.filter((p) =>
          p.name.toLowerCase().includes(search.toLowerCase())
        );

  if (isLoading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-500 dark:text-indigo-400" />
      </div>
    );
  }

  return (
    <div className="p-6 h-[80vh] transition-colors duration-0 text-gray-900 bg-background/90 dark:text-white">
      {projects.length > 0 ? (
        <>
          <div className="flex justify-center items-center gap-4 mb-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="w-full p-2 rounded border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder-gray-400"
            />
            <ProjectsPageHeader
              userEmail={userEmail}
              onProjectCreated={(newProject: Project) =>
                setProjects((prev) => [newProject, ...prev])
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
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
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center py-24 rounded-xl shadow-md text-gray-800 bg-background/90 dark:text-gray-100 transition-colors">
          <FolderPlus className="w-12 h-12 text-indigo-500 dark:text-indigo-400 mb-4" />
          <h2 className="text-2xl font-bold mb-2">No projects yet</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You haven’t created any projects yet. Start by creating your first
            project.
          </p>
          <ProjectsPageHeader
            userEmail={userEmail}
            onProjectCreated={(newProject: Project) =>
              setProjects([newProject])
            }
          />
        </div>
      )}
    </div>
  );
}
