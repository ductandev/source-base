"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, Minus } from "lucide-react";

interface ImpactZone {
  level: "HIGH" | "MEDIUM" | "LOW" | string;
  geometry: {
    type: string;
    coordinates: number[][][];
  };
}

interface MapData {
  center: { lat: number; lng: number };
  zoom: number;
  legend: Array<{ level: string; label: string }>;
  impactZones: ImpactZone[];
}

interface GoongHeatmapProps {
  mapData: MapData;
  totalHouseholds?: number;
  className?: string;
}

const LEGEND_CONFIG = [
  { level: "HIGH", label: "High Impact", color: "bg-[#fb2c36]" },
  { level: "MEDIUM", label: "Medium Impact", color: "bg-[#ff6900]" },
  { level: "LOW", label: "Low Impact", color: "bg-[#f0b100]" },
];

export default function GoongHeatmap({
  mapData,
  totalHouseholds = 6104,
  className = "",
}: GoongHeatmapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://cdn.jsdelivr.net/npm/@goongmaps/goong-js@1.0.9/dist/goong-js.css";

    if (!document.querySelector(`link[href="${link.href}"]`)) {
      document.head.appendChild(link);
    }

    link.onload = () => setIsMapReady(true);
    setTimeout(() => setIsMapReady(true), 100);
  }, []);

  useEffect(() => {
    if (!mapContainer.current || map.current || !isMapReady) return;

    console.log("🗺️ Initializing Goong Heatmap...");

    import("@goongmaps/goong-js").then((goongjs) => {
      const goong = goongjs.default;
      goong.accessToken =
        process.env.NEXT_PUBLIC_GOONG_MAP_KEY || "YOUR_API_KEY";

      const mapInstance = new goong.Map({
        container: mapContainer.current!,
        style: "https://tiles.goong.io/assets/goong_map_web.json",
        center: [mapData.center.lng, mapData.center.lat],
        zoom: mapData.zoom,
      });

      mapInstance.on("load", () => {
        console.log("✅ Map loaded - adding heatmap layer...");

        // Generate heatmap data points from impact zones
        const heatmapData = generateHeatmapData(
          mapData.impactZones,
          totalHouseholds,
        );

        // Add source
        mapInstance.addSource("impact-heatmap", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: heatmapData,
          },
        });

        // Add heatmap layer
        mapInstance.addLayer({
          id: "impact-heatmap-layer",
          type: "heatmap",
          source: "impact-heatmap",
          maxzoom: 15,
          paint: {
            // Increase weight as diameter increases
            "heatmap-weight": [
              "interpolate",
              ["linear"],
              ["get", "intensity"],
              0,
              0,
              6,
              1,
            ],
            // Increase intensity as zoom level increases
            "heatmap-intensity": [
              "interpolate",
              ["linear"],
              ["zoom"],
              0,
              1,
              15,
              3,
            ],
            // Color ramp for heatmap (yellow -> orange -> red)
            "heatmap-color": [
              "interpolate",
              ["linear"],
              ["heatmap-density"],
              0,
              "rgba(240, 177, 0, 0)",
              0.2,
              "rgba(240, 177, 0, 0.5)",
              0.4,
              "rgba(255, 105, 0, 0.6)",
              0.6,
              "rgba(251, 44, 54, 0.7)",
              0.8,
              "rgba(251, 44, 54, 0.9)",
              1,
              "rgba(220, 38, 38, 1)",
            ],
            // Adjust radius by zoom level
            "heatmap-radius": [
              "interpolate",
              ["linear"],
              ["zoom"],
              0,
              2,
              9,
              20,
              15,
              40,
            ],
            // Transition from heatmap to circle layer by zoom level
            "heatmap-opacity": [
              "interpolate",
              ["linear"],
              ["zoom"],
              7,
              1,
              14,
              0.5,
              15,
              0,
            ],
          },
        });

        // Add circle layer for individual points when zoomed in
        mapInstance.addLayer({
          id: "impact-points",
          type: "circle",
          source: "impact-heatmap",
          minzoom: 13,
          paint: {
            "circle-radius": [
              "interpolate",
              ["linear"],
              ["get", "intensity"],
              1,
              8,
              3,
              15,
              6,
              25,
            ],
            "circle-color": [
              "interpolate",
              ["linear"],
              ["get", "intensity"],
              1,
              "#f0b100",
              3,
              "#ff6900",
              6,
              "#fb2c36",
            ],
            "circle-stroke-color": "white",
            "circle-stroke-width": 2,
            "circle-opacity": [
              "interpolate",
              ["linear"],
              ["zoom"],
              13,
              0,
              14,
              0.7,
              15,
              1,
            ],
          },
        });

        // Add labels for points when zoomed in
        mapInstance.addLayer({
          id: "impact-labels",
          type: "symbol",
          source: "impact-heatmap",
          minzoom: 14,
          layout: {
            "text-field": ["get", "count"],
            "text-font": ["Roboto Bold", "Arial Unicode MS Bold"],
            "text-size": 12,
          },
          paint: {
            "text-color": "#ffffff",
            "text-opacity": ["interpolate", ["linear"], ["zoom"], 14, 0, 15, 1],
          },
        });

        setTimeout(() => mapInstance.resize(), 100);
      });

      map.current = mapInstance;
    });

    return () => {
      if (map.current) map.current.remove();
    };
  }, [isMapReady, mapData, totalHouseholds]);

  const handleZoomIn = () => {
    if (map.current) map.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (map.current) map.current.zoomOut();
  };

  useEffect(() => {
    if (!map.current) return;
    const handleResize = () => map.current.resize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div
        ref={mapContainer}
        className="absolute inset-0"
        style={{
          width: "100%",
          height: "100%",
          minHeight: "271px",
        }}
      />

      <div className="absolute top-4 left-4 bg-white rounded-xl p-4 shadow-lg z-10">
        <div className="space-y-3">
          {LEGEND_CONFIG.map((item) => (
            <div key={item.level} className="flex items-center gap-3">
              <div className={`size-6 rounded-full ${item.color} shadow-md`} />
              <span className="text-sm font-semibold text-neutral-900">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
        <button
          className="size-10 bg-white hover:bg-neutral-100 shadow-lg rounded-lg flex items-center justify-center transition-colors"
          onClick={handleZoomIn}
          aria-label="Zoom in"
        >
          <Plus className="size-5" />
        </button>
        <button
          className="size-10 bg-white hover:bg-neutral-100 shadow-lg rounded-lg flex items-center justify-center transition-colors"
          onClick={handleZoomOut}
          aria-label="Zoom out"
        >
          <Minus className="size-5" />
        </button>
      </div>
    </div>
  );
}

function generateHeatmapData(
  impactZones: ImpactZone[],
  totalHouseholds: number,
) {
  const features: any[] = [];

  const LEVEL_WEIGHTS = {
    HIGH: 0.5,
    MEDIUM: 0.3,
    LOW: 0.2,
  };

  const LEVEL_INTENSITY = {
    HIGH: 6,
    MEDIUM: 4,
    LOW: 2,
  };

  impactZones.forEach((zone) => {
    const level = zone.level.toUpperCase() as keyof typeof LEVEL_WEIGHTS;
    const coordinates = zone.geometry.coordinates[0];

    const lngs = coordinates.map((c) => c[0]);
    const lats = coordinates.map((c) => c[1]);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);

    // Generate more points for higher impact zones
    const gridSize = level === "HIGH" ? 8 : level === "MEDIUM" ? 6 : 4;
    const stepLng = (maxLng - minLng) / (gridSize + 1);
    const stepLat = (maxLat - minLat) / (gridSize + 1);

    const levelWeight = LEVEL_WEIGHTS[level] || 0.2;
    const totalForZone = Math.floor(totalHouseholds * levelWeight);
    const avgPerPoint = Math.floor(totalForZone / (gridSize * gridSize)) || 1;

    for (let i = 1; i <= gridSize; i++) {
      for (let j = 1; j <= gridSize; j++) {
        const lng = minLng + i * stepLng;
        const lat = minLat + j * stepLat;

        if (isPointInPolygon([lng, lat], coordinates)) {
          const seed = Math.floor((lng + lat) * 1000) % 5;
          const count = Math.max(1, avgPerPoint + seed);
          const intensity = LEVEL_INTENSITY[level] || 2;

          features.push({
            type: "Feature",
            properties: {
              level: level,
              count: count,
              intensity: intensity,
            },
            geometry: {
              type: "Point",
              coordinates: [lng, lat],
            },
          });
        }
      }
    }
  });

  return features;
}

function isPointInPolygon(point: number[], polygon: number[][]) {
  const [x, y] = point;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];

    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

    if (intersect) inside = !inside;
  }

  return inside;
}
