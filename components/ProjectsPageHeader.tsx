"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import NewProjectModal from "./NewProjectModel";
import { toast } from "sonner";
import type { Project } from "@/app/(root)/projects/page";
import { useSession } from "next-auth/react";

interface ProjectsPageHeaderProps {
  onProjectCreated?: (project: Project) => void;
}

export default function ProjectsPageHeader({
  onProjectCreated,
}: ProjectsPageHeaderProps) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const { data: session } = useSession();
  const userEmail = session?.user?.email as string;

  const handleFinish = async (data: {
    projectName: string;
    description: string;
    email: string;
    mongoUrl?: string;
    authJsSecret?: string;
  }) => {
    if (!data.email) {
      toast.error("User email is required to create a project");
      return;
    }

    if (!data.description.trim()) {
      toast.error("Project description is required");
      return;
    }

    setIsCreating(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to create project");

      const newProject = await res.json();
      toast.success("New Project Created!");

      onProjectCreated?.(newProject);
      setModalOpen(false);
    } catch (err) {
      console.error("Error creating project:", err);
      toast.error(
        err instanceof Error ? err.message : "Failed to create project"
      );
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <Button
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-md hover:shadow-lg hover:opacity-90 transition-all"
        onClick={() => setModalOpen(true)}
        disabled={isCreating} // disable button while creating
      >
        {isCreating ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Creating...
          </>
        ) : (
          <>
            <Plus className="h-4 w-4" /> New Project
          </>
        )}
      </Button>

      <NewProjectModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        userEmail={userEmail}
        onFinish={handleFinish}
      />
    </>
  );
}
