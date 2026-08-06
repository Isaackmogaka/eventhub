'use client';

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useState } from 'react';
import L from 'leaflet';

// Fix Leaflet's default marker icon paths, which break under Next.js bundling
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface LocationPickerProps {
  onPick: (lat: number, lng: number) => void;
}

function ClickHandler({ onPick, setPosition }: { onPick: (lat: number, lng: number) => void; setPosition: (p: [number, number]) => void }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export function LocationPicker({ onPick }: LocationPickerProps) {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const nairobi: [number, number] = [-1.2921, 36.8219];

  return (
    <div className="rounded-lg overflow-hidden border border-gray-200" style={{ height: 240 }}>
      <MapContainer center={nairobi} zoom={12} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler onPick={onPick} setPosition={setPosition} />
        {position && <Marker position={position} />}
      </MapContainer>
    </div>
  );
}
