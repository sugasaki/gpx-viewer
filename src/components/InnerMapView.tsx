// src/components/MapView.tsx
import React, { useState } from 'react';
import Map from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
import useLoadGpxLayer from '../hooks/useLoadGpxLayer';
import useComputeRouteDistance from '../hooks/useComputeRouteDistance';
import { useTrackPoints } from '../hooks/useTrackPoints';
import ElevationChart from './ElevationChart';
import 'maplibre-gl/dist/maplibre-gl.css';
import './MapView.css'; // ここでCSSファイルを読み込む
import { useMarkerContext } from '../contexts/MarkerContext';
import MapMarker from './MapMarker';

interface MapViewProps {
  gpxContent: string | null;
}

const InnerMapView: React.FC<MapViewProps> = ({ gpxContent }) => {
  const [mapInstance, setMapInstance] = useState<maplibregl.Map | null>(null);
  const { setMap } = useMarkerContext();

  // MapLibre レイヤー表示
  const { loading: layerLoading } = useLoadGpxLayer(mapInstance, gpxContent);

  // 距離計算
  const { distance, loading: distanceLoading } = useComputeRouteDistance(gpxContent);

  // トラックポイント抽出
  const trackPoints = useTrackPoints(gpxContent);

  // マップ読み込み完了時
  const handleLoad = (event: any) => {
    const map = event.target;
    setMapInstance(map);
    setMap(map as maplibregl.Map);

    // new maplibregl.Marker().setLngLat([139.767, 35.681]).addTo(map);
  };

  // 距離表示用
  const distanceText = distance >= 1000 ? (distance / 1000).toFixed(2) + ' km' : distance.toFixed(2) + ' m';

  return (
    <div className="map-container">
      {/* ローディング表示 */}
      {!mapInstance && <div className="loading-indicator">マップ読み込み中…</div>}
      {layerLoading && <div className="loading-indicator">GPX 処理中…</div>}
      {distanceLoading && <div className="loading-indicator">ルート距離 処理中…</div>}

      {/* 距離表示 */}
      {gpxContent && !layerLoading && distance > 0 && (
        <div className="distance-display">ルート距離: {distanceText}</div>
      )}

      {/* 地図 */}
      <div className="map-wrapper">
        <Map
          initialViewState={{
            longitude: 139.767,
            latitude: 35.681,
            zoom: 12,
          }}
          mapLib={maplibregl}
          style={{ width: '100%', height: '100%' }} // 親要素に合わせて拡大
          mapStyle="https://demotiles.maplibre.org/style.json"
          onLoad={handleLoad}
        />
        {/* マーカーコンポーネント */}
        <MapMarker color="red" />
      </div>

      {/* 標高チャート */}
      {trackPoints.length > 1 && (
        <div className="chart-wrapper">
          <ElevationChart trackPoints={trackPoints} />
        </div>
      )}
    </div>
  );
};

export default InnerMapView;
