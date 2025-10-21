import { experiences } from '@/lib/placeholder-data';
import { H1, H2, P } from '@/components/ui/typography';
import { ImageGallery } from '@/components/custom/ImageGallery';
import { Separator } from '@/components/ui/separator';
import { FeaturedExperiences } from '@/components/custom/FeaturedExperiences';

export default function ExperienciaDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const experience = experiences.find((exp) => exp.id === params.id);

  if (!experience) {
    return <div>Experiencia no encontrada</div>;
  }

  const relatedExperiences = experiences
    .filter(
      (exp) =>
        exp.category === experience.category && exp.id !== experience.id,
    )
    .slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-12">
      <ImageGallery
        images={experience.images}
        showVideoButton={false}
        showPlanButton={false}
      />
      <div className="mt-8">
        <H1>{experience.title}</H1>
        <P className="mt-4 text-lg">{experience.longDescription}</P>
      </div>

      <Separator className="my-8" />

      <div>
        <H2>Qué deberías saber</H2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {experience.whatYouShouldKnow.map((item, index) => (
            <div key={index} className="flex items-start">
              <span className="mr-2 mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-black" />
              <P>{item}</P>
            </div>
          ))}
        </div>
      </div>

      <Separator className="my-8" />

      {relatedExperiences.length > 0 && (
        <FeaturedExperiences
          title="Otras experiencias"
          experiences={relatedExperiences}
        />
      )}
    </div>
  );
}
