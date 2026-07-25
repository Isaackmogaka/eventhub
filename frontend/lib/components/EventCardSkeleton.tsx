import { Skeleton } from './Skeleton';

export function EventCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <Skeleton className="h-24 w-full rounded-none" />
      <div className="p-4">
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-3 w-1/2 mb-3" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}
