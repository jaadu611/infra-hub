import React from "react";
import Activity from "@/models/Activity";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  Clock,
  Database,
  Trash2,
  UserPlus,
  Mail,
  Plus,
  Activity as ActivityIcon,
} from "lucide-react";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import { cn } from "@/lib/utils";

interface ActivityItem {
  _id: string;
  user?: {
    _id: string;
    name?: string;
    email?: string;
  };
  action: string;
  collectionName: string;
  type: "delete" | "join" | "invite" | "create";
  createdAt: string;
}

const typeConfig = {
  delete: {
    icon: Trash2,
    color: "text-red-500",
    bgColor: "bg-red-50 dark:bg-red-950/30",
    borderColor: "border-red-200 dark:border-red-800/30",
    badgeVariant: "destructive" as const,
  },
  join: {
    icon: UserPlus,
    color: "text-green-500",
    bgColor: "bg-green-50 dark:bg-green-950/30",
    borderColor: "border-green-200 dark:border-green-800/30",
    badgeVariant: "default" as const,
  },
  invite: {
    icon: Mail,
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    borderColor: "border-blue-200 dark:border-blue-800/30",
    badgeVariant: "secondary" as const,
  },
  create: {
    icon: Plus,
    color: "text-indigo-500",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
    borderColor: "border-indigo-200 dark:border-indigo-800/30",
    badgeVariant: "outline" as const,
  },
};

function getRelativeTime(date: string): string {
  const now = new Date();
  const past = new Date(date);
  const diff = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;

  return past.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: past.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

function getUserInitials(name?: string, email?: string): string {
  if (name)
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  if (email) return email.slice(0, 2).toUpperCase();
  return "??";
}

export default async function RecentActivitiesPage() {
  await connectDB();
  const session = await auth();

  if (!session?.user?.email) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-950/30 rounded-full flex items-center justify-center mx-auto">
              <Zap className="w-8 h-8 text-blue-600 dark:text-blue-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">
                Authentication Required
              </h2>
              <p className="text-sm text-muted-foreground">
                Please log in to view recent activities.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const activities = await Activity.find()
    .sort({ createdAt: -1 })
    .limit(100)
    .populate("user", "email name")
    .lean<ActivityItem[]>();

  if (!activities.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-6 px-4">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <ActivityIcon className="w-12 h-12 text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">No Activity Yet</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Once you start using the platform, your activities will appear
              here. Start creating, inviting, or joining to see your activity
              log.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const grouped = activities.reduce((acc, act) => {
    const date = new Date(act.createdAt).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    (acc[date] ||= []).push(act);
    return acc;
  }, {} as Record<string, ActivityItem[]>);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header */}
        <header className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 border border-blue-200 dark:border-blue-800/40">
          <div className="relative p-8 lg:p-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="p-4 rounded-2xl bg-yellow-500 text-white shadow-inner shadow-yellow-700/20">
                  <Zap className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                  <h1 className="text-4xl font-bold text-white">
                    Recent Activities
                  </h1>
                  <p className="text-blue-100">
                    Track all workspace actions and events
                  </p>
                </div>
              </div>
              <div className="text-right text-white">
                <p className="text-3xl font-bold">{activities.length}</p>
                <p className="text-sm opacity-80">Total Activities</p>
              </div>
            </div>
          </div>
        </header>

        {/* Activity timeline */}
        <div className="space-y-4">
          {Object.entries(grouped).map(([date, acts]) => (
            <div key={date} className="space-y-4">
              <div className="z-10 flex items-center gap-3 py-2 bg-background/80 backdrop-blur-sm">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                <h2 className="text-sm font-semibold text-muted-foreground px-3 py-1 rounded-full bg-muted">
                  {date}
                </h2>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {acts.map((activity) => {
                  const config = typeConfig[activity.type];
                  const Icon = config.icon;

                  return (
                    <Card
                      key={activity._id.toString()}
                      className={cn(
                        "group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
                        config.borderColor
                      )}
                    >
                      <div
                        className={cn(
                          "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity",
                          config.bgColor
                        )}
                      />
                      <CardContent className="relative p-5 space-y-4">
                        <div className="flex items-start justify-between gap-3">
                          <div
                            className={cn("p-2.5 rounded-xl", config.bgColor)}
                          >
                            <Icon className={cn("w-5 h-5", config.color)} />
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Clock className="w-3.5 h-3.5" />
                            <time dateTime={activity.createdAt}>
                              {getRelativeTime(activity.createdAt)}
                            </time>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Badge
                            variant={config.badgeVariant}
                            className="capitalize"
                          >
                            {activity.type}
                          </Badge>
                          <p className="font-medium text-sm leading-relaxed">
                            {activity.action || "No details available"}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <Database className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground truncate">
                            {activity.collectionName || "Unknown collection"}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 pt-3 border-t">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-semibold shadow-sm">
                            {getUserInitials(
                              activity.user?.name,
                              activity.user?.email
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {activity.user?.name || "Unknown User"}
                            </p>
                            {activity.user?.email && (
                              <p className="text-xs text-muted-foreground truncate">
                                {activity.user.email}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
