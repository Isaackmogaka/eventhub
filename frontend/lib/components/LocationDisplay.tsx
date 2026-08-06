'use client';

import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import { useState } from 'react';
import L from 'leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function ScrollZoomToggle({ active }: { active: boolean }) {
  const map = useMap();
  if (active) {
    map.scrollWheelZoom.enable();
  } else {
    map.scrollWheelZoom.disable();
  }
  return null;
}

export function LocationDisplay({ lat, lng }: { lat: number; lng: number }) {
  const [active, setActive] = useState(false);

  return (
    <div
      className="relative rounded-xl overflow-hidden border border-gray-200"
      style={{ height: 200 }}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onClick={() => setActive(true)}
    >
      <MapContainer center={[lat, lng]} zoom={14} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
        <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[lat, lng]} />
        <ScrollZoomToggle active={active} />
      </MapContainer>
      {!active && (
        <div className="absolute inset-0 bg-black/0 flex items-center justify-center pointer-events-none">
          <span className="bg-white/90 text-xs font-semibold text-gray-700 px-2.5 py-1 rounded-full opacity-0 hover:opacity-100">
            Click to zoom with scroll
          </span>
        </div>
      )}
    </div>
  );
}
