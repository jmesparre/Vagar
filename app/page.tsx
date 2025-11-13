import HeroSection from "../components/custom/HeroSection";
import { FeaturedProperties } from "../components/custom/FeaturedProperties";
import { fetchFeaturedPropertiesByCategory, fetchFeaturedExperiences, fetchFeaturedTestimonials } from "@/lib/data";
import * as Typography from "@/components/ui/typography";
import { FeaturedExperiences } from "@/components/custom/FeaturedExperiences";
import { FeaturedTestimonials } from "@/components/custom/FeaturedTestimonials";

export default async function Home() {
  // Fetch featured properties and experiences in parallel
  const [
    featuredVerde,
    featuredAmarillo,
    featuredCeleste,
    featuredExperiences,
    featuredTestimonials,
  ] = await Promise.all([
    fetchFeaturedPropertiesByCategory('Verde', 6),
    fetchFeaturedPropertiesByCategory('Amarillo', 6),
    fetchFeaturedPropertiesByCategory('Celeste', 6),
    fetchFeaturedExperiences(4),
    fetchFeaturedTestimonials(),
  ]);

  return (
    <main>
      <HeroSection
        videoSrc="/video-hero.mp4"
        title="Encuentra tu Próximo Destino"
        subtitle="Explora propiedades exclusivas para unas vacaciones inolvidables."
      />
      
      {/* Section for 'Celeste' category */}
      {featuredCeleste.length > 0 && (
        <div className="py-12">
          <Typography.H2 className="mb-8 pl-4 sm:pl-6 lg:pl-8">Chalets Celestes Destacados</Typography.H2>
          <FeaturedProperties properties={featuredCeleste} />
        </div>
      )}

      {/* Section for 'Amarillo' category */}
      {featuredAmarillo.length > 0 && (
        <div className="py-12 bg-gray-50">
          <Typography.H2 className="mb-8 pl-4 sm:pl-6 lg:pl-8">Chalets Amarillos Destacados</Typography.H2>
          <FeaturedProperties properties={featuredAmarillo} />
        </div>
      )}

      {/* Section for 'Verde' category */}
      {featuredVerde.length > 0 && (
        <div className="py-12">
          <Typography.H2 className="mb-8 pl-4 sm:pl-6 lg:pl-8">Chalets Verdes Destacados</Typography.H2>
          <FeaturedProperties properties={featuredVerde} />
        </div>
      )}

      {/* Section for Featured Experiences */}
      {featuredExperiences.length > 0 && (
        <div className="py-12 bg-gray-50">
          <FeaturedExperiences title="Experiencias Destacadas" experiences={featuredExperiences} />
        </div>
      )}

      {/* Section for Featured Testimonials */}
      {featuredTestimonials.length > 0 && (
        <div className="py-12">
          <FeaturedTestimonials testimonials={featuredTestimonials} />
        </div>
      )}
    </main>
  );
}
