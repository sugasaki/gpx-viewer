// src/components/MapMarker.tsx
import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import { useMarkerContext } from '../contexts/MarkerContext';

interface MapMarkerProps {
  color?: string;
}

/**
 * マーカーの生成・移動・削除を担当するコンポーネント
 * MarkerContext から map, lat, lon を取得し、マーカーを制御する
 */
const MapMarker: React.FC<MapMarkerProps> = ({ color = 'red' }) => {
  const { map, lat, lon } = useMarkerContext();
  const markerRef = useRef<maplibregl.Marker | null>(null);
  //   console.log('lat1', lat, 'lon1', lon);
  useEffect(() => {
    if (!map) return;
    // console.log('lat2', lat, 'lon2', lon);

    // マーカー未生成なら作成
    if (!markerRef.current) {
      markerRef.current = new maplibregl.Marker({ color }).setLngLat([0, 0]).addTo(map);
    }

    // lat, lon が正しい値なら移動、無効なら remove()
    if (lat !== null && lon !== null && !Number.isNaN(lat) && !Number.isNaN(lon)) {
      markerRef.current.setLngLat([lon, lat]).addTo(map);
    } else {
      markerRef.current.remove();
    }
  }, [map, lat, lon, color]);

  return null; // React的には何も描画しない
};

export default MapMarker;
