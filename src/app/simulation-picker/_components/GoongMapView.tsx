"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import type { Coordinates } from "@/types/simulation";
import { goongService } from "@/api/simulation/goong-service";

interface GoongMapViewProps {
  coordinates: Coordinates;
  zoom?: number;
  showMarker?: boolean;
  className?: string;
}

export function GoongMapView({
  coordinates,
  zoom = 15,
  showMarker = true,
  className = "",
}: GoongMapViewProps) {
  const [isLoading, setIsLoading] = useState(true);

  const mapUrl = goongService.getMapEmbedUrl(
    coordinates.lat,
    coordinates.lng,
    zoom,
  );

  useEffect(() => {
    setIsLoading(true);
    // Simulate loading time for iframe
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [coordinates, zoom]);

  return (
    <div className={`relative w-full h-full ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-neutral-100 flex items-center justify-center z-10">
          <div className="text-center">
            <Loader2 className="size-8 text-[#94ce9a] animate-spin mx-auto mb-2" />
            <p className="text-sm text-neutral-600">Đang tải bản đồ...</p>
          </div>
        </div>
      )}

      <iframe
        src={mapUrl}
        width="100%"
        height="100%"
        className="border-0"
        loading="lazy"
        onLoad={() => setIsLoading(false)}
        title="Goong Map"
      />
    </div>
  );
}

/**
 * Static Map View - Using static image instead of interactive map
 * Useful for thumbnails or previews
 */
interface GoongStaticMapProps {
  coordinates: Coordinates;
  zoom?: number;
  width?: number;
  height?: number;
  showMarker?: boolean;
  className?: string;
}

export function GoongStaticMap({
  coordinates,
  zoom = 15,
  width = 600,
  height = 400,
  showMarker = true,
  className = "",
}: GoongStaticMapProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const mapUrl = goongService.getStaticMapUrl(
    coordinates.lat,
    coordinates.lng,
    zoom,
    width,
    height,
    showMarker,
  );

  return (
    <div className={`relative ${className}`}>
      {isLoading && !hasError && (
        <div
          className="absolute inset-0 bg-neutral-100 flex items-center justify-center"
          style={{ width, height }}
        >
          <Loader2 className="size-6 text-[#94ce9a] animate-spin" />
        </div>
      )}

      {hasError && (
        <div
          className="absolute inset-0 bg-neutral-100 flex items-center justify-center"
          style={{ width, height }}
        >
          <p className="text-sm text-neutral-500">Không thể tải bản đồ</p>
        </div>
      )}

      <img
        src={mapUrl}
        alt="Static map"
        width={width}
        height={height}
        className={`${isLoading || hasError ? "opacity-0" : "opacity-100"} transition-opacity`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
    </div>
  );
}
