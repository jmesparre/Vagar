'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { PropertyCard } from './PropertyCard';
import { properties } from '@/lib/placeholder-data';
import { type Property } from '@/lib/types';
import parse, { domToReact, HTMLReactParserOptions, Element } from 'html-react-parser';

// Mapeo de IDs de polígonos a IDs de propiedades
const propertyNodeMap: { [key: string]: string } = {
  '_1_-_1-2': '1',
  '_1_-_3-4': '2',
  '_2_-_1-2-3': '3',
  '_2_-_4-5': '4',
  '_2_-_6-7': '5',
  '_2_-_8-9': '6',
  '_2_-_10-11': '7',
  '_2_-_12-13': '8',
  '_2_-_14-15': '9',
  '_2_-_16': '10',
  '_2_-_17': '11',
  '_3_-_1': '12',
  '_3_-_2-6': '13',
  '_3_-_3-7': '14',
  '_3_-_5': '15',
  '_3_-_4': '16',
  '_3_-_8': '17',
  '_4_-_1': '18',
  '_5_-_1': '19',
  '_31_-_5-6': '10',
};

const InteractiveMap = () => {
  const [svgContent, setSvgContent] = useState<string>('');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/svg-nodos.svg')
      .then((res) => res.text())
      .then((text) => {
        // Limpia los saltos de línea y espacios que rompen el parser
        const cleanedText = text.replace(/[\r\n\t]+/g, ' ').replace(/>\s+</g, '><');
        setSvgContent(cleanedText);
      });
  }, []);

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
  };

  const handleCloseCard = () => {
    setSelectedProperty(null);
  };

  const options: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (domNode instanceof Element && domNode.name === 'g' && domNode.attribs.id) {
        const polygon = domNode.children.find(
          (child) => child instanceof Element && child.name === 'polygon'
        ) as Element | undefined;

        if (polygon) {
          const propertyId = propertyNodeMap[domNode.attribs.id];
          const property = properties.find((p) => p.id === propertyId);

          if (property) {
            const { class: originalClassName, ...restPolygonAttribs } = polygon.attribs;

            let dynamicClasses = 'interactive-polygon';
            if (hoveredPropertyId === property.id) {
              dynamicClasses += ' hovered';
            }
            if (selectedProperty?.id === property.id) {
              dynamicClasses += ' selected';
            }

            return (
              <g
                {...domNode.attribs}
                onClick={() => handlePropertyClick(property)}
                onMouseEnter={() => setHoveredPropertyId(property.id)}
                onMouseLeave={() => setHoveredPropertyId(null)}
              >
                <polygon {...restPolygonAttribs} className={`${originalClassName || ''} ${dynamicClasses}`.trim()} />
              </g>
            );
          }
        }
      }
      // No es necesario devolver nada si no se reemplaza, 
      // html-react-parser continuará con el renderizado por defecto.
    },
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#C5D594]">
      <TransformWrapper
        initialScale={1.2}
        initialPositionX={-500}
        initialPositionY={-200}
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
              <div className="relative w-[6027px] bg-[#C5D594]">
                <Image
                  src="/mapa.png"
                  alt="Mapa de propiedades"
                  layout="fill"
                  objectFit="contain"
                  className="absolute top-0 left-0"
                  priority
                />
                <div className="absolute top-0 left-0 w-full h-full">
                  {svgContent && parse(svgContent, options)}
                </div>
              </div>
            </TransformComponent>
          </React.Fragment>
        )}
      </TransformWrapper>
      {selectedProperty && (
        <div className="absolute top-1/3 right-4 transform -translate-y-1/2 z-20 w-50">
          <div className="bg-white rounded-xl shadow-lg px-1 pt-1 pb-5 overflow-hidden">
            <button onClick={handleCloseCard} className="absolute top-2 right-2 bg-white rounded-full p-1 z-30 leading-none">
              &times;
            </button>
            <PropertyCard property={selectedProperty} disableLink={true} />
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveMap;
