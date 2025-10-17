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
  Activity,
  TrendingUp,
  ArrowUpRight,
  Clock,
  Folder,
  LucideFolder,
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

interface Document {
  _id: string;
  title?: string;
  content: string;
  projectId: string;
}

interface APIRequest {
  _id: string;
  endpoint: string;
}

interface Activity {
  type: "success" | "create" | "update" | "delete";
  action: string;
  collection: string;
  time: string;
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

  const data: DashboardData | null = await getUserDashboardData(
    session.user.email
  );

  if (!data) {
    return <p className="text-center mt-20 text-red-500">User not found.</p>;
  }

  const { user, projects, documents, apiRequests, recentActivity } = data;

  // ------------------ Stats ------------------
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
      title: "Active Users",
      value: (() => {
        const allMembers = projects.flatMap((p) => p.members ?? []);
        const allUserIds = allMembers
          .map((m) =>
            typeof m.user === "object" ? m.user._id?.toString() : m.user
          )
          .filter(Boolean);
        const uniqueUserIds = Array.from(new Set(allUserIds));
        const activeUserIds = uniqueUserIds.filter(
          (id) => id !== user._id.toString()
        );
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
      icon: Activity,
      change: apiRequests.length
        ? `+${apiRequests.length} from last week`
        : "No data",
      trend: apiRequests.length ? "+12%" : "",
      gradient: "from-cyan-500 to-blue-600",
    },
  ];

  // ------------------ Render ------------------
  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 animate-fade-in">
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
      <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card className="border-0 shadow-elegant py-6">
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
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors group"
                  >
                    <div
                      className={`w-2 h-2 mt-1 rounded-full ${
                        activity.type === "success"
                          ? "bg-green-400"
                          : activity.type === "create"
                          ? "bg-blue-400"
                          : "bg-yellow-400"
                      }`}
                    />
                    <div className="flex-1 space-y-1 min-w-0">
                      <p className="text-sm font-medium leading-none text-foreground">
                        {activity.action}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono truncate">
                        {activity.collection}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {activity.time}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Projects */}
        <Card className="border-0 shadow-elegant py-6">
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
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-800 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-semibold">
                        <LucideFolder />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {project.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
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
                        className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-400/40! duration-200 text-blue-500"
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
