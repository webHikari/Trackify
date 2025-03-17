import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './WorldMap.css';

import 'leaflet.heat';

// Update the declaration to properly extend L namespace
declare global {
  namespace L {
    function heatLayer(latlngs: Array<[number, number, number]>, options?: any): any;
  }
}

interface GeoVisit {
  latitude: number;
  longitude: number;
  country: string;
  city: string;
  visit_count: number;
}

interface CountryStats {
  country: string;
  visit_count: number;
}

interface WorldMapProps {
  geoData: {
    geoVisits: GeoVisit[];
    countryStats: CountryStats[];
  };
  height?: number;
  mapColors?: {
    land?: string;
    water?: string;
    borders?: string;
  };
}

export const WorldMap: React.FC<WorldMapProps> = ({
  geoData,
  height = 500,
  
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const heatLayer = useRef<any>(null);
  const [mapInitialized, setMapInitialized] = useState(false);

  useEffect(() => {
    if (!mapRef.current) return;

    if (!leafletMap.current) {
      leafletMap.current = L.map(mapRef.current, {
        attributionControl: false,
        zoomControl: true
      }).setView([20, 0], 2);
      
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 18,
        minZoom: 2,
        className: 'map-tiles-custom'
      }).addTo(leafletMap.current);

      setMapInitialized(true);
    }

    return () => {};
  }, []);

  useEffect(() => {
    if (!leafletMap.current || !mapInitialized || !geoData?.geoVisits?.length) return;
  
    if (heatLayer.current) {
      leafletMap.current.removeLayer(heatLayer.current);
    }
  
    // Формат: [lat, lng, intensity]
    const heatData = geoData.geoVisits.map(visit => {
      const lat = parseFloat(visit.latitude.toString());
      const lng = parseFloat(visit.longitude.toString());
      const intensity = parseInt(visit.visit_count.toString());
      
      if (isNaN(lat) || isNaN(lng)) return null;
      
      return [lat, lng, intensity];
    }).filter(point => point !== null);

    heatLayer.current = L.heatLayer(heatData as [number, number, number][], {
      radius: 25,                // Радиус точек тепловой карты
      blur: 15,                  // Размытие
      maxZoom: 10,               // Максимальный зум для отображения тепловой карты
      max: 1.0,                  // Максимальная интенсивность
      gradient: {                // Настройка градиента цветов
        0.0: 'blue',
        0.25: 'lime',
        0.5: 'yellow',
        0.75: 'orange',
        1.0: 'red'
      }
    }).addTo(leafletMap.current);
    
    const topVisits = [...geoData.geoVisits]
      .sort((a, b) => parseInt(b.visit_count.toString()) - parseInt(a.visit_count.toString()))
      .slice(0, 10);
    
    topVisits.forEach(visit => {
      const lat = parseFloat(visit.latitude.toString());
      const lng = parseFloat(visit.longitude.toString());
      
      if (isNaN(lat) || isNaN(lng)) return;
      
      
      const icon = L.divIcon({
        className: 'city-label',
        html: `<div class="city-label-text">${visit.city}</div>`,
        iconSize: [100, 20],
        iconAnchor: [50, 10]
      });
      
      L.marker([lat, lng], { icon })
        .addTo(leafletMap.current!)
        .bindPopup(`${visit.city}, ${visit.country}: ${visit.visit_count} visits`);
    });
  
    if (leafletMap.current) {
      leafletMap.current.invalidateSize();
    }
  }, [geoData, mapInitialized]);

  useEffect(() => {
    if (leafletMap.current && mapInitialized) {
      setTimeout(() => {
        leafletMap.current?.invalidateSize();
      }, 100);
    }
  }, [height, mapInitialized]);

  return (
    <div className="world-map-container" style={{ height: `${height + 200}px` }}>
      {!geoData?.geoVisits?.length ? (
        <div className="no-data-message">No geo data available</div>
      ) : (
        <div className="map-wrapper">
          <div className="world-map" style={{ height: `${height}px` }}>
            <div ref={mapRef} style={{ height: '100%', width: '100%' }}></div>
          </div>
          
          <div className="country-stats">
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Country</th>
                  <th>Visits</th>
                </tr>
              </thead>
              <tbody>
                {geoData.countryStats.map((stat, index) => (
                  <tr key={`country-${index}`}>
                    <td>{stat.country}</td>
                    <td>{stat.visit_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};