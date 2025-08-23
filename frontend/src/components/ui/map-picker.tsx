'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
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

interface Location {
  lat: number;
  lng: number;
}

interface MapPickerProps {
  onLocationSelect: (location: Location) => void;
  defaultCenter?: Location;
}

// Component to handle map clicks
function LocationMarker({ onLocationSelect }: { onLocationSelect: (location: Location) => void }) {
  const [position, setPosition] = useState<Location | null>(null);

  const map = useMapEvents({
    click(e) {
      const newPos = { lat: e.latlng.lat, lng: e.latlng.lng };
      setPosition(newPos);
      onLocationSelect(newPos);
      // Zoom in slightly when a location is selected
      if (map.getZoom() < 16) {
        map.setZoom(16);
      }
      map.panTo(newPos);
    },
  });

  return position ? (
    <Marker 
      position={position} 
      icon={icon}
    >
    </Marker>
  ) : null;
}

export function MapPicker({ onLocationSelect, defaultCenter }: MapPickerProps) {
  const [instructions, setInstructions] = useState(true);
  const center = defaultCenter || { lat: 6.079565868771222, lng: 80.19253173040384 };

  return (
    <div className="relative w-full h-[400px] rounded-lg overflow-hidden border border-gray-200">
      {instructions && (
        <div className="absolute top-4 left-4 right-4 z-[1000] bg-black/75 text-white p-4 rounded-lg shadow-lg">
          <div className="flex justify-between items-center">
            <p className="text-sm">
              👆 Click anywhere on the map to select a location. 
              You can zoom in/out using the + and - buttons or mouse wheel.
              Pan the map by dragging.
            </p>
            <button 
              onClick={() => setInstructions(false)}
              className="ml-4 text-white hover:text-gray-300"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      <MapContainer
        center={center}
        zoom={16}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker onLocationSelect={onLocationSelect} />
        <div className="absolute bottom-4 right-4 z-[1000] bg-white p-2 rounded-lg shadow-md text-xs">
          Click to place a marker
        </div>
      </MapContainer>
    </div>
  );
}
