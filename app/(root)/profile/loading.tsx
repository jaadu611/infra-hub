// app/settings/loading.tsx

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="p-4 md:p-8 space-y-8 animate-fade-in">
        {/* Header Skeleton */}
        <div className="text-center md:text-left space-y-4">
          <Skeleton className="h-10 w-64 rounded-md mx-auto md:mx-0" />
          <Skeleton className="h-5 w-80 rounded-md mx-auto md:mx-0" />
          <div className="flex justify-center md:justify-start gap-2 mt-4 flex-wrap">
            <Skeleton className="h-6 w-32 rounded-md" />
            <Skeleton className="h-6 w-28 rounded-md" />
          </div>
        </div>

        {/* Profile Card Skeleton */}
        <Card className="shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 p-6 rounded-t-lg">
            <div className="flex items-center gap-4">
              <Skeleton className="h-6 w-6 rounded-full" />
              <div>
                <Skeleton className="h-5 w-40 mb-2" />
                <Skeleton className="h-4 w-56" />
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8 flex flex-col gap-6">
            {/* Avatar */}
            <div className="flex justify-center">
              <Skeleton className="h-24 w-24 rounded-full" />
            </div>

            {/* Form Fields */}
            <div className="grid gap-6 sm:grid-cols-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-12 w-full rounded-md" />
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Skeleton className="h-12 w-40 rounded-md" />
              <Skeleton className="h-12 w-32 rounded-md" />
            </div>
          </CardContent>
        </Card>

        {/* Security Card Skeleton */}
        <Card className="shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800 p-6 rounded-t-lg">
            <div className="flex items-center gap-4">
              <Skeleton className="h-6 w-6 rounded-full" />
              <div>
                <Skeleton className="h-5 w-40 mb-2" />
                <Skeleton className="h-4 w-56" />
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8 space-y-6">
            {/* Security Status */}
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-64" />
              </div>
            </div>

            {/* Password Fields */}
            <div className="grid gap-6 sm:grid-cols-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2 sm:col-span-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-12 w-full rounded-md" />
                </div>
              ))}
            </div>

            {/* Password Requirements */}
            <div className="space-y-3">
              <Skeleton className="h-5 w-48" />
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-3 w-72" />
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Skeleton className="h-12 w-48 rounded-md" />
              <Skeleton className="h-12 w-32 rounded-md" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
