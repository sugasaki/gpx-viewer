// src/hooks/useLoadGpxLayer.ts
import { useState, useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import { parseGpxContent } from '../utils/gpxUtils';
import { removeExistingLayer, addGpxLayerToMap, adjustMapBounds } from '../utils/mapHelpers';

const useLoadGpxLayer = (map: maplibregl.Map | null, gpxContent: string | null) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (gpxContent && map) {
      setLoading(true);

      // 非同期処理で UI の更新を許可
      setTimeout(() => {
        try {
          const geojson = parseGpxContent(gpxContent);
          removeExistingLayer(map, 'route');
          addGpxLayerToMap(map, geojson);
          adjustMapBounds(map, geojson);
        } catch (error) {
          console.error('GPX読み込みエラー:', error);
        } finally {
          setLoading(false);
        }
        setLoading(false);
      }, 100);
    }
  }, [gpxContent, map]);

  return { loading };
};

export default useLoadGpxLayer;
