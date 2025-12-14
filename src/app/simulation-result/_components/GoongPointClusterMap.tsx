"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";

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

interface GoongPointClusterMapProps {
  mapData: MapData;
  totalHouseholds?: number;
  className?: string;
}

// Point colors theo impact level
const POINT_COLORS = {
  HIGH: {
    bg: "#ef4444", // Red
    border: "#dc2626",
    text: "#ffffff",
  },
  MEDIUM: {
    bg: "#22c55e", // Green
    border: "#16a34a",
    text: "#ffffff",
  },
  LOW: {
    bg: "#3b82f6", // Blue
    border: "#2563eb",
    text: "#ffffff",
  },
} as const;

// Legend colors
const LEGEND_CONFIG = [
  { level: "HIGH", label: "High Impact", color: "bg-red-500" },
  { level: "MEDIUM", label: "Medium Impact", color: "bg-green-500" },
  { level: "LOW", label: "Low Impact", color: "bg-blue-500" },
];

export default function GoongPointClusterMap({
  mapData,
  totalHouseholds = 0,
  className = "",
}: GoongPointClusterMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  // 1️⃣ Load CSS
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://cdn.jsdelivr.net/npm/@goongmaps/goong-js@1.0.9/dist/goong-js.css";

    if (!document.querySelector(`link[href="${link.href}"]`)) {
      document.head.appendChild(link);
    }

    link.onload = () => {
      console.log("✅ Goong CSS loaded");
      setIsMapReady(true);
    };

    setTimeout(() => setIsMapReady(true), 100);
  }, []);

  // 2️⃣ Init map với point markers
  useEffect(() => {
    if (!mapContainer.current || map.current || !isMapReady) return;

    console.log("🗺️ Initializing Point Cluster Map...");

    import("@goongmaps/goong-js").then((goongjs) => {
      const goong = goongjs.default;
      goong.accessToken = process.env.NEXT_PUBLIC_GOONG_MAP_KEY!;

      const mapInstance = new goong.Map({
        container: mapContainer.current!,
        style: "https://tiles.goong.io/assets/goong_map_web.json",
        center: [mapData.center.lng, mapData.center.lat],
        zoom: mapData.zoom,
      });

      mapInstance.on("load", () => {
        console.log("✅ Map loaded - adding point markers...");

        // Generate points từ polygons
        const points = generateImpactPoints(
          mapData.impactZones,
          totalHouseholds,
        );

        // Add markers
        points.forEach((point) => {
          const colors =
            POINT_COLORS[point.level as keyof typeof POINT_COLORS] ||
            POINT_COLORS.MEDIUM;

          // Create custom marker element
          const el = document.createElement("div");
          el.className = "point-marker";
          el.style.cssText = `
            width: ${point.size}px;
            height: ${point.size}px;
            background-color: ${colors.bg};
            border: 3px solid ${colors.border};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: ${colors.text};
            font-weight: 700;
            font-size: ${point.size > 40 ? "16px" : "14px"};
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            transition: transform 0.2s;
          `;
          el.textContent = String(point.count);

          // Hover effect
          el.addEventListener("mouseenter", () => {
            el.style.transform = "scale(1.15)";
            el.style.zIndex = "1000";
          });
          el.addEventListener("mouseleave", () => {
            el.style.transform = "scale(1)";
            el.style.zIndex = "auto";
          });

          // Add marker to map
          new goong.Marker({ element: el })
            .setLngLat([point.lng, point.lat])
            .addTo(mapInstance);
        });

        // Resize map
        setTimeout(() => {
          mapInstance.resize();
        }, 100);
      });

      map.current = mapInstance;
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [isMapReady, mapData, totalHouseholds]);

  // 3️⃣ Zoom controls
  const handleZoomIn = () => {
    if (map.current) {
      map.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (map.current) {
      map.current.zoomOut();
    }
  };

  // 4️⃣ Window resize
  useEffect(() => {
    if (!map.current) return;

    const handleResize = () => {
      map.current.resize();
    };

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

      {/* Legend */}
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

      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
        <Button
          variant="secondary"
          size="icon"
          className="size-10 bg-white hover:bg-neutral-100 shadow-lg"
          onClick={handleZoomIn}
          aria-label="Zoom in"
        >
          <Plus className="size-5" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="size-10 bg-white hover:bg-neutral-100 shadow-lg"
          onClick={handleZoomOut}
          aria-label="Zoom out"
        >
          <Minus className="size-5" />
        </Button>
      </div>
    </div>
  );
}

// Helper: Generate impact points từ polygons
function generateImpactPoints(
  impactZones: ImpactZone[],
  totalHouseholds: number,
) {
  const points: Array<{
    lat: number;
    lng: number;
    level: string;
    count: number;
    size: number;
  }> = [];

  // Distribution weights
  const LEVEL_WEIGHTS = {
    HIGH: 0.5, // 50% of total
    MEDIUM: 0.3, // 30% of total
    LOW: 0.2, // 20% of total
  };

  impactZones.forEach((zone) => {
    const level = zone.level.toUpperCase();
    const coordinates = zone.geometry.coordinates[0];

    // Calculate bounding box
    const lngs = coordinates.map((c) => c[0]);
    const lats = coordinates.map((c) => c[1]);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);

    // Generate points (5-15 points per zone)
    const numPoints = Math.floor(Math.random() * 10) + 5;
    const levelWeight =
      LEVEL_WEIGHTS[level as keyof typeof LEVEL_WEIGHTS] || 0.2;
    const totalForZone = Math.floor(totalHouseholds * levelWeight);

    for (let i = 0; i < numPoints; i++) {
      // Random position trong bounding box
      const lng = minLng + Math.random() * (maxLng - minLng);
      const lat = minLat + Math.random() * (maxLat - minLat);

      // Check if point in polygon
      if (isPointInPolygon([lng, lat], coordinates)) {
        // Random count (1-20 cho small, 20-50 cho medium, 50-100 cho large)
        let count: number;
        let size: number;

        if (level === "HIGH") {
          count = Math.floor(Math.random() * 10) + 5; // 5-15
          size = 50; // Large
        } else if (level === "MEDIUM") {
          count = Math.floor(Math.random() * 15) + 5; // 5-20
          size = 45; // Medium
        } else {
          count = Math.floor(Math.random() * 10) + 2; // 2-12
          size = 40; // Small
        }

        points.push({
          lat,
          lng,
          level,
          count,
          size,
        });
      }
    }
  });

  return points;
}

// Helper: Check point in polygon
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
