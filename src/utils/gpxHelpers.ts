// src/utils/gpxHelpers.ts
import * as toGeoJSON from '@mapbox/togeojson';
import maplibregl from 'maplibre-gl';

/** GPXの文字列を解析し、GeoJSONに変換する */
export function parseGpxContent(gpxContent: string): any {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(gpxContent, 'application/xml');
  return toGeoJSON.gpx(xmlDoc);
}

/** 既存の指定レイヤー（ここでは'route'）があれば削除する */
export function removeExistingLayer(map: maplibregl.Map, layerId: string) {
  if (map.getLayer(layerId)) {
    map.removeLayer(layerId);
  }
  if (map.getSource(layerId)) {
    map.removeSource(layerId);
  }
}

/** GPXから変換したGeoJSONを使って、ソースとレイヤーをマップに追加する */
export function addGpxLayerToMap(map: maplibregl.Map, geojson: any) {
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
}

/** GeoJSONのルートに合わせて、マップの表示範囲を調整する */
export function adjustMapBounds(map: maplibregl.Map, geojson: any) {
  if (geojson.features.length === 0) return;

  const coords = geojson.features[0].geometry.coordinates;
  if (!coords || coords.length === 0) return;

  const bounds = coords.reduce(
    (b: maplibregl.LngLatBounds, coord: [number, number]) => b.extend(coord),
    new maplibregl.LngLatBounds(coords[0], coords[0])
  );
  map.fitBounds(bounds, { padding: 20 });
}
