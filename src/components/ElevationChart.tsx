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
import './MapView.css'; // ここでCSSファイルを読み込む
import { findNearestTrackPoint, TrackPoint } from '../utils/trackUtils';

// Chart.js に必要なコンポーネントを登録
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

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
        data: trackPoints.map((tp) => ({ x: tp.distance, y: tp.elevation })),
        borderColor: 'orange',
        backgroundColor: 'rgba(255,165,0,0.3)',
        fill: true,
        tension: 0.1,
      },
    ],
  };

  /**
   * マウスホバー時のイベントハンドラ
   * @param event
   * @param _active
   * @param chart
   * @returns
   */
  const onHoverEvent = (event: ChartEvent, _active: ActiveElement[], chart: Chart) => {
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
    // console.log('xScale', xScale);

    // マウスホバー位置のX座標から距離を取得
    const distanceM = xScale.getValueForPixel(event.x);
    // console.log('Distance:', distanceM);

    if (typeof distanceM !== 'number') {
      setLatLon(null, null);
      return;
    }

    // 最も近い TrackPoint を検索
    const nearest = findNearestTrackPoint(distanceM, trackPoints);
    if (!nearest) {
      setLatLon(null, null);
      return;
    }
    // console.log('nearest', nearest);
    setLatLon(nearest.lat, nearest.lon);
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    onHover: onHoverEvent,
    scales: {
      x: {
        type: 'linear', // 重要: 数値スケールを指定
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
