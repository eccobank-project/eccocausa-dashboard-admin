import { Skeleton } from "@/components/ui/skeleton";

export function MapSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-28" />
        </div>
      </div>

      {/* Map controls */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-36" />
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Map container */}
      <div className="relative h-[60vh] overflow-hidden rounded-lg border">
        <Skeleton className="h-full w-full" />

        {/* Map overlay elements */}
        <div className="absolute top-4 left-4">
          <Skeleton className="h-32 w-64 rounded-lg" />
        </div>

        <div className="absolute right-4 bottom-4 space-y-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>

        {/* Mock map markers */}
        <div className="absolute top-1/4 left-1/3">
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
        <div className="absolute top-1/2 left-1/2">
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
        <div className="absolute top-3/4 left-2/3">
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
      </div>

      {/* Info panel */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-lg border p-4">
          <Skeleton className="mb-2 h-4 w-24" />
          <Skeleton className="h-6 w-16" />
        </div>
        <div className="rounded-lg border p-4">
          <Skeleton className="mb-2 h-4 w-32" />
          <Skeleton className="h-6 w-20" />
        </div>
        <div className="rounded-lg border p-4">
          <Skeleton className="mb-2 h-4 w-28" />
          <Skeleton className="h-6 w-24" />
        </div>
      </div>
    </div>
  );
}
