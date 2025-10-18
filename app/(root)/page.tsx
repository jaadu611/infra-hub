import { auth } from "@/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Database,
  FileText,
  Users,
  Activity as ActivityIcon,
  TrendingUp,
  ArrowUpRight,
  Clock,
  Folder,
  LucideFolder,
  Plus,
  Edit,
  Trash2,
  Users as UsersIcon,
  Mail,
} from "lucide-react";
import { getUserDashboardData } from "@/lib/db";
import Link from "next/link";

// ------------------ Types ------------------
interface Member {
  _id: string;
  name?: string;
  user?: { _id: string; name?: string };
}

interface Projects {
  _id: string;
  name: string;
  members?: Member[];
}

type Document = {
  _id: string;
  title: string;
  content: string;
  projectId: string;
};

interface APIRequest {
  _id: string;
  endpoint: string;
}

export type ActivityType = "delete" | "join" | "invite" | "create" | "update";

export interface Activity {
  type: ActivityType;
  action: string;
  collection: string;
  time: string;
}

interface RawActivity {
  type?: ActivityType;
  action?: string;
  collection?: string;
  time?: string | Date;
}

interface DashboardData {
  user: { _id: string; name: string };
  projects: Projects[];
  documents: Document[];
  apiRequests: APIRequest[];
  recentActivity: Activity[];
}

