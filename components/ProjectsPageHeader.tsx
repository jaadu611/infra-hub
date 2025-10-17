"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import NewProjectModal from "./NewProjectModel";
import { toast } from "sonner";
import type { Project } from "@/app/(root)/projects/page";

interface ProjectsPageHeaderProps {
  userEmail?: string;
  onProjectCreated?: (project: Project) => void;
}

export default function ProjectsPageHeader({
  userEmail,
  onProjectCreated,
}: ProjectsPageHeaderProps) {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleFinish = async (data: {
    projectName: string;
    email: string;
    mongoUrl?: string;
    authJsSecret?: string;
  }) => {
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to create project");

      const newProject = await res.json();
      toast.success("✅ New Project Created:", newProject);

      onProjectCreated?.(newProject);

      setModalOpen(false);
    } catch (err) {
      console.error("Error creating project:", err);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <Button
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-md hover:shadow-lg hover:opacity-90 transition-all"
          onClick={() => setModalOpen(true)}
        >
          <Plus className="h-4 w-4" /> New Project
        </Button>
      </div>

      <NewProjectModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        userEmail={userEmail}
        onFinish={handleFinish}
      />
    </>
  );
}
