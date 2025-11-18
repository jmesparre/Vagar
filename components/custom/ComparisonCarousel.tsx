"use client";

import { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { AmenitiesPopoverContent } from "@/components/custom/AmenitiesPopoverContent";
import { PropertyCard } from "@/components/custom/PropertyCard";
import { H2, P } from "@/components/ui/typography";
import { ComparisonTable } from "@/components/custom/ComparisonTable";
import { Property } from "@/lib/types";

interface ComparisonCarouselProps {
  mainChalet: Property;
  propertiesForComparison: Property[];
}

export function ComparisonCarousel({ mainChalet, propertiesForComparison }: ComparisonCarouselProps) {
  const [comparisonChalet, setComparisonChalet] = useState(propertiesForComparison[0]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const handleAmenityToggle = (amenityId: string) => {
    setActiveFilters((prev) =>
      prev.includes(amenityId)
        ? prev.filter((id) => id !== amenityId)
        : [...prev, amenityId]
    );
  };

  const filteredProperties = propertiesForComparison.filter(property => {
    return activeFilters.every(filterId => 
      (property.amenities || []).some(a => a.id.toString() === filterId)
    );
  });

  useEffect(() => {
    if (filteredProperties.length > 0 && !filteredProperties.find(p => p.id === comparisonChalet?.id)) {
      setComparisonChalet(filteredProperties[0]);
    } else if (filteredProperties.length === 0) {
      setComparisonChalet(propertiesForComparison[0]);
    }
  }, [activeFilters, comparisonChalet, filteredProperties, propertiesForComparison]);

  return (
    <section>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <div className="relative mb-4">
          <H2>Comparar con otros Chalets</H2>
          <div className="absolute right-14 top-4.5 hidden items-center gap-1 md:flex">
            <CarouselPrevious />
            <CarouselNext />
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <P className="text-muted-foreground">Filtrar por Ameniti</P>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Filtros:</Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-[400px]">
              <AmenitiesPopoverContent
                selectedAmenities={activeFilters}
                onAmenityToggle={handleAmenityToggle}
              />
            </PopoverContent>
          </Popover>
        </div>

        <CarouselContent>
          {filteredProperties.length > 0 ? (
            filteredProperties.map((property) => (
              <CarouselItem key={property.id} className="md:basis-1/2 lg:basis-1/3 cursor-pointer" onClick={() => setComparisonChalet(property)}>
                <div className="p-1">
                  <PropertyCard property={property} disableLink={true} />
                </div>
              </CarouselItem>
            ))
          ) : (
            <div className="w-full text-center py-8">
              <P>No se encontraron chalets con los filtros seleccionados.</P>
            </div>
          )}
        </CarouselContent>
        <div className="mt-6 flex items-center justify-center gap-2 md:hidden">
          <CarouselPrevious />
          <CarouselNext />
        </div>
      </Carousel>

      {comparisonChalet && <ComparisonTable mainChalet={mainChalet} comparisonChalet={comparisonChalet} />}
    </section>
  );
}
