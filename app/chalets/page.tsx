'use client';
import React, { useState, useEffect } from 'react';
import SearchBar from '@/components/custom/SearchBar';
import { SearchBarSkeleton } from '@/components/custom/SearchBarSkeleton';
import ChaletGrid from '@/components/custom/ChaletGrid';
import { Separator } from '@/components/ui/separator';

const ChaletsPage = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500); // Simular carga
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="mx-auto px-8 py-8">
      <div className="mb-8 pt-4 w-full flex justify-center">
        {isLoading ? <SearchBarSkeleton /> : <SearchBar />}
      </div>
      <Separator className="mb-10 mt-16" />
      <ChaletGrid />
    </div>
  );
};

export default ChaletsPage;
