"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AmenitiesPopoverContent } from "./AmenitiesPopoverContent";
import { GuestsPopoverContent } from "./GuestsPopoverContent";

const SearchBar = () => {
  const [date, setDate] = React.useState<DateRange | undefined>();

  const [isAmenitiesPopoverOpen, setIsAmenitiesPopoverOpen] =
    React.useState(false);
  const [isDatePopoverOpen, setIsDatePopoverOpen] = React.useState(false);
  const [isGuestsPopoverOpen, setIsGuestsPopoverOpen] = React.useState(false);

  const [selectedAmenities, setSelectedAmenities] = React.useState<string[]>([]);

  const handleAmenityToggle = (amenityId: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenityId)
        ? prev.filter((id) => id !== amenityId)
        : [...prev, amenityId]
    );
  };

  const amenitiesText =
    selectedAmenities.length > 0
      ? `filtrar por: ${selectedAmenities.length} amenities`
      : "filtrar por:";

  const [guests, setGuests] = React.useState({
    adults: 0,
    children: 0,
    infants: 0,
  });

  const handleGuestChange = (
    type: keyof typeof guests,
    operation: "increment" | "decrement"
  ) => {
    setGuests((prev) => {
      const newGuests = { ...prev };
      const newCount =
        operation === "increment" ? newGuests[type] + 1 : newGuests[type] - 1;

      // Prevent negative numbers
      newGuests[type] = Math.max(0, newCount);

      // If infants or children are added, ensure there's at least one adult.
      if (
        (type === "infants" || type === "children") &&
        operation === "increment" &&
        newGuests.adults === 0
      ) {
        newGuests.adults = 1;
      }

      // Prevent decrementing adults to 0 if there are children or infants.
      if (
        type === "adults" &&
        operation === "decrement" &&
        newCount < 1 &&
        (newGuests.children > 0 || newGuests.infants > 0)
      ) {
        return prev; // Don't update state
      }

      return newGuests;
    });
  };

  const totalGuests = guests.adults + guests.children;
  const guestsPart =
    totalGuests > 0
      ? `${totalGuests} huésped${totalGuests > 1 ? "es" : ""}`
      : "";
  const infantsPart =
    guests.infants > 0
      ? `${guests.infants} Infante${guests.infants > 1 ? "s" : ""}`
      : "";

  const guestText =
    [guestsPart, infantsPart].filter(Boolean).join(", ") || "Agregar huéspedes";

  const isAnyPopoverOpen =
    isAmenitiesPopoverOpen || isDatePopoverOpen || isGuestsPopoverOpen;

  const [isButtonExpanded, setIsButtonExpanded] = React.useState(false);

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAnyPopoverOpen) {
      setIsButtonExpanded(true);
    } else {
      timer = setTimeout(() => {
        setIsButtonExpanded(false);
      }, 75); // A small delay to prevent flickering when switching popovers
    }
    return () => clearTimeout(timer);
  }, [isAnyPopoverOpen]);

  return (
    <div className="bg-white border-1 border-gray-200 rounded-full shadow-lg flex items-center w-full max-w-3xl">
      <div className="flex-1">
        <Popover onOpenChange={setIsAmenitiesPopoverOpen}>
          <PopoverTrigger asChild>
            <button className="w-full text-left px-6 py-3 hover:bg-gray-200 rounded-l-full">
              <p className="font-bold text-xs text-gray-800">Amenities</p>
              <p className="text-sm text-gray-500">{amenitiesText}</p>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <AmenitiesPopoverContent
              selectedAmenities={selectedAmenities}
              onAmenityToggle={handleAmenityToggle}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="h-8 border-l border-gray-200"></div>

      <div className="flex-1">
        <Popover onOpenChange={setIsDatePopoverOpen}>
          <PopoverTrigger asChild>
            <button className="w-full text-left px-6 py-3 hover:bg-gray-200">
              <p className="font-bold text-xs text-gray-800">Cuándo</p>
              <p className="text-sm text-gray-500">
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd")} - {format(date.to, "LLL dd")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Agregar fechas</span>
                )}
              </p>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="h-8 border-l border-gray-200"></div>

      <div className="flex-1">
        <Popover onOpenChange={setIsGuestsPopoverOpen}>
          <PopoverTrigger asChild>
            <button className="w-full text-left px-6 py-3 hover:bg-gray-200 rounded-r-full">
              <p className="font-bold text-xs text-gray-800">Huéspedes</p>
              <p className="text-sm text-gray-500">{guestText}</p>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <GuestsPopoverContent
              guests={guests}
              handleGuestChange={handleGuestChange}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="p-2">
        <Button
          title="Buscar"
          className={cn(
            "bg-blue-400 text-white rounded-full hover:bg-blue-500 flex items-center justify-center transition-all duration-300 ease-in-out overflow-hidden",
            isButtonExpanded ? "w-26 h-12" : "w-12 h-12"
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 ml-2 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <span
            className={cn(
              "whitespace-nowrap transition-all ease-in-out duration-300",
              isButtonExpanded
                ? "max-w-[100px] opacity-100 ml-1 mr-1"
                : "max-w-0 opacity-0 ml-0"
            )}
          >
            Buscar
          </span>
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;
