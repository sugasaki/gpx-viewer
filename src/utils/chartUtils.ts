import { TrackPoint } from './trackUtils';

/**
 * トラックポイントを間引くための関数
 * @param points 元のトラックポイント配列
 * @param targetPoints 目標とするポイント数
 * @returns 間引き後のトラックポイント配列
 */
export function reduceTrackPoints(points: TrackPoint[], targetPoints: number): TrackPoint[] {
  if (points.length <= targetPoints) {
    return points;
  }

  const step = Math.floor(points.length / targetPoints);
  const reduced: TrackPoint[] = [];

  for (let i = 0; i < points.length; i += step) {
    reduced.push(points[i]);
  }

  // 最後のポイントを必ず含める
  if (reduced[reduced.length - 1] !== points[points.length - 1]) {
    reduced.push(points[points.length - 1]);
  }

  return reduced;
}
