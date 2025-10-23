'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { PropertyCard } from './PropertyCard'; // Asegúrate que la ruta es correcta
import { properties } from '@/lib/placeholder-data'; // Importamos los datos
import { type Property } from '@/lib/types';

// Tomamos la primera propiedad como ejemplo
const sampleProperty: Property | undefined = properties.find(p => p.id === '1');

const InteractiveMap = () => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
  };

  const handleCloseCard = () => {
    setSelectedProperty(null);
  };

  return (
    <div className="relative w-full h-full border-2 border-gray-300 overflow-hidden">
      <TransformWrapper
        initialScale={1}
        initialPositionX={0}
        initialPositionY={0}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <React.Fragment>
            <div className="absolute top-2 left-2 z-20 flex flex-col gap-2">
              <button onClick={() => zoomIn()} className="bg-white p-2 rounded-md shadow-md">+</button>
              <button onClick={() => zoomOut()} className="bg-white p-2 rounded-md shadow-md">-</button>
              <button onClick={() => resetTransform()} className="bg-white p-2 rounded-md shadow-md">Reset</button>
            </div>
            <TransformComponent
              wrapperStyle={{ width: '100%', height: '100%' }}
              contentStyle={{ width: '100%', height: '100%' }}
            >
              <div className="relative w-[1920px] h-[1080px]">
                <Image
                  src="/mapa.jpg"
                  alt="Mapa de propiedades"
                  layout="fill"
                  objectFit="contain"
                  className="absolute top-0 left-0"
                />
                <svg
                  className="absolute top-0 left-0 w-full h-full"
                  viewBox="0 0 1920 1080"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <filter id="drop-shadow" x="-50%" y="-50%" width="200%" height="200%">
                      <feDropShadow dx="0" dy="5" stdDeviation="10" floodColor="#000000" floodOpacity="0.5" />
                    </filter>
                  </defs>
                  <g id="interactive-layer">
                    {sampleProperty && (
                      <circle
                        id={`property-${sampleProperty.id}`}
                        cx="960" // Coordenada X de ejemplo
                        cy="540" // Coordenada Y de ejemplo
                        r="30"
                        fill={selectedProperty?.id === sampleProperty.id ? 'rgba(96, 165, 250, 0.8)' : 'rgba(255, 255, 255, 0.5)'}
                        stroke="white"
                        strokeWidth="3"
                        style={{
                          cursor: 'pointer',
                          transition: 'all 0.2s ease-in-out',
                          filter: hoveredPropertyId === sampleProperty.id ? 'url(#drop-shadow)' : 'none',
                          transform: hoveredPropertyId === sampleProperty.id ? 'scale(1.1)' : 'scale(1)',
                        }}
                        onClick={() => handlePropertyClick(sampleProperty)}
                        onMouseEnter={() => setHoveredPropertyId(sampleProperty.id)}
                        onMouseLeave={() => setHoveredPropertyId(null)}
                      />
                    )}
                  </g>
                </svg>
              </div>
            </TransformComponent>
          </React.Fragment>
        )}
      </TransformWrapper>
      {selectedProperty && (
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-20 w-80">
          <button onClick={handleCloseCard} className="absolute -top-2 -right-2 bg-white rounded-full p-1 z-30">
            &times;
          </button>
          <PropertyCard property={selectedProperty} />
        </div>
      )}
    </div>
  );
};

export default InteractiveMap;
