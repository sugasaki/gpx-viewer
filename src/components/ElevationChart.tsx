// src/components/ElevationChart.tsx
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

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

const ElevationChart: React.FC<ElevationChartProps> = ({ trackPoints }) => {
  // x軸: 距離(km), y軸: 標高(m)
  const data = {
    labels: trackPoints.map((tp) => (tp.distance / 1000).toFixed(2)),
    datasets: [
      {
        label: 'Elevation (m)',
        data: trackPoints.map((tp) => tp.elevation),
        borderColor: 'orange',
        backgroundColor: 'rgba(255, 165, 0, 0.3)',
        fill: true,
        tension: 0.1, // 折れ線を少し滑らかに
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // 親要素の高さに応じて伸縮
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
    // グラフ上でクリックした地点を取得して地図と連動するなどの拡張も可能
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onClick: (elements: any) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const point = trackPoints[index];
        console.log('Clicked track point:', point);
        // ここで地図にマーカーを立てたり、flyTo したりできる
      }
    },
  };

  return (
    <div style={{ width: '100%', height: '300px' }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default ElevationChart;
