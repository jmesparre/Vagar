import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { PropertyCard } from "./PropertyCard";
import { type Property } from "@/lib/types";

interface FeaturedPropertiesProps {
  title?: string;
  properties: Property[];
}

export function FeaturedProperties({ properties }: FeaturedPropertiesProps) {
  if (!properties || properties.length === 0) {
    return null; // No renderizar nada si no hay propiedades
  }

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <div className="relative">
          <div className="absolute -top-12 right-10 hidden md:flex items-center gap-2">
            <CarouselPrevious />
            <CarouselNext />
          </div>
        </div>
        <CarouselContent className="-ml-4">
          {properties.map((property) => (
            <CarouselItem key={property.id} className="pl-4 md:basis-1/3 lg:basis-1/4">
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
