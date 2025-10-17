import { Skeleton } from '@/components/ui/skeleton';

export const SearchBarSkeleton = () => {
  return (
    <div className="bg-white border-1 border-gray-200 rounded-full shadow-lg flex items-center w-full max-w-3xl p-2">
      <div className="flex-1 px-4 py-1">
        <Skeleton className="h-4 w-1/2 mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      <div className="h-8 border-l border-gray-200"></div>

      <div className="flex-1 px-4 py-1">
        <Skeleton className="h-4 w-1/2 mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      <div className="h-8 border-l border-gray-200"></div>

      <div className="flex-1 px-4 py-1">
        <Skeleton className="h-4 w-1/2 mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      <Skeleton className="rounded-full w-12 h-12" />
    </div>
  );
};
