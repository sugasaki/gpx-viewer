// src/utils/trackUtils.ts
export interface TrackPoint {
  distance: number; // 累積距離（メートル）
  elevation: number; // 標高（メートル）
  lat: number;
  lon: number;
}

/**
 * 指定した距離 (distanceM) に最も近い TrackPoint を返す
 * @param distanceM 距離（メートル）
 * @param trackPoints TrackPoint配列
 */
export function findNearestTrackPoint(distanceM: number, trackPoints: TrackPoint[]): TrackPoint | null {
  if (trackPoints.length === 0) return null;

  let nearest = trackPoints[0];
  let minDiff = Math.abs(nearest.distance - distanceM);

  for (let i = 1; i < trackPoints.length; i++) {
    const diff = Math.abs(trackPoints[i].distance - distanceM);
    if (diff < minDiff) {
      minDiff = diff;
      nearest = trackPoints[i];
    }
  }
  return nearest;
}
