import Image from 'next/image';
import Link from 'next/link';
import { Experience } from '@/lib/types';
import { H4, P } from '@/components/ui/typography';

interface ExperienceCardProps {
  experience: Experience;
}

export const ExperienceCard = ({ experience }: ExperienceCardProps) => {
  return (
    <Link href={`/experiencias/${experience.id}`}>
      <div className="group block overflow-hidden rounded-lg border border-gray-200 shadow-sm">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={experience.image}
            alt={experience.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="p-4">
          <H4 className="truncate font-semibold">{experience.title}</H4>
          <P className="mt-2 text-sm text-gray-600">{experience.description}</P>
        </div>
      </div>
    </Link>
  );
};
