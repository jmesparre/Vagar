'use client';

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Property } from '@/lib/types';
import { properties as allProperties } from '@/lib/placeholder-data';
import { PropertyCard } from './PropertyCard';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ChaletGrid = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [sortedProperties, setSortedProperties] = useState<Property[]>([]);
  const [sortOrder, setSortOrder] = useState('rating-desc'); // Default sort
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const itemsPerPage = 9;

  // Effect to sort properties when sortOrder changes
  useEffect(() => {
    const newSortedProperties = [...allProperties].sort((a, b) => {
      switch (sortOrder) {
        case 'rating-desc':
          return b.rating - a.rating;
        case 'rating-asc':
          return a.rating - b.rating;
        case 'price-desc':
          return b.price - a.price;
        case 'price-asc':
          return a.price - b.price;
        default:
          return 0;
      }
    });
    setSortedProperties(newSortedProperties);
  }, [sortOrder]);

  // Effect for initial load and when sorted properties are updated
  useEffect(() => {
    if (sortedProperties.length > 0) {
      setIsLoading(true);
      // Simulate loading to show skeleton when sorting changes
      setTimeout(() => {
        setProperties(sortedProperties.slice(0, itemsPerPage));
        setIsLoading(false);
        setHasMore(sortedProperties.length > itemsPerPage);
      }, 500);
    }
  }, [sortedProperties]);

  const fetchMoreData = () => {
    if (properties.length >= sortedProperties.length) {
      setHasMore(false);
      return;
    }

    // Simula una llamada a la API para cargar más propiedades
    setTimeout(() => {
      const newProperties = sortedProperties.slice(
        properties.length,
        properties.length + itemsPerPage
      );
      setProperties((prevProperties) => [...prevProperties, ...newProperties]);
    }, 1000);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          fetchMoreData();
        }
      },
      { threshold: 1.0 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasMore, isLoading, properties.length]);

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Select onValueChange={setSortOrder} defaultValue={sortOrder}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Ordenar por:" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating-desc">Mayor Calificacion</SelectItem>
            <SelectItem value="rating-asc">Menor Calificacion</SelectItem>
            <SelectItem value="price-desc">Mayor Precio</SelectItem>
            <SelectItem value="price-asc">Menor Precio</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: itemsPerPage }).map((_, index) => (
            <div key={index} className="flex flex-col space-y-3">
              <Skeleton className="w-full rounded-xl aspect-[1/1]" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          <div ref={loadMoreRef} className="flex justify-center items-center py-8">
            {hasMore && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex flex-col space-y-3">
                    <Skeleton className="w-full rounded-xl aspect-[1/1]" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ChaletGrid;
