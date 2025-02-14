// src/hooks/useGpxWorker.ts
import { useState, useEffect } from 'react';

interface GpxWorkerResult {
  geojson: any | null;
  error: string | null;
  loading: boolean;
}

export function useGpxWorker(gpxContent: string | null): GpxWorkerResult {
  const [geojson, setGeojson] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!gpxContent) {
      setGeojson(null);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Workerのインスタンスを生成
    // const worker = new Worker(new URL('../workers/gpxWorker.ts', import.meta.url));
    // const worker = new Worker(/* @vite-ignore */ new URL('../workers/gpxWorker.ts', import.meta.url));
    const worker = new Worker(/* @vite-ignore */ new URL('../workers/gpxWorker.ts', import.meta.url), {
      type: 'module',
    });

    worker.postMessage(gpxContent);

    worker.onmessage = (e: MessageEvent<any>) => {
      if (e.data.error) {
        setError(e.data.error);
      } else {
        setGeojson(e.data.geojson);
      }
      setLoading(false);
      worker.terminate();
    };

    // クリーンアップ
    return () => {
      worker.terminate();
    };
  }, [gpxContent]);

  return { geojson, error, loading };
}
