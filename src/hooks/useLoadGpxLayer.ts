// src/hooks/useLoadGpxLayer.ts
import { useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import { parseGpxContent, removeExistingLayer, addGpxLayerToMap, adjustMapBounds } from '../utils/gpxHelpers';

const useLoadGpxLayer = (map: maplibregl.Map | null, gpxContent: string | null) => {
  useEffect(() => {
    if (!map || !gpxContent) return;

    try {
      const geojson = parseGpxContent(gpxContent);
      removeExistingLayer(map, 'route');
      addGpxLayerToMap(map, geojson);
      adjustMapBounds(map, geojson);
    } catch (error) {
      console.error('GPX読み込みエラー:', error);
    }
  }, [map, gpxContent]);
};

export default useLoadGpxLayer;
