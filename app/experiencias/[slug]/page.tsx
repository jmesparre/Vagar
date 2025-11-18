import { fetchExperienceBySlug, fetchExperiences } from '@/lib/data';
import { H1, H2, P } from '@/components/ui/typography';
import { ImageGallery } from '@/components/custom/ImageGallery';
import { Separator } from '@/components/ui/separator';
import { FeaturedExperiences } from '@/components/custom/FeaturedExperiences';
import { notFound } from 'next/navigation';

export default async function ExperienciaDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const experience = await fetchExperienceBySlug(params.slug);

  if (!experience) {
    notFound();
  }

  // Ensure what_to_know is an array
  let whatToKnowItems = [];
  if (typeof experience.what_to_know === 'string') {
    try {
      whatToKnowItems = JSON.parse(experience.what_to_know);
    } catch (error) {
      console.error('Failed to parse what_to_know:', error);
    }
  } else if (Array.isArray(experience.what_to_know)) {
    whatToKnowItems = experience.what_to_know;
  }

  // Fetch all experiences to find related ones
  const allExperiences = await fetchExperiences();
  const relatedExperiences = allExperiences
    .filter(
      (exp) =>
        exp.category === experience.category && exp.slug !== experience.slug,
    )
    .slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-12">
      <ImageGallery galleryImages={experience.gallery_images} />
      <div className="mt-8">
        <H1>{experience.title}</H1>
        <P className="mt-4 text-lg">{experience.long_description}</P>
      </div>

      <Separator className="my-8" />

      <div>
        <H2>Qué deberías saber</H2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {whatToKnowItems.map((item: string, index: number) => (
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
