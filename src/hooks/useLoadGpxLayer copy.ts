import { useEffect } from 'react';
import * as toGeoJSON from '@mapbox/togeojson';
import maplibregl from 'maplibre-gl';

const useLoadGpxLayer = (map: maplibregl.Map | null, gpxUrl: string) => {
  useEffect(() => {
    if (!map) return;

    const loadGpx = async () => {
      try {
        const response = await fetch(gpxUrl);
        const gpxText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(gpxText, 'application/xml');
        const geojson = toGeoJSON.gpx(xmlDoc);

        // 既に 'route' ソースが存在しなければ追加
        if (!map.getSource('route')) {
          map.addSource('route', {
            type: 'geojson',
            data: geojson,
          });
          map.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            paint: {
              'line-color': '#ff0000',
              'line-width': 4,
            },
          });

          // GPX のルートに合わせて地図の表示範囲を調整
          if (geojson.features.length > 0) {
            const coords = geojson.features[0].geometry.coordinates;
            if (coords && coords.length > 0) {
              const bounds = coords.reduce(
                (b: maplibregl.LngLatBounds, coord: [number, number]) => b.extend(coord),
                new maplibregl.LngLatBounds(coords[0], coords[0])
              );
              map.fitBounds(bounds, { padding: 20 });
            }
          }
        }
      } catch (error) {
        console.error('GPXファイル読み込みエラー:', error);
      }
    };

    loadGpx();
  }, [map, gpxUrl]);
};

export default useLoadGpxLayer;
