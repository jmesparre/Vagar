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
  // Para evitar problemas de zona horaria, creamos las fechas como UTC.
  const disabledDays: DateRange[] = bookings.map(booking => {
    // 1. Parsear las fechas de entrada, que vienen en formato ISO (UTC por defecto).
    const fromDate = new Date(booking.check_in_date);
    const toDate = new Date(booking.check_out_date);

    // 2. Compensar el desfase de la zona horaria del cliente.
    // getTimezoneOffset() devuelve la diferencia en minutos (ej. 180 para UTC-3).
    // Lo multiplicamos por 60000 para convertirlo a milisegundos.
    const fromUTCDate = new Date(fromDate.getTime() + fromDate.getTimezoneOffset() * 60000);
    const toUTCDate = new Date(toDate.getTime() + toDate.getTimezoneOffset() * 60000);

    // 3. Restamos un día al check_out_date porque el componente de calendario
    // trata el final del rango como inclusivo, y el check-out es el primer día disponible.
    toUTCDate.setDate(toUTCDate.getDate() - 1);

    return {
      from: fromUTCDate,
      to: toUTCDate,
    };
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
