"use client";

import { useState } from "react";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { GuestsPopoverContent } from "@/components/custom/GuestsPopoverContent";
import { DatePickerPopoverContent } from "@/components/custom/DatePickerPopoverContent";
import { H2 } from "@/components/ui/typography";
import { BookingDialog } from "@/components/custom/BookingDialog";
import { Property } from "@/lib/types";

interface BookingCardProps {
  chalet: Property;
}

export function BookingCard({ chalet }: BookingCardProps) {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });

  const [guests, setGuests] = useState({
    adults: 1,
    children: 0,
    infants: 0,
  });

  const handleGuestChange = (
    type: keyof typeof guests,
    operation: "increment" | "decrement"
  ) => {
    setGuests((prev) => {
      const newCount =
        operation === "increment" ? prev[type] + 1 : prev[type] - 1;
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
      : "Seleccione huéspedes";

  return (
    <div className="sticky top-6 rounded-xl border px-6 pt-6 pb-8 shadow-lg">
      <H2 className="mb-1">Precio</H2>
      <div className="space-y-2 text-sm text-muted-foreground mb-6">
        <div className="flex justify-between">
          <span>Temporada alta</span>
          <span className="font-semibold text-foreground">
            ${chalet.price_high?.toLocaleString('es-AR')}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Temporada media</span>
          <span className="font-semibold text-foreground">
            ${chalet.price_mid?.toLocaleString('es-AR')}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Temporada Baja</span>
          <span className="font-semibold text-foreground">
            ${chalet.price_low?.toLocaleString('es-AR')}
          </span>
        </div>
      </div>
      <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
        <PopoverTrigger asChild>
          <div className="grid grid-cols-2 rounded-t-lg border cursor-pointer">
            <div className="p-2">
              <div className="text-xs font-bold uppercase">CHECK-IN</div>
              <div className="text-xs">
                {date?.from ? format(date.from, "MM/dd/yyyy") : "Add date"}
              </div>
            </div>
            <div className="border-l p-2">
              <div className="text-xs font-bold uppercase">CHECKOUT</div>
              <div className="text-xs">
                {date?.to ? format(date.to, "MM/dd/yyyy") : "Add date"}
              </div>
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="center">
          <DatePickerPopoverContent
            date={date}
            setDate={setDate}
            onClose={() => setIsDatePickerOpen(false)}
          />
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <div className="rounded-b-lg border border-t-0 p-2 cursor-pointer">
            <div className="text-xs font-bold uppercase">HUESPEDES</div>
            <div className="flex items-center justify-between text-xs">
              <span>{guestText}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <GuestsPopoverContent
            guests={guests}
            handleGuestChange={handleGuestChange}
          />
        </PopoverContent>
      </Popover>
      <BookingDialog
        chalet={chalet}
        selectedDates={date}
        guestCount={guests}
      />
    </div>
  );
}
