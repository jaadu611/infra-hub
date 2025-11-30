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
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import User from "@/models/User";
import mongoose from "mongoose";

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
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/");
  }

  await connectDB();

  // 1. Fetch user by email
  const user = await User.findOne({ email: session.user.email });

  if (!user?._id) {
    redirect("/");
  }

  // 2. All requests for this user
  const userRequests = await APIRequest.find({ user: user._id })
    .populate("project", "name")
    .lean();

  // 3. Projects where this user is a member
  const projects = await Project.find(
    { "members.user": new mongoose.Types.ObjectId(user._id) },
    "name"
  ).lean();

  // 4. Aggregate daily request counts
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

  userRequests.forEach((r) => {
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

    dailyData[day][r.method as keyof (typeof dailyData)[typeof day]]++;
    dailyData[day].total++;
  });

  const chartData = Object.entries(dailyData).map(([date, data]) => ({
    date,
    ...data,
  }));

  // 5. Project filter (all or specific project)
  const activeProjectId = searchParams?.project || "all";

  const filteredRequests =
    activeProjectId === "all"
      ? userRequests
      : userRequests.filter(
          (r) => r.project?._id?.toString() === activeProjectId
        );

  // 6. Stats
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

  // 7. Method breakdown
  const methodBreakdown = filteredRequests.reduce((acc, r) => {
    acc[r.method] = (acc[r.method] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // 8. Project → request counts (for cards)
  const projectCounts: ProjectCount[] = projects.map((p) => {
    const projectRequests = userRequests.filter(
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
            <CardContent className="relative p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-green-100 dark:bg-green-950/30">
                  <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <Badge variant="outline">Success</Badge>
              </div>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {filteredSuccessRate}%
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {filteredSuccessCount} successful requests
              </p>
            </CardContent>
          </Card>

          {/* Failure Rate */}
          <Card className="relative overflow-hidden border-red-200 dark:border-red-800/30">
            <CardContent className="relative p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-red-100 dark:bg-red-950/30">
                  <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <Badge variant="outline">Failed</Badge>
              </div>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                {filteredTotalRequests === 0
                  ? "0"
                  : (
                      (filteredFailureCount / filteredTotalRequests) *
                      100
                    ).toFixed(1)}
                %
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {filteredFailureCount} failed requests
              </p>
            </CardContent>
          </Card>

          {/* Avg Response Time */}
          <Card className="relative overflow-hidden border-purple-200 dark:border-purple-800/30">
            <CardContent className="relative p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-950/30">
                  <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <Badge variant="outline">Speed</Badge>
              </div>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {filteredAvgResponseTime}ms
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Average response time
              </p>
            </CardContent>
          </Card>

          {/* Method Breakdown */}
          <Card className="relative overflow-hidden border-orange-200 dark:border-orange-800/30">
            <CardContent className="relative p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-orange-100 dark:bg-orange-950/30">
                  <BarChart3 className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <Badge variant="outline">Methods</Badge>
              </div>
              <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                {Object.keys(methodBreakdown).length}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Different HTTP methods
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        <Card className="py-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-blue-600" />
              Request Volume Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ApiRequestsChart chartData={chartData} />
          </CardContent>
        </Card>

        {/* Projects Overview */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Zap className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            <h2 className="text-2xl font-bold">Projects Overview</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* All Projects */}
            <Link href="/api-requests?project=all">
              <ProjectCard
                active={activeProjectId === "all"}
                name="All Projects"
                count={filteredTotalRequests}
                successRate={filteredSuccessRate}
              />
            </Link>

            {/* Individual Project Cards */}
            {projectCounts
              .sort((a, b) => b.count - a.count)
              .map((p) => (
                <Link key={p.id} href={`/api-requests?project=${p.id}`}>
                  <ProjectCard
                    active={activeProjectId === p.id}
                    name={p.name}
                    count={p.count}
                    successRate={p.successRate}
                  />
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Extracted Project Card for cleaner JSX */
function ProjectCard({
  active,
  name,
  count,
  successRate,
}: {
  active: boolean;
  name: string;
  count: number;
  successRate: string;
}) {
  return (
    <Card
      className={`group h-full hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ${
        active
          ? "bg-gradient-to-br from-blue-600 to-cyan-600 text-white border-blue-600"
          : "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 border-gray-200 dark:border-gray-700"
      }`}
    >
      <CardContent className="p-6 flex flex-col justify-between h-full">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div
              className={`p-2 rounded-lg ${
                active ? "bg-white/20" : "bg-gray-100 dark:bg-gray-800"
              }`}
            >
              <BarChart3
                className={`h-5 w-5 ${
                  active ? "text-white" : "text-gray-600 dark:text-gray-400"
                }`}
              />
            </div>
          </div>

          <p
            className={`text-lg font-semibold line-clamp-1 ${
              active ? "text-white" : ""
            }`}
          >
            {name}
          </p>

          <p
            className={`text-2xl font-bold mt-1 ${
              active ? "text-white" : "text-blue-600 dark:text-blue-400"
            }`}
          >
            {count}
          </p>

          <p
            className={`text-sm ${
              active ? "text-white" : "text-muted-foreground"
            }`}
          >
            requests
          </p>
        </div>

        <div
          className={`mt-4 pt-4 border-t ${
            active ? "border-white/30" : "border-gray-200 dark:border-gray-700"
          }`}
        >
          <p
            className={`text-xs ${
              active ? "text-white" : "text-muted-foreground"
            }`}
          >
            {successRate}% success rate
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
