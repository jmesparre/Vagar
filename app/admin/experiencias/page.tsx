import { Button } from '@/components/ui/button';
import Link from 'next/link';
import ExperiencesTable from '@/components/custom/ExperiencesTable';
import { Experience } from '@/lib/types';

async function getExperiences(): Promise<Experience[] | null> {
  try {
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
    const headers: HeadersInit = {
      'Cache-Control': 'no-store',
    };

    // Add Vercel bypass token if available
    if (process.env.VERCEL_AUTOMATION_BYPASS_SECRET) {
      headers['Authorization'] = `Bearer ${process.env.VERCEL_AUTOMATION_BYPASS_SECRET}`;
    }

    const res = await fetch(`${baseUrl}/api/experiencias`, {
      headers,
    });

    if (!res.ok) {
      // Log the error response for debugging
      const errorBody = await res.text();
      console.error(`Failed to fetch experiences. Status: ${res.status}, Body: ${errorBody}`);
      return null;
    }

    return res.json();
  } catch (error) {
    console.error('An unexpected error occurred while fetching experiences:', error);
    return null;
  }
}

export default async function ExperiencesPage() {
  const experiences = await getExperiences();

  if (!experiences) {
    return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-3xl font-bold mb-4">Error</h1>
        <p className="text-lg text-red-500">
          No se pudieron cargar las experiencias. Por favor, revisa los logs del servidor para más detalles.
        </p>
      </div>
    );
  }

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
