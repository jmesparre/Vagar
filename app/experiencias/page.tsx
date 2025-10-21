import HeroSection from '@/components/custom/HeroSection';
import { FeaturedExperiences } from '@/components/custom/FeaturedExperiences';
import { experiences } from '@/lib/placeholder-data';

export default function ExperienciasPage() {
  const zonaDeportiva = experiences.filter(
    (exp) => exp.category === 'Zona deportiva y social'
  );
  const turismo = experiences.filter((exp) => exp.category === 'Turismo');
  const zonaNaturaleza = experiences.filter(
    (exp) => exp.category === 'Zona de naturaleza'
  );

  return (
    <main>
      <HeroSection
        videoSrc="/video-hero.mp4"
        title="Experiencias Únicas"
        subtitle="Vive momentos inolvidables en Vagar"
        showSearchBar={false}
      />
      <div className="container mx-auto px-4 py-12">
        <FeaturedExperiences
          title="Zona deportiva y social"
          experiences={zonaDeportiva}
          priority
        />
        <FeaturedExperiences title="Turismo" experiences={turismo} />
        <FeaturedExperiences
          title="Zona de naturaleza"
          experiences={zonaNaturaleza}
        />
      </div>
    </main>
  );
}
