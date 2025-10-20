"use client";

import { useState } from 'react';
import { Property } from '@/lib/types';
import { allAmenities } from '@/lib/amenities-data';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

interface ComparisonTableProps {
  mainChalet: Property;
  comparisonChalet: Property;
}

export function ComparisonTable({ mainChalet, comparisonChalet }: ComparisonTableProps) {
  const [showAll, setShowAll] = useState(false);

  const characteristics = [
    { name: 'Precio Temporada Baja', getValue: (chalet: Property) => `$${chalet.price.low.toLocaleString('es-AR')}` },
    { name: 'Precio Temporada Media', getValue: (chalet: Property) => `$${chalet.price.mid.toLocaleString('es-AR')}` },
    { name: 'Precio Temporada Alta', getValue: (chalet: Property) => `$${chalet.price.high.toLocaleString('es-AR')}` },
    { name: 'Huéspedes', getValue: (chalet: Property) => chalet.guests },
    { name: 'Dormitorios', getValue: (chalet: Property) => chalet.bedrooms },
    { name: 'Camas', getValue: (chalet: Property) => chalet.beds },
  ];

  const combinedAmenities = [...characteristics, ...allAmenities.map(amenity => ({
    name: amenity.name,
    isAmenity: true,
    amenityId: amenity.id,
  }))];

  const visibleAmenities = showAll ? combinedAmenities : combinedAmenities.slice(0, 10);

  const renderValue = (chalet: Property, amenity: any) => {
    if (amenity.isAmenity) {
      const hasAmenity = chalet.amenities.includes(amenity.amenityId);
      return hasAmenity ? 
        <Check className="mx-auto h-5 w-5 text-green-500" /> : 
        <X className="mx-auto h-5 w-5 text-red-500" />;
    }
    return amenity.getValue(chalet);
  };

  return (
    <div className="mt-6">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse text-left">
          <thead>
            <tr>
              <th className="border-b p-2">Característica</th>
              <th className="border-b p-2 text-center font-bold">{mainChalet.title}</th>
              <th className="border-b p-2 text-center">{comparisonChalet.title}</th>
            </tr>
          </thead>
          <tbody>
            {visibleAmenities.map((amenity, index) => (
              <tr key={index}>
                <td className="border-b p-2">{amenity.name}</td>
                <td className="border-b p-2 text-center font-bold">
                  {renderValue(mainChalet, amenity)}
                </td>
                <td className="border-b p-2 text-center">
                  {renderValue(comparisonChalet, amenity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!showAll && combinedAmenities.length > 10 && (
        <div className="mt-4 text-center">
          <Button variant="outline" onClick={() => setShowAll(true)}>
            Mostrar todos
          </Button>
        </div>
      )}
    </div>
  );
}
