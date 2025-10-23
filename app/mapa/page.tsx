import React from 'react';
import InteractiveMap from '@/components/custom/InteractiveMap';

const MapPage = () => {
  return (
    <div className="w-full h-screen bg-gray-100 flex flex-col">
      <h1 className="text-3xl font-bold text-center py-4 flex-shrink-0">Mapa Interactivo</h1>
      <div className="flex-grow w-full h-full p-4">
        <InteractiveMap />
      </div>
    </div>
  );
};

export default MapPage;
