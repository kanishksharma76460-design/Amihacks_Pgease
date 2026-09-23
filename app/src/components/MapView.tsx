import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { inr } from '../lib/utils';

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  price: number;
}

export default function MapView({
  markers,
  center,
  onSelect,
}: {
  markers: MapMarker[];
  center: [number, number];
  onSelect?: (id: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const selectRef = useRef(onSelect);
  selectRef.current = onSelect;

  useEffect(() => {
    if (!containerRef.current) return;
    if (!mapRef.current) {
      mapRef.current = L.map(containerRef.current, { center, zoom: 12, scrollWheelZoom: false });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(mapRef.current);
      requestAnimationFrame(() => mapRef.current?.invalidateSize());
    }
    mapRef.current.setView(center, mapRef.current.getZoom() < 12 ? 12 : mapRef.current.getZoom());

    const layer = L.layerGroup().addTo(mapRef.current);
    markers.forEach((m) => {
      const marker = L.circleMarker([m.lat, m.lng], {
        radius: 9,
        color: '#ffffff',
        weight: 2,
        fillColor: '#4f46e5',
        fillOpacity: 0.9,
      }).addTo(layer);
      marker.bindTooltip(inr(m.price), { direction: 'top', offset: [0, -10] });
      marker.on('click', () => selectRef.current?.(m.id));
    });

    return () => {
      layer.clearLayers();
    };
  }, [markers, center]);

  // Re-fit the map whenever its container is shown or resized (e.g. mobile List/Map toggle).
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => mapRef.current?.invalidateSize());
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return <div ref={containerRef} className="h-full w-full" />;
}
