import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-black text-white p-8 space-y-8 animate-fade-in">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-48 rounded-md bg-gray-700/70" />
        <Skeleton className="h-10 w-32 rounded-md bg-gray-700/70" />
      </div>

      {/* Top 4 Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card
            key={i}
            className="bg-gray-800/90 border-0 shadow-md backdrop-blur-sm"
          >
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20 bg-gray-700/60" />
                <Skeleton className="h-6 w-10 bg-gray-700/60" />
              </div>
              <Skeleton className="h-10 w-10 rounded-full bg-gray-700/50" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-gray-800/90 border-0 shadow-md py-6">
            <CardContent className="space-y-3">
              <Skeleton className="h-6 w-32 bg-gray-700/60" />
              <Skeleton className="h-4 w-full bg-gray-700/50" />
              <Skeleton className="h-4 w-5/6 bg-gray-700/50" />
              <Skeleton className="h-8 w-24 rounded-md mt-4 bg-gray-700/50" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
