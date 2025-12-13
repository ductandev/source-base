"use client";

import { useState, useCallback, useEffect } from "react";
import {
  MapPin,
  Crosshair,
  Plus,
  Minus,
  Locate,
  Navigation,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useGeolocation } from "../hooks/useGeolocation";
import { useMapControls } from "../hooks/useMapControls";
import type { LocationData, Coordinates, Place } from "@/types/simulation";
import {
  DEFAULT_LOCATION,
  SAMPLE_RECENT_PLACES,
  SAMPLE_SAVED_PLACES,
} from "@/app/simulation-picker/hooks/constants";
import { GoongMapView } from "@/app/simulation-picker/_components/GoongMapView";
import { GoongPrediction, goongService } from "@/api/simulation/goong-service";
import { useGoongAutocomplete } from "@/api/simulation/useGoong";

export default function LocationPickerWithGoong() {
  const [location, setLocation] = useState<LocationData>(DEFAULT_LOCATION);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const {
    coordinates: geoCoordinates,
    loading: geoLoading,
    getCurrentLocation,
  } = useGeolocation();

  const { config, zoomIn, zoomOut, setCenter, setZoom } = useMapControls({
    center: location.coordinates,
    zoom: 15,
  });

  const { data: searchResults, isLoading: isSearching } = useGoongAutocomplete(
    searchQuery,
    searchQuery.length >= 2,
  );

  useEffect(() => {
    setCenter(location.coordinates);
  }, [location.coordinates, setCenter]);

  const handleLocationSelect = useCallback(
    async (prediction: GoongPrediction) => {
      const placeDetail = await goongService.getPlaceDetail(
        prediction.place_id,
      );

      if (placeDetail) {
        const newLocation: LocationData = {
          address: placeDetail.formatted_address,
          coordinates: {
            lat: placeDetail.geometry.location.lat,
            lng: placeDetail.geometry.location.lng,
          },
          placeId: placeDetail.place_id,
          formatted: placeDetail.formatted_address,
        };

        setLocation(newLocation);
        setCenter(newLocation.coordinates);
        setZoom(16);
        setSearchQuery("");
        setIsSearchFocused(false);
      }
    },
    [setCenter, setZoom],
  );

  const handlePlaceSelect = useCallback(
    (place: Place) => {
      const newLocation: LocationData = {
        address: place.address,
        coordinates: place.coordinates,
      };
      setLocation(newLocation);
      setCenter(place.coordinates);
      setZoom(16);
    },
    [setCenter, setZoom],
  );

  const handleConfirmLocation = useCallback(() => {
    console.log("Location confirmed:", location);
  }, [location]);

  const handleUseCurrentLocation = useCallback(async () => {
    if (geoCoordinates) {
      const place = await goongService.reverseGeocode(
        geoCoordinates.lat,
        geoCoordinates.lng,
      );

      const newLocation: LocationData = {
        address: place?.formatted_address || "Vị trí hiện tại",
        coordinates: geoCoordinates,
        placeId: place?.place_id,
        formatted: place?.formatted_address,
      };

      setLocation(newLocation);
      setCenter(geoCoordinates);
      setZoom(16);
    } else {
      getCurrentLocation();
    }
  }, [geoCoordinates, getCurrentLocation, setCenter, setZoom]);

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="h-screen flex">
        {/* Sidebar */}
        <aside className="w-[420px] bg-white border-r border-neutral-200 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-neutral-100">
            <h1 className="text-2xl font-semibold text-neutral-900 mb-4">
              Location Picker
            </h1>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
              <Input
                type="text"
                placeholder="Search address, coordinates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                className="pl-9 h-10 bg-neutral-50 border-neutral-200"
              />
            </div>

            {/* Search Results Dropdown */}
            {isSearchFocused && searchQuery.length >= 2 && (
              <div className="absolute left-6 right-6 mt-2 bg-white rounded-lg shadow-xl border border-neutral-200 max-h-64 overflow-y-auto z-50">
                {isSearching && (
                  <div className="p-4 text-center text-sm text-neutral-500">
                    Đang tìm kiếm...
                  </div>
                )}
                {!isSearching && searchResults && searchResults.length > 0 && (
                  <div className="py-2">
                    {searchResults.map((result, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleLocationSelect(result)}
                        className="w-full px-4 py-2 text-left hover:bg-neutral-50 transition-colors"
                      >
                        <p className="text-sm font-medium text-neutral-900">
                          {result.structured_formatting.main_text}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {result.structured_formatting.secondary_text}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
                {!isSearching &&
                  searchResults &&
                  searchResults.length === 0 && (
                    <div className="p-4 text-center text-sm text-neutral-500">
                      Không tìm thấy kết quả
                    </div>
                  )}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Current Location */}
            <div>
              <Card className="border-neutral-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="bg-red-50 rounded-full p-2">
                      <MapPin className="size-5 text-red-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-neutral-900 mb-1">
                        Current Location
                      </h3>
                      <p className="text-sm text-neutral-600">
                        {location.address}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-neutral-100">
                    <div>
                      <p className="text-xs text-neutral-500 mb-1">Latitude</p>
                      <p className="text-sm font-medium text-neutral-900">
                        {location.coordinates.lat.toFixed(4)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 mb-1">Longitude</p>
                      <p className="text-sm font-medium text-neutral-900">
                        {location.coordinates.lng.toFixed(4)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Locations */}
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 mb-3">
                Recent Locations
              </h3>
              <div className="space-y-2">
                {SAMPLE_RECENT_PLACES.map((place) => (
                  <button
                    key={place.id}
                    onClick={() => handlePlaceSelect(place)}
                    className="w-full text-left p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300 transition-all"
                  >
                    <p className="text-sm font-medium text-neutral-900">
                      {place.name}
                    </p>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {place.address}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Saved Places */}
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 mb-3">
                Saved Places
              </h3>
              <div className="space-y-2">
                {SAMPLE_SAVED_PLACES.map((place) => (
                  <button
                    key={place.id}
                    className="w-full flex items-center gap-3 p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300 transition-all"
                  >
                    <div
                      className={`size-10 rounded-full flex items-center justify-center ${
                        place.category === "home"
                          ? "bg-blue-100"
                          : "bg-purple-100"
                      }`}
                    >
                      {place.category === "home" ? (
                        <Navigation className="size-5 text-blue-600" />
                      ) : (
                        <MapPin className="size-5 text-purple-600" />
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-neutral-900">
                        {place.name}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {place.address}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-neutral-200">
            <Button
              onClick={handleConfirmLocation}
              className="w-full h-12 bg-[#94ce9a] hover:bg-[#7db882] text-neutral-900 font-medium"
              size="lg"
            >
              <MapPin className="size-5 mr-2" />
              Confirm Location
            </Button>
          </div>
        </aside>

        {/* Map Area */}
        <main className="flex-1 relative">
          <GoongMapView
            coordinates={config.center}
            zoom={config.zoom}
            showMarker
          />

          {/* Map Controls */}
          <div className="absolute right-4 top-4 flex flex-col gap-2 z-10">
            <Button
              variant="secondary"
              size="icon"
              className="size-10 bg-white hover:bg-neutral-100 shadow-md border-0"
              onClick={zoomIn}
            >
              <Plus className="size-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="size-10 bg-white hover:bg-neutral-100 shadow-md border-0"
              onClick={zoomOut}
            >
              <Minus className="size-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="size-10 bg-white hover:bg-neutral-100 shadow-md border-0"
              onClick={() => {
                setCenter(location.coordinates);
                setZoom(15);
              }}
            >
              <Crosshair className="size-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="size-10 bg-white hover:bg-neutral-100 shadow-md border-0"
              onClick={handleUseCurrentLocation}
              disabled={geoLoading}
            >
              <Locate className="size-5" />
            </Button>
          </div>

          {/* Coordinates Display */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md border border-neutral-200 z-10">
            <p className="text-xs text-neutral-600">
              Lat: {location.coordinates.lat.toFixed(6)} | Lng:{" "}
              {location.coordinates.lng.toFixed(6)}
            </p>
          </div>
        </main>
      </div>

      {/* Click outside to close search */}
      {isSearchFocused && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsSearchFocused(false)}
        />
      )}
    </div>
  );
}
