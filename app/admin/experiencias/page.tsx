import { Button } from '@/components/ui/button';
import Link from 'next/link';
import ExperiencesTable from '@/components/custom/ExperiencesTable';
import { Experience } from '@/lib/types';

async function getExperiences(): Promise<Experience[]> {
  // Construct the base URL using the VERCEL_URL or a local fallback
  const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/experiencias`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch experiences');
  }
  return res.json();
}

export default async function ExperiencesPage() {
  const experiences = await getExperiences();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestionar Experiencias</h1>
        <Button asChild>
          <Link href="/admin/experiencias/new">
            Crear Nueva Experiencia
          </Link>
        </Button>
      </div>
      <ExperiencesTable experiences={experiences} />
    </div>
  );
}
