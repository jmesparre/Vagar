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
  '_2_-_8-9': '1',
  '_5_-_14-15': '2',
  '_9_-_13-14': '3',
  '_9_-_11': '4',
  '_9_-_7': '5',
  '_9_-_22': '6',
  '_11_-_10': '7',
  '_11_-_7': '8',
  '_11_-_8': '9',
  '_11_-_21': '10',
  '_11_-_23-24': '11',
  '_12_-_10': '12',
  '_12_-_17': '13',
  '_12_-_18': '14',
  '_12_-_19': '15',
  '_7_-_6-7': '16',
  '_7_-_18-19': '17',
  '_7_-_20': '18',
  '_7_-_21': '19',
  '_16_-_12-13': '20',
  '_16_-_17': '21',
  '_17_-_1': '22',
  '_17_-_2': '23',
  '_17_-_3': '24',
  '_17_-_23': '25',
  '_17_-_10': '26',
  '_17_-_11-12': '27',
  '_18_-_11-12': '28',
  '_19_-_4-5': '29',
  '_31_-_4': '30',
  '_29_-_6-7': '31',
  '_24_-_1-2': '32',
  '_24_-_8-9': '33',
  '_22_-_5': '34',
  '_22_-_6': '35',
  '_22_-_15-16': '36',
  '_22_-_17': '37',
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
