// src/components/MapView.tsx
import React, { useState } from 'react';
import Map from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
import useLoadGpxLayer from '../hooks/useLoadGpxLayer';
import useComputeRouteDistance from '../hooks/useComputeRouteDistance';
import 'maplibre-gl/dist/maplibre-gl.css';

interface MapViewProps {
  gpxContent: string | null;
}

const MapView: React.FC<MapViewProps> = ({ gpxContent }) => {
  const [mapInstance, setMapInstance] = useState<maplibregl.Map | null>(null);

  // マップ読み込み完了時に mapInstance を取得
  const handleLoad = (event: any) => {
    const map = event.target;
    setMapInstance(map);
  };

  // マップへの GPX レイヤー追加と表示範囲調整の処理の loading 状態を取得
  const { loading: layerLoading } = useLoadGpxLayer(mapInstance, gpxContent);

  // GPX 内容からルート距離の計算とその loading 状態を取得
  const { distance: routeDistance, loading: distanceLoading } = useComputeRouteDistance(gpxContent);

  // 距離の表示形式：1000m以上なら km、未満なら m
  const distanceText =
    routeDistance >= 1000 ? (routeDistance / 1000).toFixed(2) + ' km' : routeDistance.toFixed(2) + ' m';

  return (
    <div className="map-container">
      {!mapInstance && <div className="loading-indicator">{'マップ読み込み中…'}</div>}
      {layerLoading && <div className="loading-indicator">{'GPX 処理中…'}</div>}
      {distanceLoading && <div className="loading-indicator">{'ルート距離 処理中…'}</div>}

      {gpxContent && !layerLoading && routeDistance > 0 && (
        <div className="distance-display">ルート距離: {distanceText}</div>
      )}
      <Map
        initialViewState={{
          longitude: 139.767,
          latitude: 35.681,
          zoom: 12,
        }}
        mapLib={maplibregl}
        style={{ width: '100%', height: '100%' }}
        mapStyle="https://demotiles.maplibre.org/style.json"
        onLoad={handleLoad}
      />
    </div>
  );
};

export default MapView;
