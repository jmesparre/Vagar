"use client";

import { useState, useEffect } from "react";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { GuestsPopoverContent } from "@/components/custom/GuestsPopoverContent";
import { DatePickerPopoverContent } from "@/components/custom/DatePickerPopoverContent";
import { Button } from "@/components/ui/button";
import { properties } from "@/lib/placeholder-data";
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger, DialogClose, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Lightbox } from "@/components/custom/Lightbox";
import { Star, Check, X, ChevronLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { AmenitiesDialog } from "@/components/custom/AmenitiesDialog";
import { AmenitiesPopoverContent } from "@/components/custom/AmenitiesPopoverContent";
import { allAmenities } from "@/lib/amenities-data";
import { PropertyCard } from "@/components/custom/PropertyCard";
import { H1, H2, P } from "@/components/ui/typography";
import { Skeleton } from "@/components/ui/skeleton";
import { ComparisonTable } from "@/components/custom/ComparisonTable";

export default function ChaletDetailPage() {
  // Por ahora, usamos el primer chalet de los datos de ejemplo
  const chalet = properties[0];
  const [comparisonChalet, setComparisonChalet] = useState(properties[1]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [countFilters, setCountFilters] = useState({ bedrooms: 0, beds: 0, bathrooms: 0 });
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });

  const [guests, setGuests] = useState({
    adults: 1,
    children: 0,
    infants: 0,
  });

  const handleGuestChange = (
    type: keyof typeof guests,
    operation: "increment" | "decrement"
  ) => {
    setGuests((prev) => {
      const newCount =
        operation === "increment" ? prev[type] + 1 : prev[type] - 1;
      if (type === "adults" && newCount < 1) return prev; // Must have at least 1 adult
      return {
        ...prev,
        [type]: Math.max(0, newCount),
      };
    });
  };

  const totalGuests = guests.adults + guests.children;
  const guestText =
    totalGuests > 0
      ? `${totalGuests} huésped${totalGuests > 1 ? "es" : ""}`
      : "Seleccione huéspedes";

  const handleOpenLightbox = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleCloseLightbox = () => {
    setSelectedImageIndex(null);
  };

  const handleAmenityToggle = (amenityId: string) => {
    setActiveFilters((prev) =>
      prev.includes(amenityId)
        ? prev.filter((id) => id !== amenityId)
        : [...prev, amenityId]
    );
  };

  const handleCountChange = (
    type: keyof typeof countFilters,
    operation: "increment" | "decrement"
  ) => {
    setCountFilters((prev) => ({
      ...prev,
      [type]:
        operation === "increment"
          ? Math.min(7, prev[type] + 1)
          : Math.max(0, prev[type] - 1),
    }));
  };

  const filteredProperties = properties.slice(1).filter(property => {
    const amenitiesMatch = activeFilters.every(filterId => property.amenities.includes(filterId));
    const bedroomsMatch = property.bedrooms >= countFilters.bedrooms;
    const bedsMatch = property.beds >= countFilters.beds;
    // Assuming bathrooms are not in the property data, so we don't filter by it yet.
    // const bathroomsMatch = property.bathrooms >= countFilters.bathrooms; 
    return amenitiesMatch && bedroomsMatch && bedsMatch;
  });

  useEffect(() => {
    // Si el chalet de comparación actual ya no está en la lista filtrada,
    // o si la lista filtrada tiene elementos y el chalet de comparación no está en ella,
    // actualizamos al primer elemento de la lista filtrada.
    if (filteredProperties.length > 0 && !filteredProperties.find(p => p.id === comparisonChalet.id)) {
      setComparisonChalet(filteredProperties[0]);
    }
  }, [activeFilters, comparisonChalet.id, filteredProperties]);

  return (
    <main className="container mx-auto px-4 py-8">
      <Dialog>
        {/* Galería de Imágenes */}
        <section className="mb-8">
          {isLoading ? (
            <div>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                <div className="col-span-1 md:col-span-1">
                  <Skeleton className="h-[400px] w-full rounded-lg" />
                </div>
                <div className="col-span-1 grid grid-cols-2 grid-rows-2 gap-2">
                  <Skeleton className="h-full w-full rounded-lg" />
                  <Skeleton className="h-full w-full rounded-lg" />
                  <Skeleton className="h-full w-full rounded-lg" />
                  <Skeleton className="h-full w-full rounded-lg" />
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <Skeleton className="h-10 w-36" />
                <Skeleton className="h-10 w-28" />
                <Skeleton className="h-10 w-28" />
              </div>
            </div>
          ) : (
            <>
              <DialogTrigger asChild>
                <div className="grid cursor-pointer grid-cols-1 gap-2 md:grid-cols-2">
                  <div className="col-span-1 md:col-span-1">
                    <div className="relative h-[400px] w-full">
                      <Image
                        src={chalet.images[0]}
                        alt={`Imagen principal de ${chalet.title}`}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg"
                      />
                    </div>
                  </div>
                  <div className="col-span-1 grid grid-cols-2 grid-rows-2 gap-2">
                    {chalet.images.slice(1, 5).map((img, index) => (
                      <div key={index} className="relative h-full w-full">
                        <Image
                          src={img}
                          alt={`Imagen ${index + 1} de ${chalet.title}`}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </DialogTrigger>
              <div className="mt-4 flex space-x-2">
                <DialogTrigger asChild>
                  <Button variant="outline">Ver todas las fotos</Button>
                </DialogTrigger>
                <Button variant="outline">Ver Video</Button>
                <Button variant="outline">Ver Plano</Button>
              </div>
            </>
          )}
        </section>

        <DialogContent
          showCloseButton={false}
          onPointerDownOutside={(e) => {
            if ((e.target as HTMLElement)?.closest('[data-lightbox-root]')) {
              e.preventDefault();
            }
          }}
          className="!h-screen !w-screen !max-w-full !top-0 !left-0 !translate-x-0 !translate-y-0 !rounded-none !border-none bg-white p-0"
        >
            <DialogHeader>
              <DialogTitle className="sr-only">Galería de Imágenes</DialogTitle>
            </DialogHeader>
            <DialogClose asChild>
              <Button variant="ghost" className="absolute left-4 top-4 z-10 h-12 w-12 rounded-full p-2">
                <ChevronLeft className="h-18 w-18 scale-[140%]" />
                <span className="sr-only">Cerrar</span>
              </Button>
            </DialogClose>
            <div className="h-full overflow-y-auto p-4 pt-16">
              <div className="columns-1 gap-4 space-y-4 sm:columns-2 lg:columns-3">
                {chalet.images.map((src, index) => (
                  <div
                    key={index}
                    className="break-inside-avoid cursor-pointer"
                    onClick={() => handleOpenLightbox(index)}
                  >
                    <Image
                      src={src}
                      alt={`Imagen de la galería ${index + 1}`}
                      width={500}
                      height={500}
                      className="h-auto w-full rounded-lg object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
        </DialogContent>
      </Dialog>

      {selectedImageIndex !== null && (
        <Lightbox
          images={chalet.images}
          initialIndex={selectedImageIndex}
          onClose={handleCloseLightbox}
        />
      )}

      {/* Información Principal y Reserva */}
        <section className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Columna Izquierda: Información */}
          <div className="md:col-span-2">
            {isLoading ? (
              <Skeleton className="h-9 w-3/4" />
            ) : (
              <H1 className="text-3xl font-bold">{chalet.title}</H1>
            )}
            <div className="mt-2 flex items-center">
              <Star className="h-5 w-5 fill-primary text-primary" />
              <span className="ml-1 font-semibold">{chalet.rating.toFixed(2)}</span>
            </div>
            <div className="mt-4 flex space-x-4 text-sm text-muted-foreground">
              <span>{chalet.guests} huéspedes</span>
              <span>·</span>
              <span>{chalet.bedrooms} dormitorios</span>
              <span>·</span>
              <span>{chalet.beds} camas</span>
            </div>
            <Separator className="my-6" />
            <P>
              Chalet para {chalet.guests} personas, piscina privada cercada con la opción a climatizar, vistas privilegiadas, galería exterior cubierta, la casa cuenta con wifi.
            </P>

            <Separator className="my-8" />

            {/* Qué ofrece este chalet */}
            <section>
              <H2>Qué ofrece este chalet</H2>
              <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">
                {chalet.amenities.slice(0, 6).map((amenityId) => {
                  const amenity = allAmenities.find((a) => a.id === amenityId);
                  if (!amenity) return null;
                  const Icon = amenity.icon;
                  return (
                    <div key={amenity.id} className="flex items-center space-x-2">
                      <Icon className="h-5 w-5" />
                      <span>{amenity.name}</span>
                    </div>
                  );
                })}
              </div>
              <AmenitiesDialog chalet={chalet} />
            </section>

            <Separator className="my-8" />

            {/* Servicios Adicionales */}
            <section>
              <H2>Servicios Adicionales</H2>
              <div className="mt-4 space-y-2 text-muted-foreground">
                <P>Climatizador de piscina: $36.900</P>
                <P>Ropa blanca (costo semanal por persona)</P>
                <P>Servicio básico: $13.500 (Provisión de sábanas y 1 juego de toallas, sin recambio ni amenities.)</P>
                <P>Servicio superior: $25.500 (Provisión de sábanas y 1 juego de toallas, incluye amenities y set de elementos de limpieza en cocina con 1 recambio en la semana de toallas, no incluye recambio de sábanas.)</P>
              </div>
            </section>

            <Separator className="my-8" />

            {/* Normas del chalet */}
            <section>
              <H2>Normas del chalet</H2>
              <div className="mt-4 space-y-2 text-muted-foreground">
                <P>No acepta mascotas</P>
                <P>No acepta visitas</P>
              </div>
            </section>

            <Separator className="my-8" />

            {/* Dónde vas a hospedarte */}
            <section>
              <H2>Dónde vas a hospedarte</H2>
              <div className="mt-4 h-[400px] w-full rounded-lg bg-slate-200">
                {/* Placeholder para el mapa */}
                <Image
                  src="https://images.unsplash.com/photo-1588557132643-ff9f8a442332?q=80&w=2574&auto=format&fit=crop"
                  alt="Mapa de ubicación del chalet"
                  width={800}
                  height={400}
                  className="h-full w-full rounded-lg object-cover"
                />
              </div>
            </section>

            <Separator className="my-8" />

            {/* Comparar con otros Chalets */}
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
                    <CarouselPrevious  />
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
                        counts={countFilters}
                        onCountChange={handleCountChange}
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

              <ComparisonTable mainChalet={chalet} comparisonChalet={comparisonChalet} />
            </section>
          </div>

          {/* Columna Derecha: Tarjeta de Reserva */}
          <div className="md:col-span-1">
            <div className="sticky top-6 rounded-xl border px-6 pt-6 pb-8 shadow-lg">
              <H2 className="mb-1">Precio</H2>
              <div className="space-y-2 text-sm text-muted-foreground mb-6">
                <div className="flex justify-between">
                  <span>Temporada alta</span>
                  <span className="font-semibold text-foreground">
                    ${chalet.price.high.toLocaleString('es-AR')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Temporada media</span>
                  <span className="font-semibold text-foreground">
                    ${chalet.price.mid.toLocaleString('es-AR')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Temporada Baja</span>
                  <span className="font-semibold text-foreground">
                    ${chalet.price.low.toLocaleString('es-AR')}
                  </span>
                </div>
              </div>
              <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                <PopoverTrigger asChild>
                  <div className="grid grid-cols-2 rounded-t-lg border cursor-pointer">
                    <div className="p-2">
                      <div className="text-xs font-bold uppercase">CHECK-IN</div>
                      <div className="text-xs">
                        {date?.from ? format(date.from, "MM/dd/yyyy") : "Add date"}
                      </div>
                    </div>
                    <div className="border-l p-2">
                      <div className="text-xs font-bold uppercase">CHECKOUT</div>
                      <div className="text-xs">
                        {date?.to ? format(date.to, "MM/dd/yyyy") : "Add date"}
                      </div>
                    </div>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
                  <DatePickerPopoverContent
                    date={date}
                    setDate={setDate}
                    onClose={() => setIsDatePickerOpen(false)}
                  />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <div className="rounded-b-lg border border-t-0 p-2 cursor-pointer">
                    <div className="text-xs font-bold uppercase">HUESPEDES</div>
                    <div className="flex items-center justify-between text-xs">
                      <span>{guestText}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </div>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <GuestsPopoverContent
                    guests={guests}
                    handleGuestChange={handleGuestChange}
                  />
                </PopoverContent>
              </Popover>
              <Button className="mt-4 w-full bg-blue-400 text-white hover:bg-blue-500">
                Reservar
              </Button>
            </div>
          </div>
        </section>
    </main>
  );
}
