import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 animate-fade-in">
      {/* Header Skeleton */}
      <div className="relative overflow-hidden rounded-2xl p-8 md:p-10 bg-gradient-to-r from-gray-200/40 to-gray-300/40 dark:from-gray-800/50 dark:to-gray-700/50 animate-pulse shadow-glow">
        <div className="h-8 w-1/3 bg-gray-300/70 dark:bg-gray-600/70 rounded mb-3"></div>
        <div className="h-5 w-2/5 bg-gray-300/60 dark:bg-gray-600/60 rounded"></div>
      </div>

      {/* Stats Section Skeleton */}
      <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card
            key={i}
            className="relative overflow-hidden py-6 border-0 shadow-elegant animate-pulse"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 bg-gray-300/60 dark:bg-gray-600/60 rounded"></div>
              <div className="h-10 w-10 rounded-xl bg-gray-300/70 dark:bg-gray-600/70"></div>
            </CardHeader>
            <CardContent>
              <div className="h-7 w-20 bg-gray-300/70 dark:bg-gray-600/70 rounded mb-2"></div>
              <div className="h-3 w-28 bg-gray-300/50 dark:bg-gray-600/50 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Two-Column Section (Recent Activity & Recent Projects) */}
      <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
        {/* Recent Activity Skeleton */}
        <Card className="border-0 shadow-elegant py-6 animate-pulse">
          <CardHeader className="pb-3">
            <div className="h-5 w-32 bg-gray-300/60 dark:bg-gray-600/60 rounded mb-2"></div>
            <div className="h-3 w-44 bg-gray-300/50 dark:bg-gray-600/50 rounded"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mt-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-lg bg-gray-200/40 dark:bg-gray-700/40"
                >
                  <div className="w-2 h-2 mt-1 rounded-full bg-gray-400/60"></div>
                  <div className="flex-1 space-y-2 min-w-0">
                    <div className="h-4 w-32 bg-gray-300/60 dark:bg-gray-600/60 rounded"></div>
                    <div className="h-3 w-20 bg-gray-300/50 dark:bg-gray-600/50 rounded"></div>
                  </div>
                  <div className="h-3 w-10 bg-gray-300/50 dark:bg-gray-600/50 rounded"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Projects Skeleton */}
        <Card className="border-0 shadow-elegant py-6 animate-pulse">
          <CardHeader className="pb-3">
            <div className="h-5 w-32 bg-gray-300/60 dark:bg-gray-600/60 rounded mb-2"></div>
            <div className="h-3 w-44 bg-gray-300/50 dark:bg-gray-600/50 rounded"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mt-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-200/40 dark:bg-gray-700/40"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gray-300/60 dark:bg-gray-600/60"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-28 bg-gray-300/60 dark:bg-gray-600/60 rounded"></div>
                      <div className="h-3 w-16 bg-gray-300/50 dark:bg-gray-600/50 rounded"></div>
                    </div>
                  </div>
                  <div className="h-6 w-12 bg-gray-300/50 dark:bg-gray-600/50 rounded"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
