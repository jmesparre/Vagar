import { fetchPropertyById, fetchUsedMapNodeIds } from '@/lib/data';
import { ChaletForm } from '@/components/custom/ChaletForm';
import { notFound } from 'next/navigation';

export default async function EditChaletPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  try {
    const [chalet, usedMapNodeIds] = await Promise.all([
      fetchPropertyById(id),
      fetchUsedMapNodeIds(),
    ]);

    if (!chalet) {
      notFound();
    }

    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Editar Chalet</h1>
        <ChaletForm defaultValues={chalet} usedMapNodeIds={usedMapNodeIds} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching chalet for editing:", error);
    // Puedes mostrar un mensaje de error más amigable aquí si lo deseas.
    // Por ahora, redirigimos a notFound para simplicidad.
    notFound();
  }
}
