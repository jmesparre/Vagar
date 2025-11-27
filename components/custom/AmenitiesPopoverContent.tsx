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

interface AmenitiesPopoverContentProps {
  selectedAmenities?: string[];
  onAmenityToggle?: (amenityId: string) => void;
}

export function AmenitiesPopoverContent({
  selectedAmenities = [],
  onAmenityToggle = () => {},
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
    <div className="p-6 w-96">
      <ScrollArea className="h-80 w-full">
        <div className="pr-4">
          {Object.entries(groupedAmenities).map(([category, amenities]) => (
            <div key={category} className="mb-4">
              <h4 className="text-sm pb-1">{category}</h4>
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
