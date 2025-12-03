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

import { Minus, Plus } from "lucide-react";

interface AmenitiesPopoverContentProps {
  selectedAmenities?: string[];
  onAmenityToggle?: (amenityId: string) => void;
  minGuests?: number;
  onMinGuestsChange?: (guests: number) => void;
  showGuestFilter?: boolean;
}

export function AmenitiesPopoverContent({
  selectedAmenities = [],
  onAmenityToggle = () => { },
  minGuests = 1,
  onMinGuestsChange = () => { },
  showGuestFilter = false,
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
    <div className="p-4 pr-2 w-96 pt-6">
      {showGuestFilter && (
        <div className="mb-4 border-b pb-4 flex flex-wrap gap-15">
          <h4 className="text-sm pt-3 font-medium mb-3">Cantidad de huéspedes</h4>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onMinGuestsChange(Math.max(1, minGuests - 1))}
              disabled={minGuests <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-4 text-center text-sm">{minGuests}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => onMinGuestsChange(minGuests + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      <ScrollArea className="h-80 w-full">
        <div className="pr-4">
          {Object.entries(groupedAmenities).map(([category, amenities]) => (
            <div key={category} className="mb-4">
              <h4 className="text-xs font-medium  pb-2">{category}</h4>
              <div className="flex flex-wrap gap-1.5">
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
