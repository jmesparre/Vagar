"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Booking } from "@/lib/types";
import { DateRange } from "react-day-picker";

interface AvailabilityCalendarProps {
  bookings: Booking[];
  className?: string;
}

export function AvailabilityCalendar({ bookings, className }: AvailabilityCalendarProps) {
  const [month, setMonth] = React.useState<Date>(new Date());

  // Log para depuración de fechas en el frontend
  React.useEffect(() => {
    bookings.forEach(booking => {
      console.log(`[FRONTEND] Booking recibido: check_in_date=${booking.check_in_date}, check_out_date=${booking.check_out_date}`);
    });
  }, [bookings]);

  // Los rangos de fechas no disponibles.
  const disabledDays: DateRange[] = bookings.map(booking => {
    // Parseamos el string 'YYYY-MM-DD' manualmente para crear una fecha
    // en la zona horaria local del navegador, evitando desplazamientos.
    const fromParts = booking.check_in_date.split('-').map(Number);
    const toParts = booking.check_out_date.split('-').map(Number);
    
    const from = new Date(fromParts[0], fromParts[1] - 1, fromParts[2]);
    const to = new Date(toParts[0], toParts[1] - 1, toParts[2]);

    // Restamos un día al check_out_date porque el componente de calendario
    // trata el final del rango como inclusivo, y el check-out es el primer día disponible.
    to.setDate(to.getDate() - 1);

    return { from, to };
  });

  return (
    <div className={className}>
      <h2 className="text-2xl font-bold tracking-tight mb-4">Disponibilidad</h2>
      <div className="flex align-center justify-center">
        <Calendar
          mode="range"
          month={month}
          onMonthChange={setMonth}
          numberOfMonths={2}
          disabled={disabledDays} // Deshabilita la selección de los rangos
          modifiers={{ booked: disabledDays }} // Aplica un modificador para estilizar
          modifiersStyles={{ booked: { textDecoration: "line-through" } }} // Estilo de tachado
          className="p-0"
        />
      </div>
    </div>
  );
}
