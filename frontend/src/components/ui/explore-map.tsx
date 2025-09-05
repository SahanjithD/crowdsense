'use client';

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for the default marker icon in Leaflet with Next.js
const icon = new Icon({
  iconUrl: '/marker-icon.png',
  iconRetinaUrl: '/marker-icon-2x.png',
  shadowUrl: '/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

export interface MapMarker {
  id: string;
  position: {
    lat: number;
    lng: number;
  };
  popup: string;
  tooltip?: string;
}

interface ExploreMapProps {
  markers: MapMarker[];
  onMarkerClick?: (marker: MapMarker) => void;
  center?: { lat: number; lng: number };
  zoom?: number;
}

export default function ExploreMap({ 
  markers, 
  onMarkerClick,
  center = { lat: 6.079565868771222, lng: 80.19253173040384 },
  zoom = 13 
}: ExploreMapProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          position={marker.position}
          icon={icon}
          eventHandlers={{
            click: () => onMarkerClick?.(marker)
          }}
        >
          <Popup>
            <div dangerouslySetInnerHTML={{ __html: marker.popup }} />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
