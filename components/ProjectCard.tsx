"use client";

import { Database, MoreVertical, Loader2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
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
  onDelete: (id: string) => Promise<void>;
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
    <Card className="hover:shadow-elegant transition-shadow group">
      <CardHeader className="pt-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Database className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">{project.name}</CardTitle>
              <CardDescription className="text-xs">
                Members: {project.members?.length ?? 0} • Created:{" "}
                {formatDate(project.createdAt)}
              </CardDescription>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 transition-all duration-100 group-hover:opacity-100"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover">
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Export</DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive flex items-center gap-2"
                onClick={() => onDelete(project._id)}
                disabled={isDeleting}
              >
                {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="mb-6!">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Documents</span>
          <span className="font-medium">{project.documentsCount ?? 0}</span>
        </div>
        <Link href={`/projects/${project._id}`}>
          <Button
            variant="outline"
            className="w-full mt-2 hover:bg-indigo-400/40!"
          >
            View Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
