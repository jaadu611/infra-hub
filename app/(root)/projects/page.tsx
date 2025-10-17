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
  const { user } = useUser();
  const userEmail = user?.email;

  useEffect(() => {
    const fetchProjects = async () => {
      if (!userEmail) return;
      try {
        setIsLoading(true);
        const res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: userEmail }),
        });
        if (!res.ok) throw new Error("Failed to fetch projects");
        const data: Project[] = await res.json();
        setProjects(data);
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, [userEmail]);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/projects/delete/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete project");
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Error deleting project:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-400" />
      </div>
    );
  }

  return (
    <div className="p-6 min-h-[80vh]">
      {projects.length > 0 ? (
        <>
          <ProjectsPageHeader
            userEmail={userEmail}
            onProjectCreated={(newProject: Project) =>
              setProjects((prev) => [newProject, ...prev])
            }
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {projects.map((p) => (
              <ProjectCard key={p._id} project={p} onDelete={handleDelete} />
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-[86vh] text-center py-24 bg-gray-900 rounded-xl shadow-md">
          <FolderPlus className="w-12 h-12 text-indigo-500 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            No projects yet
          </h2>
          <p className="text-gray-400 mb-6">
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
