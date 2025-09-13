import { Skeleton } from "@/components/ui/skeleton";

const StatCardSkeleton = () => (
  <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
    <div className="flex items-center justify-between space-y-0 pb-2">
      <Skeleton className="h-4 w-[80px]" />
      <Skeleton className="h-4 w-4 rounded-full" />
    </div>
    <Skeleton className="mb-1 h-8 w-[60px]" />
    <Skeleton className="h-3 w-[100px]" />
  </div>
);

export const StatsGridSkeleton = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
    </div>
  );
};
