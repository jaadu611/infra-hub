"use client";

import { Database, Loader2, Trash2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export type Member = {
  _id: string;
  name?: string;
  email?: string;
  role?: string;
};

export type Project = {
  _id: string;
  name: string;
  members?: Member[];
  documentsCount?: number;
  createdAt?: string;
};

interface ProjectCardProps {
  project: Project;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export default function ProjectCard({
  project,
  onDelete,
  isDeleting = false,
}: ProjectCardProps) {
  const formatDate = (isoStr?: string) => {
    if (!isoStr) return "";
    const date = new Date(isoStr);
    return date.toUTCString().split(" ").slice(0, 4).join(" ");
  };

  return (
    <Card className="hover:shadow-elegant transition-shadow group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 relative">
      <CardHeader className="pt-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Database className="h-8 w-8 text-indigo-400" />
            </div>
            <div>
              <CardTitle className="text-lg text-gray-900 dark:text-gray-100">
                {project.name}
              </CardTitle>
              <CardDescription className="text-xs text-gray-500 dark:text-gray-400">
                Members: {project.members?.length ?? 0} • Created:{" "}
                {formatDate(project.createdAt)}
              </CardDescription>
            </div>
          </div>

          {/* Delete Button */}
          <Button
            variant="ghost"
            size="icon"
            className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900 transition-colors"
            onClick={() => onDelete(project._id)}
            disabled={isDeleting}
            title="Delete project"
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="mb-6">
        <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
          <span>Documents</span>
          <span className="font-medium">{project.documentsCount ?? 0}</span>
        </div>
        <Link href={`/projects/${project._id}`}>
          <Button
            variant="outline"
            className="w-full mt-2 duration-0 hover:bg-indigo-400/20 dark:hover:bg-indigo-400/30 dark:text-white"
          >
            View Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
