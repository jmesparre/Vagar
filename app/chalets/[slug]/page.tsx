import { fetchPropertyBySlug, fetchProperties, getChaletBookings } from "@/lib/data";
import { notFound } from "next/navigation";
import { Star } from "lucide-react";
import { AvailabilityCalendar } from "@/components/custom/AvailabilityCalendar";
import { ImageGallery } from "@/components/custom/ImageGallery";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { H1, H2, P } from "@/components/ui/typography";
import { AmenitiesDialog } from "@/components/custom/AmenitiesDialog";
import { GoogleMapsEmbed } from "@/components/custom/GoogleMapsEmbed";
import { ComparisonCarousel } from "@/components/custom/ComparisonCarousel";
import { BookingCard } from "@/components/custom/BookingCard";
import { allAmenities } from "@/lib/amenities-data";

export async function generateStaticParams() {
  const properties = await fetchProperties();
  return properties.map((property) => ({
    slug: property.slug,
  }));
}

interface ChaletDetailPageProps {
  params: {
    slug: string;
  };
}

export default async function ChaletDetailPage(props: ChaletDetailPageProps) {
  const { slug } = props.params;
  const chalet = await fetchPropertyBySlug(slug);
  const allProperties = await fetchProperties();

  if (!chalet) {
    notFound();
  }

  // Excluir el chalet actual de la lista de comparación
  const propertiesForComparison = allProperties.filter(p => p.id !== chalet.id);
  const bookings = await getChaletBookings(chalet.id.toString());

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Galería de Imágenes */}
      <section className="mb-8">
        <ImageGallery 
          galleryImages={chalet.gallery_images || []} 
          blueprintImages={chalet.blueprint_images || []} 
          videoUrl={chalet.video_url} 
        />
      </section>

      {/* Información Principal y Reserva */}
      <section className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Columna Izquierda: Información */}
        <div className="md:col-span-2">
          <H1 className="text-3xl font-bold">{chalet.name}</H1>
          <div className="mt-2 flex items-center">
            <Star className="h-5 w-5 fill-primary text-primary" />
            <span className="ml-1 font-semibold">{chalet.rating ? Number(chalet.rating).toFixed(2) : 'N/A'}</span>
          </div>
          <div className="mt-4 flex space-x-4 text-sm text-muted-foreground">
            <span>{chalet.guests} huéspedes</span>
            <span>·</span>
            <span>{chalet.bedrooms} dormitorios</span>
            <span>·</span>
            <span>{chalet.beds} camas</span>
          </div>
          <Separator className="my-6" />
          <P>{chalet.description}</P>

          <Separator className="my-8" />

          {/* Qué ofrece este chalet */}
          <section>
            <H2>Qué ofrece este chalet</H2>
            <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">
              {(chalet.amenities || []).slice(0, 6).map((amenity: { id: number; name: string }) => {
                const amenityDetails = allAmenities.find((a) => a.name === amenity.name);
                if (!amenityDetails) return null;
                const Icon = amenityDetails.icon;
                return (
                  <div key={`amenity-item-${amenity.id}`} className="flex items-center space-x-2">
                    <Icon className="h-5 w-5" />
                    <span>{amenity.name}</span>
                  </div>
                );
              })}
            </div>
            <AmenitiesDialog chalet={chalet} />
          </section>

          {chalet.optional_services && (
            <>
              <Separator className="my-8" />
              <section>
                <H2>Servicios opcionales</H2>
                <div className="mt-4 space-y-2 text-muted-foreground">
                  <P className="whitespace-pre-line">{chalet.optional_services}</P>
                </div>
              </section>
            </>
          )}

          {/* Normas del chalet */}
          {chalet.rules && chalet.rules.length > 0 && (
            <>
              <Separator className="my-8" />
              <section>
                <H2>Normas del chalet</H2>
                <div className="mt-4 space-y-2 text-muted-foreground">
                  {chalet.rules.map((rule: { id?: number; rule_text: string }, index) => (
                    <P key={rule.id ?? index}>{rule.rule_text}</P>
                  ))}
                </div>
              </section>
            </>
          )}

          <Separator className="my-8" />

          {/* Disponibilidad */}
          <AvailabilityCalendar bookings={bookings} />

          <Separator className="my-8" />

          {/* Dónde vas a hospedarte */}
          <section>
            <H2>Dónde vas a hospedarte</H2>
            <div className="mt-4 h-[400px] w-full rounded-lg bg-slate-200">
              {chalet.latitude && chalet.longitude ? (
                <GoogleMapsEmbed latitude={chalet.latitude} longitude={chalet.longitude} />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-slate-200 rounded-lg">
                  <p className="text-slate-500">La ubicación no está disponible.</p>
                </div>
              )}
            </div>
          </section>

          <Separator className="my-8" />

          {/* Comparar con otros Chalets */}
          <ComparisonCarousel
            mainChalet={chalet}
            propertiesForComparison={propertiesForComparison}
          />
        </div>

        {/* Columna Derecha: Tarjeta de Reserva */}
        <div className="md:col-span-1">
          <BookingCard chalet={chalet} />
        </div>
      </section>
    </main>
  );
}
