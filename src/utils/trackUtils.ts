// src/utils/trackUtils.ts
export interface TrackPoint {
  distance: number; // 累積距離（メートル）
  elevation: number; // 標高（メートル）
  lat: number;
  lon: number;
}

/**
 * データポイントを間引く
 * @param trackPoints 元のトラックポイント配列
 * @param targetPoints 目標とするポイント数
 * @returns 間引かれたトラックポイント配列
 */
export function reduceTrackPoints(trackPoints: TrackPoint[], targetPoints: number): TrackPoint[] {
  if (trackPoints.length <= targetPoints) return trackPoints;

  const step = Math.max(1, Math.floor(trackPoints.length / targetPoints));
  const reduced: TrackPoint[] = [];

  // 最初と最後のポイントは必ず含める
  reduced.push(trackPoints[0]);

  // 間のポイントを間引く
  for (let i = step; i < trackPoints.length - 1; i += step) {
    reduced.push(trackPoints[i]);
  }

  reduced.push(trackPoints[trackPoints.length - 1]);
  return reduced;
}

/**
 * バイナリサーチで指定した距離に最も近いTrackPointのインデックスを返す
 * @param distanceM 距離（メートル）
 * @param trackPoints ソート済みのTrackPoint配列
 * @returns 最も近いTrackPointのインデックス
 */
function binarySearchNearestIndex(distanceM: number, trackPoints: TrackPoint[]): number {
  let left = 0;
  let right = trackPoints.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const midDistance = trackPoints[mid].distance;

    if (midDistance === distanceM) {
      return mid;
    }

    if (midDistance < distanceM) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  // 最も近い点を返す
  if (left >= trackPoints.length) return trackPoints.length - 1;
  if (right < 0) return 0;

  const leftDiff = Math.abs(trackPoints[left].distance - distanceM);
  const rightDiff = Math.abs(trackPoints[right].distance - distanceM);

  return leftDiff < rightDiff ? left : right;
}

/**
 * 指定した距離 (distanceM) に最も近い TrackPoint を返す
 * @param distanceM 距離（メートル）
 * @param trackPoints TrackPoint配列
 */
export function findNearestTrackPoint(distanceM: number, trackPoints: TrackPoint[]): TrackPoint | null {
  if (trackPoints.length === 0) return null;

  const index = binarySearchNearestIndex(distanceM, trackPoints);
  return trackPoints[index];
}
