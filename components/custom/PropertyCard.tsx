import Image from "next/image";
import Link from "next/link";
import { Item, ItemContent, ItemMedia } from "../ui/item";
import { BedDouble, Home, Star, Users } from "lucide-react";
import { Property } from "@/lib/types";
import { H4, Muted, Small } from "@/components/ui/typography";

export function PropertyCard({ property }: { property: Property }) {
  return (
    <Link href={`/chalets/${property.id}`} className="flex flex-col h-full w-full">
      <Item className="border-none shadow-none p-0 flex flex-col flex-grow items-start">
        <ItemMedia className="relative rounded-xl overflow-hidden w-full aspect-square">
          <Image
            src={property.images[0]}
            alt={property.title}
            layout="fill"
            objectFit="cover"
            className="rounded-t-lg"
          />
        </ItemMedia>
        <ItemContent className="px-1 pt-0 -mt-2 flex flex-col flex-grow">
          <H4 className="text-lg truncate">{property.title}</H4>
          <div className="flex items-center justify-between pt-0">
            <Muted className="flex items-center gap-x-4 gap-y-1 flex-wrap">
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
            </Muted>
            <div className="flex items-center gap-1 pr-1 pl-3 shrink-0">
              <Star className="w-4 h-4 fill-primary text-primary" />
              <Small className="font-semibold">{property.rating.toFixed(2)}</Small>
            </div>
          </div>
        </ItemContent>
      </Item>
    </Link>
  );
}