// ------------------ Component ------------------
export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.email) {
    return <p className="text-center mt-20 text-red-500">Please log in.</p>;
  }

  const rawData = await getUserDashboardData(session.user.email);

  if (!rawData) {
    return <p className="text-center mt-20 text-red-500">User not found.</p>;
  }

  const data: DashboardData = {
    user: {
      _id: rawData.user._id ?? "unknown",
      name: rawData.user.name ?? "User",
    },
    recentActivity: (rawData.recentActivity ?? [])
      .sort((a, b) => +new Date(b.time ?? 0) - +new Date(a.time ?? 0))
      .slice(0, 5)
      .map(
        (act: RawActivity): Activity => ({
          type: act.type ?? "create",
          action: act.action ?? "No action",
          collection: act.collection ?? "Unknown",
          time: act.time
            ? new Date(act.time).toLocaleString()
            : new Date().toLocaleString(),
        })
      ),
    projects: (rawData.projects ?? [])
      .sort((a, b) => +new Date(b.createdAt ?? 0) - +new Date(a.createdAt ?? 0))
      .slice(0, 5)
      .map((proj) => ({
        _id: proj._id ?? "unknown",
        name: proj.name ?? "Untitled Project",
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

  console.log(user);

  const stats = [
    {
      title: "Total Collections",
      value: projects.length.toString(),
      icon: Database,
      change: projects.length ? `+${projects.length} this week` : "No data",
      trend: projects.length ? "+16%" : "",
      gradient: "from-purple-500 to-purple-700",
    },
    {
      title: "Documents",
      value: documents.length.toString(),
      icon: FileText,
      change: documents.length ? `+${documents.length} today` : "No data",
      trend: documents.length ? "+24%" : "",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Joined Users",
      value: (() => {
        const allMembers = projects.flatMap((p) => p.members ?? []);
        const allUserIds = allMembers.map((m) => m._id).filter(Boolean);
        const uniqueUserIds = Array.from(new Set(allUserIds));
        const activeUserIds = uniqueUserIds.filter((id) => id !== user._id);
        return activeUserIds.length.toString();
      })(),
      icon: Users,
      change: "+0 this week",
      trend: "+0%",
      gradient: "from-violet-500 to-purple-600",
    },
    {
      title: "API Requests",
      value: apiRequests.length.toString(),
      icon: ActivityIcon,
      change: apiRequests.length
        ? `+${apiRequests.length} from last week`
        : "No data",
      trend: apiRequests.length ? "+12%" : "",
      gradient: "from-cyan-500 to-blue-600",
    },
  ];

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      {/* Header */}
      <div
        className="relative overflow-hidden rounded-2xl p-8 md:p-10 text-white shadow-glow"
        style={{ background: "var(--gradient-primary)" }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl -ml-24 -mb-24" />
        <div className="relative">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 flex items-center">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-white/90 text-lg">
            Here&apos;s what&apos;s happening with your backend today.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="relative overflow-hidden py-6 border-0 shadow-elegant hover:shadow-glow transition-all duration-300 hover:-translate-y-1 group"
          >
            <div
              className={`absolute inset-0 opacity-5 group-hover:opacity-15 transition-opacity rounded-xl bg-gradient-to-br ${stat.gradient}`}
            />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div
                className={`h-10 w-10 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br ${stat.gradient}`}
              >
                <stat.icon className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <div className="text-3xl font-bold text-foreground">
                  {stat.value}
                </div>
                {stat.trend && (
                  <div className="flex items-center text-xs font-medium text-green-500">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {stat.trend}
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3 text-blue-400" />
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Activity + Projects */}
      <div className="grid gap-4 min-h-[250px] md:gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card className="border-0 shadow-elegant py-6 gap-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">Recent Activity</CardTitle>
            <CardDescription>Latest updates from your backend</CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Clock className="h-16 w-16 mb-4 text-blue-400/70" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No Recent Activity
                </h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  No activities have been performed recently. Once a team member
                  joins, updates a document, or makes changes, it will appear
                  here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-400/20 transition-colors group shadow-sm"
                  >
                    {/* Activity Icon */}
                    <div
                      className={`flex-shrink-0 m-auto h-10 w-10 rounded-lg flex items-center justify-center text-white shadow-md ${
                        activity.type === "create"
                          ? "bg-blue-400 dark:bg-blue-500"
                          : activity.type === "update"
                          ? "bg-yellow-400 dark:bg-yellow-500"
                          : activity.type === "delete"
                          ? "bg-red-400 dark:bg-red-500"
                          : activity.type === "join"
                          ? "bg-purple-400 dark:bg-purple-500"
                          : "bg-teal-400 dark:bg-teal-500"
                      }`}
                    >
                      {activity.type === "create" && (
                        <Plus className="h-5 w-5" />
                      )}
                      {activity.type === "update" && (
                        <Edit className="h-5 w-5" />
                      )}
                      {activity.type === "delete" && (
                        <Trash2 className="h-5 w-5" />
                      )}
                      {activity.type === "join" && (
                        <UsersIcon className="h-5 w-5" />
                      )}
                      {activity.type === "invite" && (
                        <Mail className="h-5 w-5" />
                      )}
                    </div>

                    {/* Activity Content */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <p className="text-sm font-medium text-foreground dark:text-white truncate">
                        {activity.action}
                      </p>
                      <p className="text-xs font-mono flex flex-col max-w-40 text-muted-foreground dark:text-gray-400 truncate">
                        <span>by: {user.name}</span>
                        <span>Project: {activity.collection}</span>
                      </p>
                    </div>

                    {/* Activity Timestamp */}
                    <span className="text-xs text-muted-foreground dark:text-gray-400 whitespace-nowrap">
                      {activity.time}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Projects */}
        <Card className="border-0 shadow-elegant py-6 gap-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">Recent Projects</CardTitle>
            <CardDescription>
              Projects you recently created or joined
            </CardDescription>
          </CardHeader>

          <CardContent>
            {projects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Folder className="h-16 w-16 mb-4 text-blue-400/70" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No Projects Yet
                </h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  You haven’t created or joined any projects yet. Once you do,
                  they’ll appear here for quick access.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {projects.slice(0, 5).map((project) => (
                  <div
                    key={project._id}
                    className="flex items-center justify-between gap-3 p-3 rounded-lg border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-400/20 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-semibold shadow-md">
                        <LucideFolder className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground dark:text-white">
                          {project.name}
                        </p>
                        <p className="text-xs text-muted-foreground dark:text-gray-400">
                          {project.members?.length ?? 0} member
                          {project.members && project.members.length !== 1
                            ? "s"
                            : ""}
                        </p>
                      </div>
                    </div>
                    <Link href={`/projects/${project._id}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-400/40 duration-200 text-blue-500"
                      >
                        View
                        <ArrowUpRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
