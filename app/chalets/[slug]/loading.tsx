import { ImageGallerySkeleton } from "@/components/custom/ImageGallerySkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function Loading() {
    return (
        <main className="container mx-auto px-4 sm:px-0 xl:px-10 py-8">
            {/* Gallery Skeleton */}
            <section className="mb-8">
                <ImageGallerySkeleton />
            </section>

            <section className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {/* Right Column: Booking Card Skeleton (Mobile Order 2) */}
                <div className="md:col-span-1 md:order-2">
                    <div className="sticky top-24">
                        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
                            <div className="p-6 space-y-4">
                                <div className="flex justify-between items-baseline">
                                    <Skeleton className="h-8 w-24" />
                                    <Skeleton className="h-4 w-16" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-10 w-full rounded-md" />
                                    <Skeleton className="h-10 w-full rounded-md" />
                                </div>
                                <Skeleton className="h-12 w-full rounded-full mt-4" />
                                <div className="pt-4 space-y-2">
                                    <div className="flex justify-between">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-4 w-12" />
                                    </div>
                                    <div className="flex justify-between">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-4 w-12" />
                                    </div>
                                    <Separator className="my-2" />
                                    <div className="flex justify-between">
                                        <Skeleton className="h-5 w-20" />
                                        <Skeleton className="h-5 w-16" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Left Column: Info Skeleton (Mobile Order 1) */}
                <div className="md:col-span-2 md:order-1">
                    {/* Title and Rating */}
                    <div className="flex space-x-4 mb-4">
                        <Skeleton className="h-10 w-3/4 md:w-1/2" />
                        <Skeleton className="h-8 w-16 mt-1 " />
                    </div>

                    {/* Quick info */}
                    <div className="flex space-x-4 mb-6">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-24" />
                    </div>

                    <Separator className="my-6" />

                    {/* Description */}
                    <div className="space-y-2 mb-8">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                    </div>

                    <Separator className="my-8" />

                    {/* Amenities Skeleton */}
                    <div className="mb-8">
                        <Skeleton className="h-8 w-48 mb-6" />
                        <div className="space-y-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i}>
                                    <Skeleton className="h-6 w-32 mb-4" />
                                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                                        {[1, 2, 3, 4, 5, 6].map((j) => (
                                            <div key={j} className="flex items-center space-x-2">
                                                <Skeleton className="h-5 w-5 rounded-md" />
                                                <Skeleton className="h-4 w-24" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
