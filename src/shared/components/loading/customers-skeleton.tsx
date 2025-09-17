import { Skeleton } from "@/components/ui/skeleton";

const STATS_COUNT = 4;
const TABLE_ROWS_COUNT = 10;

export function CustomersSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-10 w-36" />
      </div>

      {/* Stats grid skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: STATS_COUNT }, (_, i) => (
          <div className="rounded-lg border bg-card p-6 shadow-sm" key={`customer-stats-${i}`}>
            <div className="space-y-3">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-3 w-36" />
            </div>
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="space-y-4">
        {/* Table filters */}
        <div className="flex items-center justify-between gap-3">
          <Skeleton className="h-10 w-64" />
          <div className="flex gap-3">
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        {/* Table content */}
        <div className="rounded-lg border">
          <div className="border-b bg-muted/50 p-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-18" />
            </div>
          </div>
          <div className="divide-y">
            {Array.from({ length: TABLE_ROWS_COUNT }, (_, i) => (
              <div className="flex items-center gap-4 p-4" key={`customer-row-${i}`}>
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-28" />
                <div className="ml-auto">
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
