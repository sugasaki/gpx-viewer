// src/utils/trackUtils.ts
export interface TrackPoint {
  distance: number; // 累積距離（メートル）
  elevation: number; // 標高（メートル）
  lat: number;
  lon: number;
}

/**
 * 2点間の線形補間を行う
 * @param start 開始点
 * @param end 終了点
 * @param distance 求めたい距離
 */
export function interpolatePoint(start: TrackPoint, end: TrackPoint, distance: number): TrackPoint {
  const segmentLength = end.distance - start.distance;
  const ratio = (distance - start.distance) / segmentLength;

  return {
    distance: distance,
    elevation: start.elevation + (end.elevation - start.elevation) * ratio,
    lat: start.lat + (end.lat - start.lat) * ratio,
    lon: start.lon + (end.lon - start.lon) * ratio,
  };
}

/**
 * 指定した距離 (distanceM) の位置にある TrackPoint を返す
 * 2点間の線形補間を使用して正確な位置を計算
 * @param distanceM 距離（メートル）
 * @param trackPoints TrackPoint配列（distance順にソートされていること）
 */
export function findNearestTrackPoint(distanceM: number, trackPoints: TrackPoint[]): TrackPoint | null {
  if (trackPoints.length === 0) return null;
  if (trackPoints.length === 1) return trackPoints[0];

  // 範囲外チェック
  if (distanceM <= trackPoints[0].distance) return trackPoints[0];
  if (distanceM >= trackPoints[trackPoints.length - 1].distance) return trackPoints[trackPoints.length - 1];

  // 二分探索で適切なセグメントを見つける
  let left = 0;
  let right = trackPoints.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const midPoint = trackPoints[mid];

    if (midPoint.distance === distanceM) {
      return midPoint;
    }

    if (mid > 0) {
      const prevPoint = trackPoints[mid - 1];
      // 現在のポイントと前のポイントの間に目標距離がある場合
      if (prevPoint.distance <= distanceM && distanceM <= midPoint.distance) {
        // 2点間を補間して新しい点を生成
        return interpolatePoint(prevPoint, midPoint, distanceM);
      }
    }

    if (mid < trackPoints.length - 1) {
      const nextPoint = trackPoints[mid + 1];
      // 現在のポイントと次のポイントの間に目標距離がある場合
      if (midPoint.distance <= distanceM && distanceM <= nextPoint.distance) {
        // 2点間を補間して新しい点を生成
        return interpolatePoint(midPoint, nextPoint, distanceM);
      }
    }

    if (midPoint.distance < distanceM) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  // 最も近いセグメントを見つけて補間
  const index = Math.min(left, trackPoints.length - 2);
  return interpolatePoint(trackPoints[index], trackPoints[index + 1], distanceM);
}
