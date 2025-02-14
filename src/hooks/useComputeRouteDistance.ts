// src/hooks/useComputeRouteDistance.ts
import { useState, useEffect } from 'react';
import { parseGpxContent, computeRouteDistance } from '../utils/gpxUtils';

interface UseComputeRouteDistanceResult {
  distance: number;
  loading: boolean;
}

const useComputeRouteDistance = (gpxContent: string | null): UseComputeRouteDistanceResult => {
  const [distance, setDistance] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!gpxContent) {
      setDistance(0);
      setLoading(false);
      return;
    }
    setLoading(true);

    // 少しの遅延を与えることで、loading 状態の反映を確実にする
    setTimeout(() => {
      try {
        const geojson = parseGpxContent(gpxContent);
        const computedDistance = computeRouteDistance(geojson);
        setDistance(computedDistance);
      } catch (error) {
        console.error('ルート距離計算エラー:', error);
        setDistance(0);
      } finally {
        setLoading(false);
      }
    }, 100);
  }, [gpxContent]);

  return { distance, loading };
};

export default useComputeRouteDistance;
