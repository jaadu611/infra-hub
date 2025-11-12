// app/(root)/api-requests/page.tsx
import React from "react";
import { connectDB } from "@/lib/mongodb";
import Project from "@/models/Project";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Activity,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  BarChart3,
  Zap,
} from "lucide-react";
import APIRequest from "@/models/APIRequest";
import ApiRequestsChart from "@/components/ApiRequestsChart";

export const dynamic = "force-dynamic";

interface APIRequestDoc {
  _id: string;
  project?: {
    _id: string;
    name: string;
  };
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS";
  status: "success" | "failure";
  responseTimeMs: number;
  createdAt: Date;
}

interface ProjectCount {
  id: string;
  name: string;
  count: number;
  successRate: string;
}

export default async function ApiRequestsPage({
  searchParams,
}: {
  searchParams?: { project?: string };
}) {
  await connectDB();

  const requests = (await APIRequest.find()
    .populate("project", "name")
    .lean()) as unknown as APIRequestDoc[];

  const projects = await Project.find({}, "name").lean();

  // Aggregate data by date and method
  const dailyData: Record<
    string,
    {
      GET: number;
      POST: number;
      PUT: number;
      PATCH: number;
      DELETE: number;
      OPTIONS: number;
      total: number;
    }
  > = {};

  requests.forEach((r) => {
    const day = new Date(r.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    if (!dailyData[day]) {
      dailyData[day] = {
        GET: 0,
        POST: 0,
        PUT: 0,
        PATCH: 0,
        DELETE: 0,
        OPTIONS: 0,
        total: 0,
      };
    }

    dailyData[day][r.method]++;
    dailyData[day].total++;
  });

  const chartData = Object.entries(dailyData).map(([date, data]) => ({
    date,
    ...data,
  }));

  const activeProjectId = searchParams?.project || "all";

  // Filter requests for selected project
  const filteredRequests =
    activeProjectId === "all"
      ? requests
      : requests.filter((r) => r.project?._id?.toString() === activeProjectId);

  const filteredTotalRequests = filteredRequests.length;
  const filteredSuccessCount = filteredRequests.filter(
    (r) => r.status === "success"
  ).length;
  const filteredFailureCount = filteredRequests.filter(
    (r) => r.status === "failure"
  ).length;
  const filteredSuccessRate =
    filteredTotalRequests > 0
      ? ((filteredSuccessCount / filteredTotalRequests) * 100).toFixed(1)
      : "0";

  const filteredAvgResponseTime =
    filteredTotalRequests > 0
      ? (
          filteredRequests.reduce(
            (sum, r) => sum + (r.responseTimeMs || 0),
            0
          ) / filteredTotalRequests
        ).toFixed(0)
      : "0";

  // Method breakdown for filtered requests
  const methodBreakdown = filteredRequests.reduce((acc, r) => {
    acc[r.method] = (acc[r.method] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Count requests per project
  const projectCounts: ProjectCount[] = projects.map((p) => {
    const projectRequests = requests.filter(
      (r) => r.project?._id?.toString() === p._id!.toString()
    );
    const projectSuccess = projectRequests.filter(
      (r) => r.status === "success"
    ).length;
    return {
      id: p._id!.toString(),
      name: p.name,
      count: projectRequests.length,
      successRate:
        projectRequests.length > 0
          ? ((projectSuccess / projectRequests.length) * 100).toFixed(0)
          : "0",
    };
  });

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-600 shadow-2xl">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          <div className="relative p-8 lg:p-10">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm text-white shadow-xl">
                  <Activity className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                  <h1 className="text-4xl font-bold text-white">
                    API Analytics
                  </h1>
                  <p className="text-blue-100">
                    Monitor request traffic and performance metrics
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 min-w-[100px]">
                  <p className="text-3xl font-bold text-white">
                    {filteredTotalRequests}
                  </p>
                  <p className="text-xs text-blue-100 mt-1">Total Requests</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Success Rate */}
          <Card className="relative overflow-hidden border-green-200 dark:border-green-800/30">
            <div className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 bg-green-500/10 rounded-full blur-2xl"></div>
            <CardContent className="relative p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-green-100 dark:bg-green-950/30">
                  <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <Badge
                  variant="outline"
                  className="bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800"
                >
                  Success
                </Badge>
              </div>
              <div>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {filteredSuccessRate}%
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {filteredSuccessCount} successful requests
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Failure Rate */}
          <Card className="relative overflow-hidden border-red-200 dark:border-red-800/30">
            <div className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 bg-red-500/10 rounded-full blur-2xl"></div>
            <CardContent className="relative p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-red-100 dark:bg-red-950/30">
                  <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <Badge
                  variant="outline"
                  className="bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800"
                >
                  Failed
                </Badge>
              </div>
              <div>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                  {(100 - parseFloat(filteredSuccessRate)).toFixed(1)}%
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {filteredFailureCount} failed requests
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Avg Response Time */}
          <Card className="relative overflow-hidden border-purple-200 dark:border-purple-800/30">
            <div className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 bg-purple-500/10 rounded-full blur-2xl"></div>
            <CardContent className="relative p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-950/30">
                  <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <Badge
                  variant="outline"
                  className="bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800"
                >
                  Speed
                </Badge>
              </div>
              <div>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {filteredAvgResponseTime}ms
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Average response time
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Method Breakdown */}
          <Card className="relative overflow-hidden border-orange-200 dark:border-orange-800/30">
            <div className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 bg-orange-500/10 rounded-full blur-2xl"></div>
            <CardContent className="relative p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-orange-100 dark:bg-orange-950/30">
                  <BarChart3 className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <Badge
                  variant="outline"
                  className="bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800"
                >
                  Methods
                </Badge>
              </div>
              <div>
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                  {Object.keys(methodBreakdown).length}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Different HTTP methods
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        <Card className="py-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                  Request Volume Over Time
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Track API usage patterns across all HTTP methods
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ApiRequestsChart chartData={chartData} />
          </CardContent>
        </Card>

        {/* Projects Grid */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Zap className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            <h2 className="text-2xl font-bold">Projects Overview</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* "All Projects" card */}
            <Link href="/api-requests?project=all">
              <Card
                className={`group h-full hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border-2 ${
                  activeProjectId === "all"
                    ? "bg-gradient-to-br from-blue-600 to-cyan-600 text-white border-blue-600"
                    : "bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200 dark:border-blue-800/30"
                }`}
              >
                <CardContent className="p-6 flex flex-col justify-between h-full">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div
                        className={`p-2 rounded-lg ${
                          activeProjectId === "all"
                            ? "bg-white/20"
                            : "bg-blue-100 dark:bg-blue-900/30"
                        }`}
                      >
                        <Activity
                          className={`h-5 w-5 ${
                            activeProjectId === "all"
                              ? "text-white"
                              : "text-blue-600 dark:text-blue-400"
                          }`}
                        />
                      </div>
                    </div>
                    <div>
                      <p
                        className={`text-2xl font-bold ${
                          activeProjectId === "all"
                            ? "text-white"
                            : "text-blue-600 dark:text-blue-400"
                        }`}
                      >
                        {filteredTotalRequests}
                      </p>
                      <p
                        className={`text-sm mt-1 ${
                          activeProjectId === "all"
                            ? "text-white"
                            : "text-muted-foreground"
                        }`}
                      >
                        Total requests
                      </p>
                    </div>
                  </div>
                  <div
                    className={`mt-4 pt-4 border-t ${
                      activeProjectId === "all"
                        ? "border-white/30"
                        : "border-blue-200 dark:border-blue-800/30"
                    }`}
                  >
                    <p
                      className={`text-xs ${
                        activeProjectId === "all"
                          ? "text-white"
                          : "text-muted-foreground"
                      }`}
                    >
                      {filteredSuccessRate}% success rate
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {projectCounts
              .sort((a, b) => b.count - a.count)
              .map((p) => {
                const isActive = activeProjectId === p.id;
                return (
                  <Link key={p.id} href={`/api-requests?project=${p.id}`}>
                    <Card
                      className={`group h-full hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-br from-blue-600 to-cyan-600 text-white border-blue-600"
                          : "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 border-gray-200 dark:border-gray-700"
                      }`}
                    >
                      <CardContent className="p-6 flex flex-col justify-between h-full">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div
                              className={`p-2 rounded-lg ${
                                isActive
                                  ? "bg-white/20"
                                  : "bg-gray-100 dark:bg-gray-800"
                              }`}
                            >
                              <BarChart3
                                className={`h-5 w-5 ${
                                  isActive
                                    ? "text-white"
                                    : "text-gray-600 dark:text-gray-400"
                                }`}
                              />
                            </div>
                          </div>
                          <div>
                            <p
                              className={`text-lg font-semibold line-clamp-1 ${
                                isActive ? "text-white" : ""
                              }`}
                            >
                              {p.name}
                            </p>
                            <p
                              className={`text-2xl font-bold mt-1 ${
                                isActive
                                  ? "text-white"
                                  : "text-blue-600 dark:text-blue-400"
                              }`}
                            >
                              {p.count}
                            </p>
                            <p
                              className={`text-sm ${
                                isActive
                                  ? "text-white"
                                  : "text-muted-foreground"
                              }`}
                            >
                              requests
                            </p>
                          </div>
                        </div>
                        <div
                          className={`mt-4 pt-4 border-t ${
                            isActive
                              ? "border-white/30"
                              : "border-gray-200 dark:border-gray-700"
                          }`}
                        >
                          <p
                            className={`text-xs ${
                              isActive ? "text-white" : "text-muted-foreground"
                            }`}
                          >
                            {p.successRate}% success rate
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
