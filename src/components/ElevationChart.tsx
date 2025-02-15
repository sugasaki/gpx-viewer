import { useMemo, useRef, useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  ChartOptions,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartEvent,
  ActiveElement,
  Chart,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useMarkerContext } from '../contexts/MarkerContext';
import './MapView.css';
import { findNearestTrackPoint, TrackPoint } from '../utils/trackUtils';
import { reduceTrackPoints } from '../utils/chartUtils';

// Chart.js に必要なコンポーネントを登録
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface ElevationChartProps {
  trackPoints: TrackPoint[];
}

// 最小データポイント数（データが少なすぎると補間が不自然になるのを防ぐ）
const MIN_DATA_POINTS = 100;
// 1ピクセルあたりの最大データポイント数
// - 人間の目で識別できる最小の角度（約0.016度）を考慮
// - Retinaディスプレイの2倍のピクセル密度に対応
// - チャートの視認性とパフォーマンスのバランスを考慮
const MAX_POINTS_PER_PIXEL = 0.5;

export default function ElevationChart({ trackPoints }: ElevationChartProps) {
  const { setLatLon } = useMarkerContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // コンテナの幅を監視
  useEffect(() => {
    if (!containerRef.current) return;

    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };

    // 初期幅を設定
    updateWidth();

    // リサイズオブザーバーを設定
    const observer = new ResizeObserver(updateWidth);
    observer.observe(containerRef.current);

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  // 表示幅に基づいて適切なポイント数を計算
  const targetPoints = useMemo(() => {
    if (containerWidth === 0) return MIN_DATA_POINTS;

    // 最小データポイント数と、幅に基づく最適なポイント数の大きい方を採用
    return Math.max(MIN_DATA_POINTS, Math.min(trackPoints.length, Math.ceil(containerWidth * MAX_POINTS_PER_PIXEL)));
  }, [containerWidth, trackPoints.length]);

  // console.log('targetPoints:', targetPoints);

  // トラックポイントの間引きとデータ変換を最適化
  const { labels, chartData } = useMemo(() => {
    const reducedPoints = reduceTrackPoints(trackPoints, targetPoints);
    return {
      labels: reducedPoints.map((tp) => (tp.distance / 1000).toFixed(2)),
      chartData: reducedPoints.map((tp) => ({ x: tp.distance, y: tp.elevation })),
    };
  }, [trackPoints, targetPoints]);

  // チャートデータの構造を最適化
  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: 'Elevation (m)',
          data: chartData,
          borderColor: 'orange',
          backgroundColor: 'rgba(255,165,0,0.3)',
          fill: true,
          tension: 0.1,
        },
      ],
    }),
    [labels, chartData],
  );

  const onHoverEvent = useMemo(
    () => (event: ChartEvent, _active: ActiveElement[], chart: Chart) => {
      if (!event.x) {
        setLatLon(null, null);
        return;
      }

      const xScale = chart.scales.x;
      if (!xScale) {
        setLatLon(null, null);
        return;
      }

      const distanceM = xScale.getValueForPixel(event.x);
      if (typeof distanceM !== 'number') {
        setLatLon(null, null);
        return;
      }

      const nearest = findNearestTrackPoint(distanceM, trackPoints);
      if (!nearest) {
        setLatLon(null, null);
        return;
      }
      setLatLon(nearest.lat, nearest.lon);
    },
    [trackPoints, setLatLon],
  );

  const options: ChartOptions<'line'> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      onHover: onHoverEvent,
      animation: {
        duration: 0, // アニメーションを無効化してパフォーマンスを改善
      },
      scales: {
        x: {
          type: 'linear',
          title: {
            display: true,
            text: 'Distance (km)',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Elevation (m)',
          },
        },
      },
    }),
    [onHoverEvent],
  );

  return (
    <div ref={containerRef} style={{ width: '100%', height: '300px' }}>
      <Line data={data} options={options} />
    </div>
  );
}
