import { Skeleton } from "@/components/ui/skeleton";

export function ImageGallerySkeleton() {
    return (
        <div className="relative">
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                {/* Main Image Skeleton */}
                <div className="h-full">
                    <div className="relative h-full min-h-[200px] w-full overflow-hidden rounded-lg md:min-h-[412px]">
                        <Skeleton className="h-full w-full" />
                    </div>
                </div>
                {/* Secondary Images Grid Skeleton */}
                <div className="grid grid-cols-2 grid-rows-2 gap-2 hidden md:grid">
                    {[...Array(4)].map((_, index) => (
                        <div
                            key={index}
                            className="relative h-full min-h-[200px] w-full overflow-hidden rounded-lg"
                        >
                            <Skeleton className="h-full w-full" />
                        </div>
                    ))}
                </div>
            </div>
            {/* Buttons Skeleton */}
            <div className="absolute bottom-4 right-4 flex flex-col items-end gap-1.5 md:flex-row">
                <Skeleton className="h-8 w-32 rounded-md" />
                <Skeleton className="h-8 w-24 rounded-md" />
            </div>
        </div>
    );
}
