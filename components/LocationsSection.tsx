"use client";
import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { ShopLocation } from "./MapComponent";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const MapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="location-map-frame loading">
      <div className="map-loading-spinner">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="10" />
        </svg>
        <span>Loading Bro'etza Interactive Map...</span>
      </div>
    </div>
  ),
});

const BROETZA_LOCATIONS: ShopLocation[] = [
  {
    id: "gota-jagatpur",
    name: "Bro'etza — Gota / Jagatpur",
    address: "Shop 8, Ground Floor, Savvy Swraj Retail Plaza, New West Zone, Gota, Jagatpur, Ahmedabad - 382481, Gujarat",
    city: "Ahmedabad",
    lat: 23.1065,
    lng: 72.5358,
    phone: "+91 98765 43210",
    hours: "11:00 AM – 11:00 PM Daily",
    status: "Open Now",
    directionsUrl: "https://maps.google.com/?q=Savvy+Swraj+Retail+Plaza+Gota+Ahmedabad",
  },
  {
    id: "mani-nagar",
    name: "Bro'etza — Mani Nagar",
    address: "Ground Floor, Shop 3, Nr. Kankaria Lake / Maninagar Station Road, Maninagar, Ahmedabad - 380008, Gujarat",
    city: "Ahmedabad",
    lat: 22.9974,
    lng: 72.6006,
    phone: "+91 98765 43211",
    hours: "11:00 AM – 11:00 PM Daily",
    status: "Open Now",
    directionsUrl: "https://maps.google.com/?q=Maninagar+Ahmedabad",
  },
  {
    id: "bapunagar",
    name: "Bro'etza — Bapunagar",
    address: "Main Commercial Corridor, Bapunagar, Ahmedabad - 380024, Gujarat",
    city: "Ahmedabad",
    lat: 23.0381,
    lng: 72.6322,
    phone: "+91 98765 43212",
    hours: "Opening Soon",
    status: "Opening Soon",
    directionsUrl: "https://maps.google.com/?q=Bapunagar+Ahmedabad",
  },
];

export default function LocationsSection() {
  const [activeId, setActiveId] = useState<string>("gota-jagatpur");
  const sectionRef = useRef<HTMLElement>(null);

  const activeLocation = BROETZA_LOCATIONS.find((loc) => loc.id === activeId) || BROETZA_LOCATIONS[0];

  // GSAP Entrance Animations with clearProps so elements remain 100% visible
  useGSAP(
    () => {
      gsap.fromTo(
        ".locations-header",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          clearProps: "all",
          scrollTrigger: {
            trigger: ".locations-header",
            start: "top 90%",
          },
        }
      );

      gsap.fromTo(
        ".location-card",
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out",
          clearProps: "all",
          scrollTrigger: {
            trigger: ".location-cards-list",
            start: "top 90%",
          },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section className="locations-section" id="locations" ref={sectionRef}>
      <div className="locations-container">
        {/* Section Header */}
        <div className="locations-header">
          <span className="locations-eyebrow-pill">
            ★ OUR OUTLETS
          </span>
          <h2 className="locations-title">
            VISIT <span>BRO'ETZA</span> IN AHMEDABAD
          </h2>
          <p className="locations-sub">
            Hot, fire-baked 100% Veg pizza served fresh at our store locations. Drop by for dining or order delivery directly to your home.
          </p>
        </div>

        {/* 2-Column Grid Layout */}
        <div className="locations-grid">
          {/* Left Column: Location Cards */}
          <div className="location-cards-list">
            {BROETZA_LOCATIONS.map((loc) => {
              const isActive = loc.id === activeId;
              const isOpen = loc.status === "Open Now";

              return (
                <div
                  key={loc.id}
                  onClick={() => setActiveId(loc.id)}
                  className={`location-card ${isActive ? "active" : ""}`}
                >
                  <div className="card-top-row">
                    <div>
                      <span className={`card-status-badge ${isOpen ? "open" : "soon"}`}>
                        {loc.status}
                      </span>
                      <h3 className="card-shop-name">{loc.name}</h3>
                    </div>
                    <div className="card-arrow-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </div>
                  </div>

                  <p className="card-address">{loc.address}</p>

                  <div className="card-info-row">
                    {loc.hours && (
                      <div className="info-item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 6v6l4 2" />
                        </svg>
                        <span>{loc.hours}</span>
                      </div>
                    )}
                    {loc.phone && (
                      <div className="info-item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                        </svg>
                        <span>{loc.phone}</span>
                      </div>
                    )}
                  </div>

                  <div className="card-actions">
                    <a
                      href={loc.directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="btn-directions"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="3 11 22 2 13 21 11 13 3 11" />
                      </svg>
                      Get Directions
                    </a>
                    {loc.phone && (
                      <a
                        href={`tel:${loc.phone.replace(/\s+/g, "")}`}
                        onClick={(e) => e.stopPropagation()}
                        className="btn-phone"
                        title="Call Store"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Dynamic Leaflet Map Component */}
          <div className="location-map-column">
            <MapComponent
              locations={BROETZA_LOCATIONS}
              activeLocationId={activeId}
              onSelectLocation={(id) => setActiveId(id)}
            />
            <div className="map-caption">
              <span>📍 Active Outlet: <strong>{activeLocation.name}</strong></span>
              <span>Click pins on map to select outlet</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
