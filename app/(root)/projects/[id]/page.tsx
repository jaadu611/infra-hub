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
import Link from "next/link";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const isValidObjectId = id && /^[0-9a-fA-F]{24}$/.test(id);

  if (!isValidObjectId) {
    return (
      <div className="bg-white flex flex-col items-center justify-center dark:bg-gray-900 border h-full border-gray-200 w-full dark:border-gray-700 shadow-md rounded-xl p-10 text-center space-y-4">
        <div className="p-4 rounded-full bg-red-100 dark:bg-red-900/30 w-fit mx-auto">
          <Database className="h-10 w-10 text-red-600 dark:text-red-300" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Project Not Found
        </h1>

        <p className="text-gray-500 dark:text-gray-400">
          The project you’re trying to access does not exist or may have been
          removed.
        </p>

        <Link href="/dashboard">
          <Button variant="outline" className="mt-4">
            Go Back to dashboard
          </Button>
        </Link>
      </div>
    );
  }

  const project: ProjectType = await getProjectById(id);

  if (!project) {
    return (
      <div className="bg-white flex flex-col items-center justify-center dark:bg-gray-900 border h-full border-gray-200 w-full dark:border-gray-700 shadow-md rounded-xl p-10 text-center space-y-4">
        <div className="p-4 rounded-full bg-yellow-100 dark:bg-yellow-900/30 w-fit mx-auto">
          <Database className="h-10 w-10 text-yellow-600 dark:text-yellow-300" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Access Denied
        </h1>

        <p className="text-gray-500 dark:text-gray-400">
          You don’t have permission to view this project. If you believe this is
          a mistake, please contact the project owner.
        </p>

        <Link href="/dashboard">
          <Button variant="outline" className="mt-4">
            Go Back to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  const session = await auth();

  const emails = project.members
    ?.map((m) => m?.user?.email)
    .filter((email) => email !== undefined);

  if (!emails?.includes(session?.user?.email ?? "")) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">
          You do not have access to this project.
        </h1>
      </div>
    );
  }

  const userRole = project.members?.find(
    (m) => m?.user?.email === session?.user?.email
  )?.role;

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
            label: "API Requests",
            value: project.apiRequests ?? 0,
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
                className={`p-3 rounded-full bg-${stat.color}-100 dark:bg-${stat.color}-900/30`}
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
        <DatabaseConfig
          mongoUrl={project.mongoUrl}
          projectId={id}
          userRole={userRole as "admin" | "editor" | "viewer"}
        />
        <SecurityAndAuth
          apiKey={project.apiKey}
          authSecret={project.authSecret}
          userRole={userRole as "admin" | "editor" | "viewer"}
        />
        <TeamManagement
          members={project.members ?? []}
          invitedEmails={project.pendingInvites ?? []}
          projectId={id}
          currentUserEmail={session?.user?.id}
          userRole={userRole as "admin" | "editor" | "viewer"}
        />
        <ProjectDocument
          projectId={project._id.toString()}
          userRole={userRole as "admin" | "editor" | "viewer"}
          documents={project.documents!.map((doc) => ({
            id: doc._id.toString(),
            name: doc.name ?? "Untitled",
            createdAt: doc.createdAt ?? new Date().toISOString(),
            owner: doc.owner
              ? { name: doc.owner.name, email: doc.owner.email }
              : undefined,
          }))}
        />
        <ProjectModels
          projectId={project._id.toString()}
          userRole={userRole as "admin" | "editor" | "viewer"}
        />
      </main>
    </div>
  );
}
