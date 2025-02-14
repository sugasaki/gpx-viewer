import {
  Chart as ChartJS,
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
import './MapView.css'; // ここでCSSファイルを読み込む

// Chart.js に必要なコンポーネントを登録
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export interface TrackPoint {
  distance: number; // 累積距離 (m)
  elevation: number; // 標高 (m)
  lat: number;
  lon: number;
}

interface ElevationChartProps {
  trackPoints: TrackPoint[];
}

export default function ElevationChart({ trackPoints }: ElevationChartProps) {
  const { setLatLon } = useMarkerContext(); // マーカー座標を更新する関数

  // X軸: 距離(km), Y軸: 標高(m)
  const data = {
    labels: trackPoints.map((tp) => (tp.distance / 1000).toFixed(2)),
    datasets: [
      {
        label: 'Elevation (m)',
        data: trackPoints.map((tp) => tp.elevation),
        borderColor: 'orange',
        backgroundColor: 'rgba(255,165,0,0.3)',
        fill: true,
        tension: 0.1,
      },
    ],
  };

  function findNearestTrackPoint(xValueKm: number): TrackPoint | null {
    if (trackPoints.length === 0) return null;
    const xValueM = xValueKm * 1000;
    let nearest = trackPoints[0];
    let minDiff = Infinity;
    for (const tp of trackPoints) {
      const diff = Math.abs(tp.distance - xValueM);
      if (diff < minDiff) {
        minDiff = diff;
        nearest = tp;
      }
    }
    return nearest;
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    onHover: (event: ChartEvent, _active: ActiveElement[], chart: Chart) => {
      // console.log('event', event);
      if (!event.x) {
        // チャート外の場合
        setLatLon(null, null);
        return;
      }
      const xScale = chart.scales.x;
      if (!xScale) {
        setLatLon(null, null);
        return;
      }
      const xValueKm = xScale.getValueForPixel(event.x);
      if (typeof xValueKm !== 'number') {
        setLatLon(null, null);
        return;
      }
      // 最も近い TrackPoint を検索
      const nearest = findNearestTrackPoint(xValueKm);
      if (!nearest) {
        setLatLon(null, null);
        return;
      }
      // console.log('nearest', nearest);
      setLatLon(nearest.lat, nearest.lon);
    },
    scales: {
      x: {
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
  };

  return (
    <div style={{ width: '100%', height: '300px' }}>
      <Line data={data} options={options} />
    </div>
  );
}
