"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Testimonial } from "@/lib/types";
import { TestimonialCard } from "./TestimonialCard";
import { H2, P } from "../ui/typography";

interface FeaturedTestimonialsProps {
  testimonials: Testimonial[];
}

export function FeaturedTestimonials({
  testimonials,
}: FeaturedTestimonialsProps) {
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-12">
      <div className="container mx-auto">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <div className="relative mb-4">
            <H2>Lo que dicen nuestros huéspedes</H2>
            <P className="text-muted-foreground">
              Experiencias reales de quienes nos eligieron.
            </P>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden items-center gap-1 md:flex">
              <CarouselPrevious />
              <CarouselNext />
            </div>
          </div>
          <CarouselContent>
            {testimonials.map((testimonial) => (
              <CarouselItem
                key={testimonial.id}
                className="p-2 md:basis-1/2 lg:basis-1/3"
              >
                <TestimonialCard testimonial={testimonial} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="mt-6 flex items-center justify-center gap-2 md:hidden">
            <CarouselPrevious />
            <CarouselNext />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
