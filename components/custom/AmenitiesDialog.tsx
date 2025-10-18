import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog-custom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { allAmenities } from "@/lib/amenities-data";
import { Property } from "@/lib/types";

interface AmenitiesDialogProps {
  chalet: Property;
}

export function AmenitiesDialog({ chalet }: AmenitiesDialogProps) {
  const amenitiesDetails = chalet.amenities
    .map((amenityId) =>
      allAmenities.find((amenity) => amenity.id === amenityId)
    )
    .filter(Boolean);

  const amenitiesByCategory = amenitiesDetails.reduce((acc, amenity) => {
    if (amenity) {
      const { category } = amenity;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(amenity);
    }
    return acc;
  }, {} as Record<string, typeof amenitiesDetails>);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="mt-6">
          Mostrar los {chalet.amenities.length} Amenities
        </Button>
      </DialogTrigger>
      <DialogContent
        overlayClassName="bg-black/80"
        className="sm:max-w-[425px]"
      >
        <DialogHeader>
          <DialogTitle>Qué ofrece este chalet</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] w-full">
          <div className="p-4">
            {Object.entries(amenitiesByCategory).map(
              ([category, amenities], index) => (
                <div key={category}>
                  {index > 0 && <Separator className="my-4" />}
                  <h3 className="text-lg font-semibold mb-4">{category}</h3>
                  <ul className="space-y-4">
                    {amenities.map((amenity) => {
                      if (!amenity) return null;
                      const Icon = amenity.icon;
                      return (
                        <li key={amenity.id} className="flex items-center">
                          <Icon className="h-5 w-5 mr-3" />
                          <span>{amenity.name}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
