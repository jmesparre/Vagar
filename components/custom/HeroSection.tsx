import React from 'react';
import SearchBar from './SearchBar';

const HeroSection = () => {
  return (
    <section className="relative h-screen flex flex-col justify-center items-center text-white p-4">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        className="absolute z-0 w-full h-full object-cover"
      >
        {/* El video debe estar en la carpeta /public. Usando un placeholder por ahora. */}
        <source src="https://videos.pexels.com/video-files/3209828/3209828-hd_1920_1080_25fps.mp4" type="video/mp4" />
        Tu navegador no soporta la etiqueta de video.
      </video>

      {/* Overlay */}
      <div className="absolute z-10 w-full h-full bg-black opacity-50"></div>

      {/* Content Wrapper */}
      <div className="z-20 flex flex-col items-center justify-between h-full w-full pt-24 pb-12">
        {/* Spacer to push SearchBar to the middle */}
        <div className="flex-grow"></div>

        {/* SearchBar in the middle */}
        <div className="w-full flex justify-center">
          <SearchBar />
        </div>

        {/* Title at the bottom */}
        <div className="flex-grow text-center flex flex-col justify-end">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-4">
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
