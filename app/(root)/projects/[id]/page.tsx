import React from "react";
import { getProjectById, ProjectType } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Database,
  Calendar,
  Users,
  FileText,
  Activity,
  Settings,
  Mail,
} from "lucide-react";
import DatabaseConfig from "@/components/DatabaseConfig";
import SecurityAndAuth from "@/components/Security";
import TeamManagement from "@/components/TeamManagement";
import { auth } from "@/auth";
import ProjectDocument from "@/components/ProjectDocument";
import ProjectModels from "@/components/ProjectModels";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const project: ProjectType | null = await getProjectById(id);
  const session = await auth();

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="p-6 rounded-full bg-red-200 dark:bg-red-800 mx-auto w-fit">
            <Database className="h-12 w-12 text-red-600 dark:text-red-300" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Project Not Found
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            The project you’re looking for doesn’t exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div className="min-h-screen dark:bg-background/90 text-gray-900 dark:text-white">
      {/* Header */}
      <header className="relative p-6 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md shadow-md border border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          {/* Project Title */}
          <div className="flex items-start md:items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-600 text-white shadow-sm">
              <Database className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{project.name}</h1>
              <p className="flex items-center gap-2 mt-1 text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="h-4 w-4" />
                Created {formatDate(project.createdAt)}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 items-center">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" /> Settings
            </Button>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="mx-auto py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Documents",
            value: project.documents?.length ?? 0,
            icon: FileText,
            color: "blue",
          },
          {
            label: "Team Members",
            value: project.members?.length ?? 0,
            icon: Users,
            color: "green",
          },
          {
            label: "Activities",
            value: project.activities?.length ?? 0,
            icon: Activity,
            color: "purple",
          },
          {
            label: "Invites Sent",
            value: project.pendingInvites?.length ?? 0,
            icon: Mail,
            color: "orange",
          },
        ].map((stat, i) => (
          <Card
            key={i}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm"
          >
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
              <div
                className={`p-3 rounded-full bg-${stat.color}-100 dark:bg-${stat.color}-900/20`}
              >
                <stat.icon
                  className={`h-5 w-5 text-${stat.color}-600 dark:text-${stat.color}-300`}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Main Content */}
      <main className="mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DatabaseConfig mongoUrl={project.mongoUrl} projectId={id} />
        <SecurityAndAuth
          apiKey={project.apiKey}
          authSecret={project.authSecret}
        />
        <TeamManagement
          members={project.members ?? []}
          invitedEmails={project.pendingInvites ?? []}
          projectId={id}
          currentUserEmail={session?.user?.id}
        />
        <ProjectDocument
          projectId={project._id.toString()}
          documents={project.documents!.map((doc) => ({
            id: doc._id.toString(),
            name: doc.name ?? "Untitled",
            createdAt: doc.createdAt ?? new Date().toISOString(),
            owner: doc.owner
              ? { name: doc.owner.name, email: doc.owner.email }
              : undefined,
          }))}
        />
        <ProjectModels projectId={project._id.toString()} />
      </main>
    </div>
  );
}
