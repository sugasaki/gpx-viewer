// src/hooks/useTrackPoints.ts
import { useEffect, useState } from 'react';
import { parseGpxContent } from '../utils/gpxUtils';

export interface TrackPoint {
  distance: number; // 累積距離 (m)
  elevation: number; // 標高 (m)
  lat: number;
  lon: number;
}

/**
 * GPX文字列を解析して、トラックポイント配列を返すカスタムフック
 */
export function useTrackPoints(gpxContent: string | null): TrackPoint[] {
  const [trackPoints, setTrackPoints] = useState<TrackPoint[]>([]);

  useEffect(() => {
    if (!gpxContent) {
      setTrackPoints([]);
      return;
    }

    // 非同期で少し遅延を入れて処理 (UI 更新を許可)
    setTimeout(() => {
      try {
        const geojson = parseGpxContent(gpxContent);
        if (!geojson.features || geojson.features.length === 0) {
          setTrackPoints([]);
          return;
        }

        const coords = geojson.features[0].geometry.coordinates; // [lon, lat, ele?]
        const R = 6371e3; // 地球半径 (m)
        const toRad = (deg: number) => deg * (Math.PI / 180);

        let totalDistance = 0;
        const tempPoints: TrackPoint[] = [];

        for (let i = 0; i < coords.length; i++) {
          const [lon, lat, ele] = coords[i];
          if (i > 0) {
            // 前の座標との距離をハーバサイン法で計算
            const [prevLon, prevLat] = coords[i - 1];
            const dLat = toRad(lat - prevLat);
            const dLon = toRad(lon - prevLon);
            const a =
              Math.sin(dLat / 2) ** 2 + Math.cos(toRad(prevLat)) * Math.cos(toRad(lat)) * Math.sin(dLon / 2) ** 2;
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const dist = R * c;
            totalDistance += dist;
          }
          tempPoints.push({
            lat,
            lon,
            elevation: ele || 0,
            distance: totalDistance,
          });
        }
        setTrackPoints(tempPoints);
      } catch (error) {
        console.error('TrackPoint 解析エラー:', error);
        setTrackPoints([]);
      }
    }, 100);
  }, [gpxContent]);

  return trackPoints;
}
