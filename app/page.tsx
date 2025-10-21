import HeroSection from "../components/custom/HeroSection";
import { FeaturedProperties } from "../components/custom/FeaturedProperties";
import { properties } from "@/lib/placeholder-data";

export default function Home() {
  const chaletsCelestes = properties.filter(
    (property) => property.category === "Chalets Celestes"
  );
  const chaletsVerdes = properties.filter(
    (property) => property.category === "Chalets Verdes"
  );
  const chaletsAmarillos = properties.filter(
    (property) => property.category === "Chalets Amarillos"
  );

  return (
    <main>
      <HeroSection
        videoSrc="https://www.pexels.com/download/video/34219110/"
        title="Encuentra tu Próximo Destino"
        subtitle="Explora propiedades exclusivas para unas vacaciones inolvidables."
      />
      <FeaturedProperties
        title="Chalets Celestes"
        properties={chaletsCelestes}
      />
      <FeaturedProperties title="Chalets Verdes" properties={chaletsVerdes} />
      <FeaturedProperties
        title="Chalets Amarillos"
        properties={chaletsAmarillos}
      />
    </main>
  );
}
