import React, { createContext, useContext, useState } from 'react';
import maplibregl from 'maplibre-gl';

interface MarkerContextValue {
  map: maplibregl.Map | null;
  setMap: (map: maplibregl.Map | null) => void;
  lat: number | null;
  lon: number | null;
  setLatLon: (lat: number | null, lon: number | null) => void;
}

const MarkerContext = createContext<MarkerContextValue | undefined>(undefined);

export function useMarkerContext() {
  const context = useContext(MarkerContext);
  if (!context) {
    throw new Error('useMarkerContext must be used within a MarkerProvider');
  }
  return context;
}

interface MarkerProviderProps {
  children: React.ReactNode;
}

export function MarkerProvider({ children }: MarkerProviderProps) {
  const [map, setMap] = useState<maplibregl.Map | null>(null);
  const [lat, setLat] = useState<number | null>(null);
  const [lon, setLon] = useState<number | null>(null);

  function setLatLon(newLat: number | null, newLon: number | null) {
    // console.log('newLat', newLat);
    // console.log('newLon', newLon);
    setLat(newLat);
    setLon(newLon);
  }

  return <MarkerContext.Provider value={{ map, setMap, lat, lon, setLatLon }}>{children}</MarkerContext.Provider>;
}
