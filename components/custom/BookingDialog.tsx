"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog-custom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Property } from "@/lib/types";
import { P, Small } from "@/components/ui/typography";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

interface BookingDialogProps {
  chalet: Property;
  selectedDates: DateRange | undefined;
  guestCount: { adults: number; children: number; infants: number };
}

export function BookingDialog({
  chalet,
  selectedDates,
  guestCount,
}: BookingDialogProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSend = () => {
    const formattedDates = selectedDates?.from
      ? selectedDates.to
        ? `${format(selectedDates.from, "dd/MM/yyyy")} - ${format(
            selectedDates.to,
            "dd/MM/yyyy"
          )}`
        : format(selectedDates.from, "dd/MM/yyyy")
      : "Fechas no seleccionadas";

    const message = `
¡Hola! Quisiera solicitar una reserva para el chalet *${chalet.title}*.
*Fechas:* ${formattedDates}
*Huéspedes:* ${guestCount.adults} Adultos, ${guestCount.children} Niños, ${
      guestCount.infants
    } Infantes
*Mi nombre es:* ${name}
*Mi teléfono es:* ${phone}
    `.trim();

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full mt-4">Reservar</Button>
      </DialogTrigger>
      <DialogContent
        overlayClassName="bg-black/80"
        className="sm:max-w-[425px]"
      >
        <DialogHeader>
          <DialogTitle>Solicitar Reserva</DialogTitle>
          <DialogDescription className="sr-only">
            Este formulario se enviará a través de WhatsApp para completar la
            reserva.
          </DialogDescription>
        </DialogHeader>
        <div className=" space-y-4">
          <div className="flex items-center space-x-4">
            <div className="relative w-24 h-24 rounded-lg overflow-hidden">
              <Image
                src={chalet.images[0]}
                alt={chalet.title}
                fill
                className="object-cover"
              />
            </div>
            <P className="font-semibold">{chalet.title}</P>
          </div>
          <Separator />
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <P className="font-semibold !mt-0">Fechas:</P>
              <P className="text-right !mt-0">
                {selectedDates?.from ? (
                  selectedDates.to ? (
                    `${format(selectedDates.from, "d MMM")} - ${format(
                      selectedDates.to,
                      "d MMM"
                    )}`
                  ) : (
                    format(selectedDates.from, "d MMM")
                  )
                ) : (
                  "Seleccione fechas"
                )}
              </P>
            </div>
            <div className="flex items-center justify-between">
              <P className="font-semibold !mt-0">Personas:</P>
              <P className="text-right !mt-0">
                {guestCount.adults} Adultos
                {guestCount.children > 0 && `, ${guestCount.children} Niños`}
              </P>
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <label htmlFor="name">
              <Small>Nombre</Small>
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre completo"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="phone">
              <Small>Teléfono</Small>
            </label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Tu número de teléfono"
            />
          </div>
          <Small className="text-center block text-gray-500">
            El formulario se enviará a través de WhatsApp para completar la
            reserva.
          </Small>
        </div>
        <Button onClick={handleSend} className="w-full">
          Enviar
        </Button>
      </DialogContent>
    </Dialog>
  );
}
