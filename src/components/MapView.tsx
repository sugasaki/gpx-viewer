import React from 'react';
import { MarkerProvider } from '../contexts/MarkerContext';
import InnerMapView from './InnerMapView';

interface MapViewProps {
  gpxContent: string | null;
}

const MapView: React.FC<MapViewProps> = ({ gpxContent }) => {
  return (
    <MarkerProvider>
      <InnerMapView gpxContent={gpxContent} />
    </MarkerProvider>
  );
};

export default MapView;
