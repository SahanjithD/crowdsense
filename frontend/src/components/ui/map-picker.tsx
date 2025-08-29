'use client';

import { useState, useEffect } from 'react';
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

interface Location {
  lat: number;
  lng: number;
}

interface PublicSpace {
  space_id: string;
  name: string;
  space_type: string;
  latitude: number;
  longitude: number;
  avg_rating: number;
  total_feedback_count: number;
}

interface MapPickerProps {
  onLocationSelect: (location: Location) => void;
  defaultCenter?: Location;
  existingSpaces?: PublicSpace[];
  onSpaceClick?: (space: PublicSpace) => void;
  selectedLocation?: Location;
}

// Component to handle map clicks
function LocationMarker({ onLocationSelect, selectedLocation }: { onLocationSelect: (location: Location) => void, selectedLocation?: Location }) {
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

  // Update position and center map when selectedLocation changes
  useEffect(() => {
    if (selectedLocation) {
      setPosition(selectedLocation);
      map.setView([selectedLocation.lat, selectedLocation.lng], 16);
    }
  }, [selectedLocation, map]);

  return position ? (
    <Marker 
      position={position} 
      icon={icon}
    >
    </Marker>
  ) : null;
}

// Component to display existing spaces
function ExistingSpaces({ spaces, onSpaceClick }: { spaces: PublicSpace[], onSpaceClick?: (space: PublicSpace) => void }) {
  return (
    <>
      {spaces.map((space) => (
        <Marker
          key={space.space_id}
          position={{ lat: space.latitude, lng: space.longitude }}
          icon={new Icon({
            iconUrl: '/marker-icon.png',
            iconRetinaUrl: '/marker-icon-2x.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowUrl: '/marker-shadow.png',
            shadowSize: [41, 41],
            className: `marker-${space.space_type}`
          })}
          eventHandlers={{
            click: () => onSpaceClick?.(space)
          }}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-semibold">{space.name}</h3>
              <p className="text-sm text-gray-600">{space.space_type}</p>
              {Number(space.avg_rating) > 0 && (
                <p className="text-sm">
                  Rating: {Number(space.avg_rating).toFixed(1)} ⭐ ({space.total_feedback_count || 0} reviews)
                </p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}

export function MapPicker({ onLocationSelect, defaultCenter, existingSpaces = [], onSpaceClick, selectedLocation }: MapPickerProps) {
  const [instructions, setInstructions] = useState(true);
  const center = selectedLocation || defaultCenter || { lat: 6.079565868771222, lng: 80.19253173040384 };

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
        <LocationMarker onLocationSelect={onLocationSelect} selectedLocation={selectedLocation} />
        <ExistingSpaces spaces={existingSpaces} onSpaceClick={onSpaceClick} />
        <div className="absolute bottom-4 right-4 z-[1000] bg-white p-2 rounded-lg shadow-md text-xs">
          Click to place a marker
        </div>
      </MapContainer>
    </div>
  );
}
