import * as toGeoJSON from '@mapbox/togeojson';

/** GPXの文字列を解析し、GeoJSONに変換する */
export function parseGpxContent(gpxContent: string): any {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(gpxContent, 'application/xml');
  return toGeoJSON.gpx(xmlDoc);
}

/** ハーバサイン法による2点間距離計算（単位：メートル） */
export function haversineDistance(coord1: [number, number], coord2: [number, number]): number {
  const R = 6371e3; // 地球の半径（メートル）
  const toRad = (deg: number) => deg * (Math.PI / 180);
  const lat1 = toRad(coord1[1]);
  const lat2 = toRad(coord2[1]);
  const deltaLat = toRad(coord2[1] - coord1[1]);
  const deltaLon = toRad(coord2[0] - coord1[0]);
  const a = Math.sin(deltaLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/** ルートの距離（メートル）を計算する */
export function computeRouteDistance(geojson: any): number {
  if (!geojson.features || geojson.features.length === 0) return 0;
  const coords = geojson.features[0].geometry.coordinates;
  if (!coords || coords.length === 0) return 0;

  let totalDistance = 0;
  for (let i = 1; i < coords.length; i++) {
    totalDistance += haversineDistance(coords[i - 1], coords[i]);
  }
  return totalDistance;
}
