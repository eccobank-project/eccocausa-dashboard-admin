import { Skeleton } from "@/components/ui/skeleton";

const STATS_COUNT = 4;
const TABLE_ROWS_COUNT = 7;

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Stats grid skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: STATS_COUNT }, (_, i) => (
          <div className="rounded-lg border bg-card p-6 shadow-sm" key={`stats-skeleton-${i}`}>
            <div className="space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="space-y-4">
        {/* Table header */}
        <div className="flex items-center justify-between gap-3">
          <Skeleton className="h-10 w-60" />
          <div className="flex gap-3">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>

        {/* Table rows */}
        <div className="space-y-2">
          {Array.from({ length: TABLE_ROWS_COUNT }, (_, i) => (
            <div className="flex items-center gap-4 rounded-lg border p-4" key={`table-row-skeleton-${i}`}>
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
              <div className="ml-auto">
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
