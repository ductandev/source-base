"use client";

import { useEffect, useRef, useState } from "react";
import type { LocationData } from "@/types/simulation";
import "./goong-map.css";

interface GoongMapProps {
  location: LocationData;
  onChangeLocation: (setLocation: LocationData) => void;
}

export default function GoongMap({
  location,
  onChangeLocation,
}: GoongMapProps) {
  const mapRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const markerRef = useRef<any>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  // Track để tránh infinite loop
  const isUserInteracting = useRef(false);
  const isProgrammaticMove = useRef(false);
  const locationRef = useRef(location);

  // 1️⃣ Load CSS TRƯỚC - CHỈ 1 LẦN
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://cdn.jsdelivr.net/npm/@goongmaps/goong-js@1.0.9/dist/goong-js.css";

    if (!document.querySelector(`link[href="${link.href}"]`)) {
      document.head.appendChild(link);
    }

    // Đợi CSS load xong
    link.onload = () => {
      console.log("✅ Goong CSS loaded");
      setIsMapReady(true);
    };

    // Fallback nếu CSS đã có sẵn
    setTimeout(() => setIsMapReady(true), 100);
  }, []);

  // 2️⃣ Init map SAU KHI CSS đã load
  useEffect(() => {
    if (!containerRef.current || mapRef.current || !isMapReady) return;

    console.log("🗺️ Initializing Goong Map...");

    import("@goongmaps/goong-js").then((goongjs) => {
      const goong = goongjs.default;
      goong.accessToken = process.env.NEXT_PUBLIC_GOONG_MAP_KEY!;

      const map = new goong.Map({
        container: containerRef.current!,
        style: "https://tiles.goong.io/assets/goong_map_web.json",
        center: [location.coordinates.lng, location.coordinates.lat],
        zoom: 14,
      });

      // ⚠️ CRITICAL: Resize map sau khi load xong
      map.on("load", () => {
        console.log("✅ Map loaded - resizing...");
        setTimeout(() => {
          map.resize();
        }, 100);
      });

      const marker = new goong.Marker({ color: "#ef4444" })
        .setLngLat([location.coordinates.lng, location.coordinates.lat])
        .addTo(map);

      mapRef.current = map;
      markerRef.current = marker;

      // Track user interaction
      map.on("dragstart", () => {
        isUserInteracting.current = true;
        isProgrammaticMove.current = false;
      });

      map.on("zoomstart", () => {
        if (!isProgrammaticMove.current) {
          isUserInteracting.current = true;
        }
      });

      // CHỈ GỌI onChangeLocation KHI USER KÉO MAP
      map.on("moveend", () => {
        // Bỏ qua nếu là programmatic move
        if (isProgrammaticMove.current) {
          isProgrammaticMove.current = false;
          isUserInteracting.current = false;
          return;
        }

        // CHỈ xử lý khi user thực sự kéo map
        if (!isUserInteracting.current) return;

        const center = map.getCenter();
        marker.setLngLat(center);

        const newLocation = {
          address: "Selected location",
          coordinates: {
            lat: center.lat,
            lng: center.lng,
          },
        };

        locationRef.current = newLocation;
        onChangeLocation(newLocation);

        isUserInteracting.current = false;
      });
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [isMapReady]); // Chỉ init khi CSS ready

  // 3️⃣ Update map khi location thay đổi từ SEARCH/CURRENT LOCATION
  useEffect(() => {
    if (!mapRef.current || !markerRef.current) return;

    const latDiff = Math.abs(
      locationRef.current.coordinates.lat - location.coordinates.lat,
    );
    const lngDiff = Math.abs(
      locationRef.current.coordinates.lng - location.coordinates.lng,
    );

    // Chỉ update nếu thay đổi > 0.0001 độ (~11m)
    if (latDiff > 0.0001 || lngDiff > 0.0001) {
      locationRef.current = location;
      isProgrammaticMove.current = true;

      mapRef.current.flyTo({
        center: [location.coordinates.lng, location.coordinates.lat],
        zoom: 15,
        essential: true,
      });

      markerRef.current.setLngLat([
        location.coordinates.lng,
        location.coordinates.lat,
      ]);
    }
  }, [location.coordinates.lat, location.coordinates.lng]);

  // 4️⃣ Handle window resize
  useEffect(() => {
    if (!mapRef.current) return;

    const handleResize = () => {
      console.log("📐 Window resized - resizing map...");
      mapRef.current.resize();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0"
      style={{
        width: "100%",
        height: "100%",
        minHeight: "400px",
      }}
    />
  );
}
