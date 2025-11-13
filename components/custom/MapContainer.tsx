'use client';

import React, { useState } from 'react';
import InteractiveMap from '@/components/custom/InteractiveMap';
import { MapSearchBar } from '@/components/custom/MapSearchBar';
import { Property } from '@/lib/types';

interface MapContainerProps {
  properties: Property[];
}

const MapContainer = ({ properties }: MapContainerProps) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const handleSearchResultSelect = (nodeId: string) => {
    setSelectedNodeId(nodeId);
  };

  return (
    <div className="relative w-full h-screen">
      <div className="absolute top-4 right-4 z-10">
        <MapSearchBar onSearchResultSelect={handleSearchResultSelect} />
      </div>
      <InteractiveMap properties={properties} selectedNodeId={selectedNodeId} />
    </div>
  );
};

export default MapContainer;
