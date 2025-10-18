"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { allAmenities } from "@/lib/amenities-data";
import { Separator } from "@/components/ui/separator";

const AmenityButton = ({
  text,
  Icon,
}: {
  text: string;
  Icon: React.ElementType;
}) => (
  <Button
    variant="outline"
    className="flex items-center gap-2 h-8 rounded-md px-2 text-xs"
  >
    <Icon className="h-4 w-4" />
    {text}
  </Button>
);

const CounterRow = ({
  label,
  value,
  onDecrement,
  onIncrement,
}: {
  label: string;
  value: number;
  onDecrement: () => void;
  onIncrement: () => void;
}) => (
  <div className="flex items-center justify-between">
    <p className="font-semibold">{label}</p>
    <div className="flex items-center gap-4">
      <Button
        variant="outline"
        size="icon"
        className="rounded-full h-8 w-8"
        onClick={onDecrement}
        disabled={value === 0}
      >
        -
      </Button>
      <span>{value === 0 ? "Cualquiera" : `${value}+`}</span>
      <Button
        variant="outline"
        size="icon"
        className="rounded-full h-8 w-8"
        onClick={onIncrement}
        disabled={value === 7}
      >
        +
      </Button>
    </div>
  </div>
);

export function AmenitiesPopoverContent() {
  const [counts, setCounts] = React.useState({
    bedrooms: 0,
    beds: 0,
    bathrooms: 0,
  });

  const handleCountChange = (
    type: keyof typeof counts,
    operation: "increment" | "decrement"
  ) => {
    setCounts((prev) => ({
      ...prev,
      [type]:
        operation === "increment"
          ? Math.min(7, prev[type] + 1)
          : Math.max(0, prev[type] - 1),
    }));
  };

  const groupedAmenities = allAmenities.reduce((acc, amenity) => {
    const { category } = amenity;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(amenity);
    return acc;
  }, {} as Record<string, typeof allAmenities>);

  return (
    <div className="p-4 w-96">
      <ScrollArea className="h-80 w-full">
        <div className="pr-4">
          <div className="mb-4">
            <h3 className="font-bold text-lg mb-3">Habitaciones y camas</h3>
            <div className="grid gap-4">
              <CounterRow
                label="Dormitorios"
                value={counts.bedrooms}
                onDecrement={() => handleCountChange("bedrooms", "decrement")}
                onIncrement={() => handleCountChange("bedrooms", "increment")}
              />
              <CounterRow
                label="Camas"
                value={counts.beds}
                onDecrement={() => handleCountChange("beds", "decrement")}
                onIncrement={() => handleCountChange("beds", "increment")}
              />
              <CounterRow
                label="Baños"
                value={counts.bathrooms}
                onDecrement={() => handleCountChange("bathrooms", "decrement")}
                onIncrement={() => handleCountChange("bathrooms", "increment")}
              />
            </div>
          </div>

          <Separator className="my-4" />

          {Object.entries(groupedAmenities).map(([category, amenities]) => (
            <div key={category} className="mb-4">
              <h4 className="font-semibold mb-3">{category}</h4>
              <div className="flex flex-wrap gap-2">
                {amenities.map((amenity) => (
                  <AmenityButton
                    key={amenity.id}
                    text={amenity.name}
                    Icon={amenity.icon}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="flex justify-end mt-4">
        <Button>Mostrar 36 casas</Button>
      </div>
    </div>
  );
}
