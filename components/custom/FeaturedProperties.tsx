"use client";

import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { properties } from "@/lib/placeholder-data";
import { PropertyCard } from "./PropertyCard";

export function FeaturedProperties() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <div className="relative mb-8">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Chalets Celestes
          </h2>
          <div className="absolute top-3 right-10 hidden  md:flex items-center gap-2">
            <CarouselPrevious />
            <CarouselNext />
          </div>
        </div>
        <CarouselContent className="ml-4 ">
          {properties.map((property) => (
            <CarouselItem key={property.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
              <PropertyCard property={property} />
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
