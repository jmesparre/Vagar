"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Home } from "lucide-react"; // Usando un ícono genérico como placeholder

const AmenityButton = ({ text }: { text: string }) => (
  <Button
    variant="outline"
    className="flex items-center gap-2 h-8 rounded-md px-2 text-xs"
  >
    <Home className="h-4 w-4" />
    {text}
  </Button>
);

export function AmenitiesPopoverContent() {
  return (
    <div className="p-4 w-96">
      <ScrollArea className="h-72 w-full">
        <div className="pr-4">
          <div className="mb-3">
            <h4 className="font-semibold mb-3">Populares</h4>
            <div className="flex flex-wrap gap-2">
              <AmenityButton text="Casa sobre barranco" />
              <AmenityButton text="Climatizador de piscina externa" />
              <AmenityButton text="wifi" />
              <AmenityButton text="Sala de Juegos" />
              <AmenityButton text="Servicio 3" />
            </div>
          </div>

          <div className="mb-3">
            <h4 className="font-semibold mb-3">Esenciales</h4>
            <div className="flex flex-wrap gap-2">
              <AmenityButton text="Casa sobre barranco" />
              <AmenityButton text="Climatizador de piscina externa" />
              <AmenityButton text="wifi" />
              <AmenityButton text="Sala de Juegos" />
              <AmenityButton text="Servicio 3" />
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Premium</h4>
            <div className="flex flex-wrap gap-2">
              <AmenityButton text="Casa sobre barranco" />
              <AmenityButton text="Climatizador de piscina externa" />
              <AmenityButton text="wifi" />
              <AmenityButton text="Sala de Juegos" />
              <AmenityButton text="Servicio 3" />
            </div>
          </div>
        </div>
      </ScrollArea>
      
      <div className="flex justify-end mt-3">
        <Button>Mostrar 36 casas</Button>
      </div>
    </div>
  );
}
