// src/components/MapView.tsx
import React, { useState } from 'react';
import Map from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
import useLoadGpxLayer from '../hooks/useLoadGpxLayer';
import { useGpxWorker } from '../hooks/useGpxWorker';
import 'maplibre-gl/dist/maplibre-gl.css';

interface MapViewProps {
  gpxContent: string | null;
}

const MapView: React.FC<MapViewProps> = ({ gpxContent }) => {
  const [mapInstance, setMapInstance] = useState<maplibregl.Map | null>(null);

  // Workerを使ってGPXの解析をオフロード
  const { geojson, error, loading } = useGpxWorker(gpxContent);

  const handleLoad = (event: any) => {
    const map = event.target;
    setMapInstance(map);
  };

  // 解析済みGeoJSONをMapLibreのレイヤー追加用カスタムフックに渡す
  useLoadGpxLayer(mapInstance, geojson);

  return (
    <div className="map-container">
      {loading && <div className="distance-display">読み込み中…</div>}
      {error && (
        <div className="distance-display" style={{ background: 'rgba(255,0,0,0.8)' }}>
          エラー: {error}
        </div>
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
