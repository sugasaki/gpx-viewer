import React, { useState } from 'react';
import Map from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
import useLoadGpxLayer from '../hooks/useLoadGpxLayer';
import 'maplibre-gl/dist/maplibre-gl.css';

interface MapViewProps {
  gpxContent: string | null;
}

const MapView: React.FC<MapViewProps> = ({ gpxContent }) => {
  const [mapInstance, setMapInstance] = useState<maplibregl.Map | null>(null);

  // onLoad で内部の MapLibre インスタンスを取得
  const handleLoad = (event: any) => {
    const map = event.target;
    setMapInstance(map);
  };

  // GPX内容があれば、カスタムフックで地図にレイヤー追加
  useLoadGpxLayer(mapInstance, gpxContent);

  return (
    <div className="map-container">
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
