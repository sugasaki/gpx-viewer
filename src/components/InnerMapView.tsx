import React from 'react';
import Map from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
import { useMarkerContext } from '../contexts/MarkerContext';
import MapMarker from './MapMarker';
import ElevationChart from './ElevationChart';
import useLoadGpxLayer from '../hooks/useLoadGpxLayer';
import useComputeRouteDistance from '../hooks/useComputeRouteDistance';
import { useTrackPoints } from '../hooks/useTrackPoints';
import './MapView.css'; // ここでCSSファイルを読み込む
import './MapView.css'; // ここでCSSファイルを読み込む

interface InnerMapViewProps {
  gpxContent: string | null;
}

const InnerMapView: React.FC<InnerMapViewProps> = ({ gpxContent }) => {
  const { setMap, map: mapInstance } = useMarkerContext();

  // MapLibre レイヤー表示
  const { loading: layerLoading } = useLoadGpxLayer(mapInstance, gpxContent);

  // 距離計算
  const { distance, loading: distanceLoading } = useComputeRouteDistance(gpxContent);

  // トラックポイント抽出
  const trackPoints = useTrackPoints(gpxContent);

  function handleMapLoad(event: any) {
    setMap(event.target as maplibregl.Map);
  }

  return (
    <div className="map-container">
      {/* ローディング表示 */}
      {!mapInstance && <div className="loading-indicator">{'マップ読み込み中…'}</div>}
      {layerLoading && <div className="loading-indicator">{'GPX 処理中…'}</div>}
      {distanceLoading && <div className="loading-indicator">{'ルート距離 処理中…'}</div>}

      {/* 距離表示 */}
      {gpxContent && !layerLoading && distance > 0 && <div className="distance-display">ルート距離: {distance}</div>}

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
          onLoad={handleMapLoad}
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
