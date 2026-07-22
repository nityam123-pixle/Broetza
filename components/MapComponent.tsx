"use client";
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export interface ShopLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  phone?: string;
  hours?: string;
  status: "Open Now" | "Opening Soon";
  directionsUrl: string;
}

interface MapComponentProps {
  locations: ShopLocation[];
  activeLocationId: string;
  onSelectLocation: (id: string) => void;
}

export default function MapComponent({
  locations,
  activeLocationId,
  onSelectLocation,
}: MapComponentProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize Leaflet Map once
    if (!mapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [23.05, 72.58],
        zoom: 12,
        zoomControl: false,
        attributionControl: false,
      });

      // Add CartoDB Voyager Light tile layer (100% FREE, NO API KEY REQUIRED, sits cleanly on white)
      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        maxZoom: 19,
        subdomains: "abcd",
      }).addTo(map);

      // Add Zoom Control at top right
      L.control.zoom({ position: "topright" }).addTo(map);

      mapRef.current = map;
    }

    const map = mapRef.current;

    // Create / Update markers
    locations.forEach((loc) => {
      const isActive = loc.id === activeLocationId;

      // Custom Bro'etza Red HTML Marker Icon with Pulsing Outer Ring
      const customIcon = L.divIcon({
        className: "custom-broetza-marker",
        html: `
          <div class="marker-pin-wrapper ${isActive ? "active" : ""}">
            ${isActive ? '<div class="marker-pulse-ring"></div>' : ""}
            <div class="marker-bubble ${isActive ? "is-active" : ""}">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
      });

      if (!markersRef.current[loc.id]) {
        const marker = L.marker([loc.lat, loc.lng], { icon: customIcon }).addTo(map);

        const popupContent = document.createElement("div");
        popupContent.className = "broetza-leaflet-popup";
        popupContent.innerHTML = `
          <div style="font-family: var(--font-sans, sans-serif); padding: 4px;">
            <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: #BC3330; letter-spacing: 0.05em;">${loc.status}</span>
            <h4 style="font-family: var(--display, sans-serif); font-size: 16px; font-weight: 800; text-transform: uppercase; color: #17100a; margin: 4px 0 2px 0;">${loc.name}</h4>
            <p style="font-size: 11px; color: #4a5568; margin-bottom: 10px; line-height: 1.4;">${loc.address}</p>
            <a href="${loc.directionsUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 6px 14px; background-color: #BC3330; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase;">Get Directions →</a>
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.on("click", () => {
          onSelectLocation(loc.id);
        });

        markersRef.current[loc.id] = marker;
      } else {
        markersRef.current[loc.id].setIcon(customIcon);
      }
    });
  }, [locations, activeLocationId, onSelectLocation]);

  // Pan to active location smoothly when changed
  useEffect(() => {
    const activeLoc = locations.find((l) => l.id === activeLocationId);
    if (activeLoc && mapRef.current) {
      mapRef.current.flyTo([activeLoc.lat, activeLoc.lng], 14.5, {
        duration: 1.5,
        easeLinearity: 0.25,
      });
      const activeMarker = markersRef.current[activeLocationId];
      if (activeMarker) {
        activeMarker.openPopup();
      }
    }
  }, [activeLocationId, locations]);

  return (
    <div className="location-map-frame">
      <div ref={mapContainerRef} className="location-map-canvas" />
    </div>
  );
}
