// src/hooks/useComputeRouteDistance.ts
import { useState, useEffect } from 'react';
import { getDistanceFromGpxAsync } from '../utils/gpxDistanceAsync';
import { to } from '../utils/to';

interface UseComputeRouteDistanceResult {
  distance: number;
  loading: boolean;
}

const useComputeRouteDistance = (gpxContent: string | null): UseComputeRouteDistanceResult => {
  const [distance, setDistance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!gpxContent) {
      setDistance(0);
      setLoading(false);
      return;
    }

    const computeDistance = async () => {
      setLoading(true);
      const [error, computedDistance] = await to(getDistanceFromGpxAsync(gpxContent));
      if (error) {
        console.error('ルート距離計算エラー:', error);
        setDistance(0);
      } else {
        setDistance(computedDistance as number);
      }
      setLoading(false);
    };

    computeDistance();
  }, [gpxContent]);

  return { distance, loading };
};

export default useComputeRouteDistance;
