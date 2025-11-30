import { auth } from "@/auth";
import {
  Database,
  FileText,
  Users,
  Activity as ActivityIcon,
  ArrowUpRight,
  Clock,
  Folder,
  Plus,
  Edit,
  Trash2,
  Users as UsersIcon,
  Mail,
  Sparkles,
  Zap,
  Target,
  LucideIcon,
} from "lucide-react";
import { getUserDashboardData } from "@/lib/db";
import Link from "next/link";

interface Member {
  _id: string;
  name?: string;
  user?: { _id: string; name?: string };
}

interface Projects {
  _id: string;
  name: string;
  members?: Member[];
  createdAt?: string;
}

type Document = {
  _id: string;
  title: string;
  content: string;
  projectId: string;
};

export type ActivityType =
  | "delete"
  | "join"
  | "invite"
  | "create"
  | "update"
  | "API request (GET)"
  | "API request (POST)"
  | "API request (PUT)"
  | "API request (DELETE)";

export interface Activity {
  type: ActivityType;
  action: string;
  collectionName: string;
  time: string;
}

interface DashboardData {
  user: { _id: string; name: string };
  projects: Projects[];
  documents: Document[];
  apiRequests: number;
  recentActivity: Activity[];
}

// ------------------ Component ------------------
export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.email) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <Users className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Authentication Required
          </h2>
          <p className="text-gray-500">Please log in to view your dashboard.</p>
        </div>
      </div>
    );
  }

  const rawData = await getUserDashboardData(session.user.email);

  if (!rawData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <Users className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            User not found
          </h2>
          <p className="text-gray-500">Unable to load dashboard data.</p>
        </div>
      </div>
    );
  }

  const data: DashboardData = {
    user: {
      _id: rawData.user._id ?? "unknown",
      name: rawData.user.name ?? "User",
    },
    recentActivity: (rawData.recentActivity ?? [])
      .map((act) => ({
        type: act.type ?? "create",
        action: act.action ?? "No action",
        collectionName: act.collectionName ?? "Unknown",
        time: act.time
          ? new Date(act.time).toISOString()
          : new Date().toISOString(),
      }))
      .sort((a, b) => +new Date(b.time) - +new Date(a.time))
      .slice(0, 5)
      .map((act) => ({
        ...act,
        time: new Date(act.time).toLocaleString(),
      })),
    projects: (rawData.projects ?? [])
      .sort((a, b) => +new Date(b.createdAt ?? 0) - +new Date(a.createdAt ?? 0))
      .slice(0, 5)
      .map((proj) => ({
        _id: proj._id ?? "unknown",
        name: proj.name ?? "Untitled Project",
        createdAt: proj.createdAt,
        members: (proj.members ?? []).map((m) => ({
          _id: m._id ?? m.user?._id ?? "unknown",
          name: m.name ?? m.user?.name ?? "Unknown",
          user: m.user
            ? {
                _id: m.user._id ?? "unknown",
                name: m.user.name ?? "Unknown",
              }
            : undefined,
        })),
      })),
    documents: (rawData.documents ?? []).map((doc) => ({
      _id: doc._id ?? "unknown",
      title: doc.title ?? "Untitled",
      content: doc.content ?? "",
      projectId: doc.projectId ?? "unknown",
    })),
    apiRequests: rawData.apiRequests ?? [],
  };

  const { user, projects, documents, apiRequests, recentActivity } = data;

  const allMembers = projects.flatMap((p) => p.members ?? []);
  const allUserIds = allMembers.map((m) => m._id).filter(Boolean);
  const uniqueUserIds = Array.from(new Set(allUserIds));
  const activeUserIds = uniqueUserIds.filter((id) => id !== user._id);

  const stats = [
    {
      title: "Total Projects",
      value: projects.length.toString(),
      icon: Database,
      description: "Active projects",
      gradient: "from-purple-500 to-purple-700",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
    {
      title: "Documents",
      value: documents.length.toString(),
      icon: FileText,
      description: "Total documents",
      gradient: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Team Members",
      value: activeUserIds.length.toString(),
      icon: Users,
      description: "Collaborators",
      gradient: "from-violet-500 to-purple-600",
      bgColor: "bg-violet-100 dark:bg-violet-900/30",
      iconColor: "text-violet-600 dark:text-violet-400",
    },
    {
      title: "API Requests",
      value: apiRequests.toString(),
      icon: ActivityIcon,
      description: "Total requests",
      gradient: "from-cyan-500 to-blue-600",
      bgColor: "bg-cyan-100 dark:bg-cyan-900/30",
      iconColor: "text-cyan-600 dark:text-cyan-400",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 p-8 md:p-12 text-white shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-300 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            Dashboard Overview
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-lg text-purple-100 max-w-2xl">
            Here&apos;s what&apos;s happening with your projects and team today.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={stat.title}
            className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Optional gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50 dark:to-gray-800/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div className="relative space-y-4 flex flex-col items-center text-center">
              {/* Icon */}
              <div
                className={`p-3 rounded-xl ${stat.bgColor} transition-transform duration-300 group-hover:-translate-y-2 group-hover:scale-110`}
              >
                <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
              </div>

              {/* Text */}
              <div>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {stat.value}
                </p>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-1">
                  {stat.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {stat.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-transparent dark:from-gray-800/50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  Recent Activity
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Latest updates from your workspace
                </p>
              </div>
              <Link
                href="/recent-activities"
                className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center gap-1"
              >
                View all
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="p-6">
            {recentActivity.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <Clock className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  No Recent Activity
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
                  Your recent activities will appear here. Start by creating a
                  project or document.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentActivity.map((activity, index) => {
                  const activityConfig: Record<
                    ActivityType,
                    { icon: LucideIcon; color: string; label: string }
                  > = {
                    create: {
                      icon: Plus,
                      color: "bg-emerald-500",
                      label: "Created",
                    },
                    update: {
                      icon: Edit,
                      color: "bg-sky-500",
                      label: "Updated",
                    },
                    delete: {
                      icon: Trash2,
                      color: "bg-rose-600",
                      label: "Deleted",
                    },
                    join: {
                      icon: UsersIcon,
                      color: "bg-violet-500",
                      label: "Joined Team",
                    },
                    invite: {
                      icon: Mail,
                      color: "bg-indigo-500",
                      label: "Sent Invite",
                    },
                    "API request (GET)": {
                      icon: Database,
                      color: "bg-teal-500",
                      label: "GET Request",
                    },
                    "API request (POST)": {
                      icon: FileText,
                      color: "bg-blue-600",
                      label: "POST Request",
                    },
                    "API request (PUT)": {
                      icon: Edit,
                      color: "bg-yellow-500",
                      label: "PUT Request",
                    },
                    "API request (DELETE)": {
                      icon: Trash2,
                      color: "bg-red-600",
                      label: "DELETE Request",
                    },
                  };

                  const config =
                    activityConfig[activity.type as ActivityType] ||
                    activityConfig.create;
                  const Icon = config.icon;

                  return (
                    <div
                      key={index}
                      className="group flex items-start gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 hover:shadow-md transition-all duration-200"
                    >
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-lg ${config.color} flex items-center justify-center shadow-md`}
                      >
                        <Icon className="h-5 w-5 text-white" />
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {config.label}: {activity.action}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                          <span className="px-2 py-0.5 rounded-md bg-gray-200 dark:bg-gray-700 font-medium">
                            {activity.collectionName}
                          </span>
                          <span>•</span>
                          <span>{user.name}</span>
                        </div>
                      </div>

                      <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {new Date(activity.time).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Recent Projects */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-transparent dark:from-gray-800/50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-500" />
                  Recent Projects
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Your latest projects
                </p>
              </div>
              {projects.length > 0 && (
                <Link
                  href="/projects"
                  className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center gap-1"
                >
                  View all
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              )}
              {projects.length <= 0 && (
                <Link
                  href="/projects"
                  className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Create one
                </Link>
              )}
            </div>
          </div>

          <div className="p-6">
            {projects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <Folder className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  No Projects Yet
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mb-6">
                  Create your first project to get started with organizing your
                  work.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {projects.map((project) => (
                  <Link
                    key={project._id}
                    href={`/projects/${project._id}`}
                    className="group flex items-center justify-between gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 hover:shadow-md hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-200"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md group-hover:scale-110 transition-transform">
                        {project.name[0]?.toUpperCase() || "P"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                          {project.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {project.createdAt
                            ? new Date(project.createdAt).toLocaleDateString()
                            : "No date"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {(project.members ?? [])
                          .slice(0, 3)
                          .map((member, idx) => (
                            <div
                              key={idx}
                              className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-300 flex items-center justify-center text-xs font-semibold border border-white dark:border-gray-800"
                              title={member.name}
                            >
                              {member.name?.[0]?.toUpperCase() || "U"}
                            </div>
                          ))}
                      </div>
                      {project.members && project.members.length > 3 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          +{project.members.length - 3}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
