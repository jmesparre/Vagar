"use client";

import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ExperienceCard } from "./ExperienceCard";
import { type Experience } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { H2 } from "@/components/ui/typography";

interface FeaturedExperiencesProps {
  title: string;
  experiences: Experience[];
  priority?: boolean;
}

export function FeaturedExperiences({
  title,
  experiences,
  priority = false,
}: FeaturedExperiencesProps) {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // Simula un tiempo de carga de 1.5 segundos
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <Carousel
        opts={{
          align: "start",
          loop: !isLoading, // Desactiva el loop durante la carga
        }}
        className="w-full"
      >
        <div className="relative mb-8">
          <H2 className="text-2xl text-left md:text-3xl font-bold tracking-tight">
            {title}
          </H2>
          <div className="absolute top-3 right-10 hidden  md:flex items-center gap-2">
            <CarouselPrevious />
            <CarouselNext />
          </div>
        </div>
        <CarouselContent className="ml-4 ">
          {isLoading
            ? Array.from({ length: 3 }).map((_, index) => (
              <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <div className="flex flex-col space-y-3">
                  <Skeleton className="w-full rounded-xl aspect-[3/4]" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              </CarouselItem>
            ))
            : experiences.map((experience, index) => (
              <CarouselItem
                key={experience.id}
                className="pl-4 md:basis-1/2 lg:basis-1/3"
              >
                <ExperienceCard
                  experience={experience}
                  priority={priority && index < 3}
                />
              </CarouselItem>
            ))}
        </CarouselContent>
        <div className="md:hidden flex items-center justify-center gap-2 mt-6">
          <CarouselPrevious />
          <CarouselNext />
        </div>
      </Carousel>
    </section>
  );
}
