"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { allAmenities } from "@/lib/amenities-data";
import { cn } from "@/lib/utils";

interface AmenityButtonProps {
  text: string;
  Icon: React.ElementType;
  isSelected: boolean;
  onClick: () => void;
}

const AmenityButton = ({ text, Icon, isSelected, onClick }: AmenityButtonProps) => (
  <Button
    variant="outline"
    onClick={onClick}
    className={cn(
      "flex items-center gap-2 h-8 rounded-md px-2 text-xs",
      isSelected && "border-primary text-primary"
    )}
  >
    <Icon className="h-4 w-4" />
    {text}
  </Button>
);

interface CountControlProps {
  label: string;
  count: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

const CountControl = ({ label, count, onIncrement, onDecrement }: CountControlProps) => (
  <div className="flex items-center justify-between">
    <span className="text-sm">{label}</span>
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" className="h-6 w-6" onClick={onDecrement} disabled={count === 0}>-</Button>
      <span className="w-4 text-center">{count}</span>
      <Button variant="outline" size="icon" className="h-6 w-6" onClick={onIncrement} disabled={count === 7}>+</Button>
    </div>
  </div>
);

interface AmenitiesPopoverContentProps {
  selectedAmenities?: string[];
  onAmenityToggle?: (amenityId: string) => void;
  counts?: {
    bedrooms: number;
    beds: number;
    bathrooms: number;
  };
  onCountChange?: (
    type: "bedrooms" | "beds" | "bathrooms",
    operation: "increment" | "decrement"
  ) => void;
}

export function AmenitiesPopoverContent({
  selectedAmenities = [],
  onAmenityToggle = () => {},
  counts = { bedrooms: 0, beds: 0, bathrooms: 0 },
  onCountChange = () => {},
}: AmenitiesPopoverContentProps) {

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
            <h4 className="font-semibold mb-3">Habitaciones y camas</h4>
            <div className="space-y-2">
              <CountControl
                label="Dormitorios"
                count={counts.bedrooms}
                onIncrement={() => onCountChange("bedrooms", "increment")}
                onDecrement={() => onCountChange("bedrooms", "decrement")}
              />
              <CountControl
                label="Camas"
                count={counts.beds}
                onIncrement={() => onCountChange("beds", "increment")}
                onDecrement={() => onCountChange("beds", "decrement")}
              />
              <CountControl
                label="Baños"
                count={counts.bathrooms}
                onIncrement={() => onCountChange("bathrooms", "increment")}
                onDecrement={() => onCountChange("bathrooms", "decrement")}
              />
            </div>
          </div>

          {Object.entries(groupedAmenities).map(([category, amenities]) => (
            <div key={category} className="mb-4">
              <h4 className="font-semibold mb-3">{category}</h4>
              <div className="flex flex-wrap gap-2">
                {amenities.map((amenity) => (
                  <AmenityButton
                    key={amenity.id}
                    text={amenity.name}
                    Icon={amenity.icon}
                    isSelected={selectedAmenities.includes(amenity.id)}
                    onClick={() => onAmenityToggle(amenity.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
