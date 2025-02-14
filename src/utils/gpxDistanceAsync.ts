// src/utils/gpxDistanceAsync.ts
import { computeRouteDistance, parseGpxContent } from './gpxUtils';

/**
 * 非同期に GPX 文字列から距離（メートル）を計算する関数
 * @param gpxContent GPX 形式の文字列
 * @returns 距離（メートル）を解決する Promise
 */
export async function getDistanceFromGpxAsync(gpxContent: string): Promise<number> {
  return new Promise<number>((resolve, reject) => {
    // 10ms の遅延を与えて非同期処理として実行する
    setTimeout(() => {
      try {
        const geojson = parseGpxContent(gpxContent);
        const distance = computeRouteDistance(geojson);
        resolve(distance);
      } catch (error) {
        reject(error);
      }
    }, 10);
  });
}
