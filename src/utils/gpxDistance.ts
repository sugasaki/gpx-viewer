// src/utils/gpxDistance.ts
import { parseGpxContent, computeRouteDistance } from './gpxUtils';

/**
 * GPX文字列から GeoJSON へ変換し、そのルート距離（メートル）を計算して返す関数
 * @param gpxContent GPX形式の文字列
 * @returns ルート距離（メートル）
 */
export function getDistanceFromGpx(gpxContent: string): number {
  const geojson = parseGpxContent(gpxContent);
  return computeRouteDistance(geojson);
}
