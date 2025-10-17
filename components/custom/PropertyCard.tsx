import Image from "next/image";
import { Item, ItemContent, ItemMedia, ItemTitle } from "../ui/item";
import { BedDouble, Home, Star, Users } from "lucide-react";
import { Property } from "@/lib/types";

export function PropertyCard({ property }: { property: Property }) {
  return (
    <div className="flex flex-col h-full w-full">
      <Item className="border-none shadow-none p-0 flex flex-col flex-grow items-start">
        <ItemMedia className="relative rounded-xl overflow-hidden w-full">
          <Image
            src={property.image}
            alt={property.title}
            width={800}
            height={800}
            className="object-cover aspect-[1/1] w-full h-auto transition-transform duration-300 ease-in-out hover:scale-105"
          />
        </ItemMedia>
        <ItemContent className="mt-3 px-1 flex flex-col flex-grow">
          <ItemTitle className="font-bold text-lg truncate">{property.title}</ItemTitle>
          <div className="flex-grow" />
          <div className="flex items-center justify-between mt-1">
            <div className="text-sm text-muted-foreground flex items-center gap-x-4 gap-y-1 flex-wrap">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                {property.guests}
              </span>
              <span className="flex items-center gap-1.5">
                <Home className="w-4 h-4" />
                {property.bedrooms}
              </span>
              <span className="flex items-center gap-1.5">
                <BedDouble className="w-4 h-4" />
                {property.beds}
              </span>
            </div>
            <div className="flex items-center gap-1 pr-1 pl-3 shrink-0">
              <Star className="w-4 h-4 fill-primary text-primary" />
              <span className="font-semibold text-sm">{property.rating.toFixed(2)}</span>
            </div>
          </div>
        </ItemContent>
      </Item>
    </div>
  );
}
