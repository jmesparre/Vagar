import { ChaletForm } from "@/components/custom/ChaletForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchUsedMapNodeIds } from "@/lib/data";

export default async function NewChaletPage() {
  const usedMapNodeIds = await fetchUsedMapNodeIds();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cargar Nuevo Chalet</CardTitle>
        <CardDescription>
          Complete el formulario para agregar una nueva propiedad a la plataforma.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChaletForm usedMapNodeIds={usedMapNodeIds} />
      </CardContent>
    </Card>
  );
}
