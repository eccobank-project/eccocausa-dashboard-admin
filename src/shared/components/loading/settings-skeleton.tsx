import { Skeleton } from "@/components/ui/skeleton";

const SETTINGS_SECTIONS = 4;

export function SettingsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-44" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Settings tabs */}
      <div className="flex space-x-4 border-b">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-28" />
        <Skeleton className="h-10 w-22" />
      </div>

      {/* Settings sections */}
      <div className="space-y-8">
        {Array.from({ length: SETTINGS_SECTIONS }, (_, i) => (
          <div className="space-y-4" key={`setting-section-${i}`}>
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-80" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-1">
                  <Skeleton className="h-5 w-36" />
                  <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-6 w-12" />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-1">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-56" />
                </div>
                <Skeleton className="h-10 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Save button */}
      <div className="flex justify-end pt-4">
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}
