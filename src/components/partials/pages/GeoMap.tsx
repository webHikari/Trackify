import React, { useEffect, useState } from "react";
import { WorldMap } from "../charts/WorldMap";
import Trackify from "../../../lib/Trackify";

interface GeoData {
  geoVisits: Array<{
    latitude: number;
    longitude: number;
    country: string;
    city: string;
    visit_count: number;
  }>;
  countryStats: Array<{
    country: string;
    visit_count: number;
  }>;
}

export const GeoMap = () => {
  const [geoData, setGeoData] = useState<GeoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGeoData = async () => {
      try {
        setLoading(true);
        const response = await Trackify.getGeoStatistics();
        setGeoData(response.geoData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching geo data:", err);
        setError("Failed to load geographic data");
        setLoading(false);
      }
    };

    fetchGeoData();
  }, []);

  if (loading) return <div className="loading-state">Loading geographic data...</div>;
  if (error) return <div className="error-state">Error: {error}</div>;
  if (!geoData) return <div className="no-data-state">No geographic data available</div>;

  return (
    <div className="geo-map-page">
      <h1>Geographic Distribution</h1>
      <WorldMap geoData={geoData} height={500} />
    </div>
  );
}; 