'use client';
import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import { SearchBarSkeleton } from './SearchBarSkeleton';

const HeroSection = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500); // Simular carga
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative h-screen flex flex-col justify-center items-center text-white p-4">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        className="absolute z-0 w-full h-full object-cover"
      >
        <source src="https://www.pexels.com/download/video/34219110/" type="video/mp4" />
        Tu navegador no soporta la etiqueta de video.
      </video>

      {/* Overlay */}
      <div className="absolute z-10 w-full h-full bg-black opacity-50"></div>

      {/* Content Wrapper */}
      <div className="z-20 flex flex-col items-center justify-between h-full w-full pt-8 pb-12">
       
        {/* SearchBar in the middle */}
        <div className="w-full flex justify-center">
          {isLoading ? <SearchBarSkeleton /> : <SearchBar />}
        </div>

        {/* Title at the bottom */}
        <div className="flex-grow text-center flex flex-col">
          <h1 className="text-5xl mt-22 md:text-7xl font-bold leading-tight mb-4">
            Encuentra tu Próximo Destino
          </h1>
          <p className="text-lg md:text-xl">
            Explora propiedades exclusivas para unas vacaciones inolvidables.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
