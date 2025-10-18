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

const SearchBar = () => {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });

  const [guests, setGuests] = React.useState({
    adults: 1,
    children: 0,
    infants: 0,
  });

  const handleGuestChange = (
    type: keyof typeof guests,
    operation: "increment" | "decrement"
  ) => {
    setGuests((prev) => {
      const newCount = operation === "increment" ? prev[type] + 1 : prev[type] - 1;
      if (type === "adults" && newCount < 1) return prev; // Must have at least 1 adult
      return {
        ...prev,
        [type]: Math.max(0, newCount),
      };
    });
  };

  const totalGuests = guests.adults + guests.children;
  const guestText =
    totalGuests > 0
      ? `${totalGuests} huésped${totalGuests > 1 ? "es" : ""}`
      : "¿Cuántos son?";

  return (
    <div className="bg-white border-1 border-gray-200 rounded-full shadow-lg flex items-center w-full max-w-3xl">
      <div className="flex-1">
        <Popover>
          <PopoverTrigger asChild>
            <button className="w-full text-left px-6 py-3 hover:bg-gray-200 rounded-l-full">
              <p className="font-bold text-xs text-gray-800">Amenities</p>
              <p className="text-sm text-gray-500">filtrar por:</p>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <AmenitiesPopoverContent />
          </PopoverContent>
        </Popover>
      </div>

      <div className="h-8 border-l border-gray-200"></div>

      <div className="flex-1">
        <Popover>
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
                  <span>Agrega fechas</span>
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
        <Popover>
          <PopoverTrigger asChild>
            <button className="w-full text-left px-6 py-3 hover:bg-gray-200 rounded-r-full">
              <p className="font-bold text-xs text-gray-800">Huéspedes</p>
              <p className="text-sm text-gray-500">{guestText}</p>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4 p-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Huéspedes</h4>
                <p className="text-sm text-muted-foreground">
                  Selecciona el número de huéspedes
                </p>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">Adultos</p>
                    <p className="text-sm text-gray-500">12 años o más</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full h-8 w-8"
                      onClick={() => handleGuestChange("adults", "decrement")}
                      disabled={guests.adults <= 1}
                    >
                      -
                    </Button>
                    <span>{guests.adults}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full h-8 w-8"
                      onClick={() => handleGuestChange("adults", "increment")}
                    >
                      +
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">Niños</p>
                    <p className="text-sm text-gray-500">2 a 12 años</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full h-8 w-8"
                      onClick={() => handleGuestChange("children", "decrement")}
                      disabled={guests.children <= 0}
                    >
                      -
                    </Button>
                    <span>{guests.children}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full h-8 w-8"
                      onClick={() => handleGuestChange("children", "increment")}
                    >
                      +
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">Infantes</p>
                    <p className="text-sm text-gray-500">0 a 2 años</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full h-8 w-8"
                      onClick={() => handleGuestChange("infants", "decrement")}
                      disabled={guests.infants <= 0}
                    >
                      -
                    </Button>
                    <span>{guests.infants}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full h-8 w-8"
                      onClick={() => handleGuestChange("infants", "increment")}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="p-2">
        <Button
          title="Buscar"
          className="bg-red-500 text-white rounded-full w-12 h-12 hover:bg-red-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
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
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;
