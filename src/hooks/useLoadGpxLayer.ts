import { useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import { parseGpxContent } from '../utils/gpxUtils';
import { removeExistingLayer, addGpxLayerToMap, adjustMapBounds } from '../utils/mapHelpers';

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
