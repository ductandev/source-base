"use client";

import { useEffect, useRef } from "react";
import goongjs from "@goongmaps/goong-js";
import type { LocationData } from "@/types/simulation";

interface GoongMapProps {
  location: LocationData;
  onChangeLocation: (setLocation: LocationData) => void;
  onMapReady?: (map: InstanceType<typeof goongjs.Map>) => void;
}

export default function GoongMap({
  location,
  onChangeLocation,
}: GoongMapProps) {
  const mapRef = useRef<InstanceType<typeof goongjs.Map> | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const markerRef = useRef<InstanceType<typeof goongjs.Marker> | null>(null);

  // 1️⃣ Init map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    goongjs.accessToken = process.env.NEXT_PUBLIC_GOONG_MAP_KEY!;

    const map = new goongjs.Map({
      container: containerRef.current,
      style: "https://tiles.goong.io/assets/goong_map_web.json",
      center: [location.coordinates.lng, location.coordinates.lat],
      zoom: 14,
    });

    // Marker ở tâm
    const marker = new goongjs.Marker({ color: "#ef4444" })
      .setLngLat([location.coordinates.lng, location.coordinates.lat])
      .addTo(map);

    mapRef.current = map;
    markerRef.current = marker;

    // 2️⃣ Kéo map → lấy lat/lng tâm
    map.on("moveend", () => {
      const center = map.getCenter();

      marker.setLngLat(center);

      onChangeLocation({
        address: "Selected location",
        coordinates: {
          lat: center.lat,
          lng: center.lng,
        },
      });
    });

    return () => {
      map.remove();
    };
  }, []);

  // 3️⃣ Khi location thay đổi từ bên ngoài (search / current location)
  useEffect(() => {
    if (!mapRef.current || !markerRef.current) return;

    mapRef.current.flyTo({
      center: [location.coordinates.lng, location.coordinates.lat],
      zoom: 15,
    });

    markerRef.current.setLngLat([
      location.coordinates.lng,
      location.coordinates.lat,
    ]);
  }, [location.coordinates.lat, location.coordinates.lng]);

  return <div ref={containerRef} className="absolute inset-0" />;
}
