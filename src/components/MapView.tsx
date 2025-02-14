import React, { useState, useMemo } from 'react';
import Map from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
import useLoadGpxLayer from '../hooks/useLoadGpxLayer';
import 'maplibre-gl/dist/maplibre-gl.css';
import { computeRouteDistance, parseGpxContent } from '../utils/gpxUtils';

interface MapViewProps {
  gpxContent: string | null;
}

const MapView: React.FC<MapViewProps> = ({ gpxContent }) => {
  const [mapInstance, setMapInstance] = useState<maplibregl.Map | null>(null);

  const handleLoad = (event: any) => {
    const map = event.target;
    setMapInstance(map);
  };

  // GPXファイルが読み込まれている場合、マップへレイヤー追加
  useLoadGpxLayer(mapInstance, gpxContent);

  // GPX内容がある場合にGeoJSONに変換し、ルート距離（メートル）を計算
  const routeDistance = useMemo(() => {
    if (gpxContent) {
      try {
        const geojson = parseGpxContent(gpxContent);
        return computeRouteDistance(geojson);
      } catch (error) {
        console.error('Error computing route distance:', error);
        return 0;
      }
    }
    return 0;
  }, [gpxContent]);

  // 距離が1000m以上ならkm表示、それ未満ならm表示
  const distanceText =
    routeDistance >= 1000 ? (routeDistance / 1000).toFixed(2) + ' km' : routeDistance.toFixed(2) + ' m';

  return (
    <div className="map-container">
      {gpxContent && <div className="distance-display">Route Distance: {distanceText}</div>}
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
