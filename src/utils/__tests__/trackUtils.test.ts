import { describe, it, expect } from 'vitest';
import { findNearestTrackPoint, interpolatePoint, type TrackPoint } from '../trackUtils';

// findNearestTrackPointのテスト
describe('findNearestTrackPoint', () => {
  // テストデータ
  const sampleTrackPoints: TrackPoint[] = [
    { distance: 0, elevation: 100, lat: 35.0, lon: 135.0 },
    { distance: 100, elevation: 110, lat: 35.001, lon: 135.001 },
    { distance: 200, elevation: 120, lat: 35.002, lon: 135.002 },
    { distance: 300, elevation: 130, lat: 35.003, lon: 135.003 },
  ];

  it('既存の点と完全に一致する距離を指定した場合、その点を返す', () => {
    const result = findNearestTrackPoint(100, sampleTrackPoints);
    expect(result).toEqual(sampleTrackPoints[1]);
  });

  it('2点間の中間地点で補間された点を返す', () => {
    const result = findNearestTrackPoint(150, sampleTrackPoints);
    expect(result?.distance).toBe(150);
    expect(result?.elevation).toBeCloseTo(115, 5);
    expect(result?.lat).toBeCloseTo(35.0015, 5);
    expect(result?.lon).toBeCloseTo(135.0015, 5);
  });

  it('25%位置で補間された点を返す', () => {
    const result = findNearestTrackPoint(125, sampleTrackPoints);
    expect(result?.distance).toBe(125);
    expect(result?.elevation).toBeCloseTo(112.5, 5);
    expect(result?.lat).toBeCloseTo(35.00125, 5);
    expect(result?.lon).toBeCloseTo(135.00125, 5);
  });

  it('空の配列の場合、nullを返す', () => {
    const result = findNearestTrackPoint(100, []);
    expect(result).toBeNull();
  });

  it('単一要素の配列の場合、その要素を返す', () => {
    const singlePoint = { distance: 0, elevation: 100, lat: 35.0, lon: 135.0 };
    const result = findNearestTrackPoint(100, [singlePoint]);
    expect(result).toEqual(singlePoint);
  });

  it('最小距離未満の場合、最初の点を返す', () => {
    const result = findNearestTrackPoint(-50, sampleTrackPoints);
    expect(result).toEqual(sampleTrackPoints[0]);
  });

  it('最大距離超過の場合、最後の点を返す', () => {
    const result = findNearestTrackPoint(400, sampleTrackPoints);
    expect(result).toEqual(sampleTrackPoints[sampleTrackPoints.length - 1]);
  });
});

// interpolatePointのテスト
describe('interpolatePoint', () => {
  const start: TrackPoint = { distance: 0, elevation: 100, lat: 35.0, lon: 135.0 };
  const end: TrackPoint = { distance: 100, elevation: 200, lat: 35.1, lon: 135.1 };

  it('中間点（50%）で正しく補間される', () => {
    const result = interpolatePoint(start, end, 50);
    expect(result.distance).toBe(50);
    expect(result.elevation).toBeCloseTo(150, 5); // 100 + (200 - 100) * 0.5
    expect(result.lat).toBeCloseTo(35.05, 5); // 35.0 + (35.1 - 35.0) * 0.5
    expect(result.lon).toBeCloseTo(135.05, 5); // 135.0 + (135.1 - 135.0) * 0.5
  });

  it('25%位置で正しく補間される', () => {
    const result = interpolatePoint(start, end, 25);
    expect(result.distance).toBe(25);
    expect(result.elevation).toBeCloseTo(125, 5); // 100 + (200 - 100) * 0.25
    expect(result.lat).toBeCloseTo(35.025, 5); // 35.0 + (35.1 - 35.0) * 0.25
    expect(result.lon).toBeCloseTo(135.025, 5); // 135.0 + (135.1 - 135.0) * 0.25
  });

  it('75%位置で正しく補間される', () => {
    const result = interpolatePoint(start, end, 75);
    expect(result.distance).toBe(75);
    expect(result.elevation).toBeCloseTo(175, 5); // 100 + (200 - 100) * 0.75
    expect(result.lat).toBeCloseTo(35.075, 5); // 35.0 + (35.1 - 35.0) * 0.75
    expect(result.lon).toBeCloseTo(135.075, 5); // 135.0 + (135.1 - 135.0) * 0.75
  });

  it('開始点の距離で開始点と同じ値を返す', () => {
    const result = interpolatePoint(start, end, 0);
    expect(result).toEqual(start);
  });

  it('終了点の距離で終了点と同じ値を返す', () => {
    const result = interpolatePoint(start, end, 100);
    expect(result).toEqual(end);
  });
});
