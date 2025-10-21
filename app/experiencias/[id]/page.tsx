import { experiences } from '@/lib/placeholder-data';
import { H1, P } from '@/components/ui/typography';
import Image from 'next/image';

export default function ExperienciaDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const experience = experiences.find((exp) => exp.id === params.id);

  if (!experience) {
    return <div>Experiencia no encontrada</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="relative h-96 w-full overflow-hidden rounded-lg">
        <Image
          src={experience.image}
          alt={experience.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="mt-8">
        <H1>{experience.title}</H1>
        <P className="mt-4 text-lg">{experience.description}</P>
      </div>
    </div>
  );
}
