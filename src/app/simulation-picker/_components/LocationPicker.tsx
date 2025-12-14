"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  Search,
  MapPin,
  Crosshair,
  Locate,
  X,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import GoongMap from "./GoongMap";
import { useGeolocation } from "../hooks/useGeolocation";
import { LocationData } from "@/types/simulation";
import { useGoongAutocomplete } from "@/api/simulation/useGoong";
import { goongService, GoongPrediction } from "@/api/simulation/goong-service";
import { useDebounce } from "@/app/simulation-picker/hooks/useDebounce";
import { useLocationStore as useWeatherLocationStore } from "@/stores/locationStore";
import BackButton from "@/common/back-button";
import { ROUTES } from "@/utils/routes";
import BackMobileButton from "@/common/back-button-custom";
import { useRouter } from "next/navigation";

// Convert Weather LocationData to Simulation LocationData
function convertWeatherToSimulationLocation(
  weatherLocation: any,
): LocationData | null {
  if (!weatherLocation) return null;

  return {
    address: weatherLocation.displayName || weatherLocation.name,
    coordinates: {
      lat: weatherLocation.lat,
      lng: weatherLocation.lon,
    },
  };
}

// Convert Simulation LocationData to Weather LocationData
function convertSimulationToWeatherLocation(
  simLocation: LocationData,
  placeDetail?: any,
) {
  // Parse address để lấy name
  const addressParts = simLocation.address.split(",");
  const name = addressParts[0]?.trim() || simLocation.address;

  return {
    name: name,
    country: placeDetail?.country || "VN",
    countryCode: placeDetail?.country || "VN",
    state:
      placeDetail?.compound?.province || addressParts[1]?.trim() || undefined,
    lat: simLocation.coordinates.lat,
    lon: simLocation.coordinates.lng,
    displayName: simLocation.address,
    localNames: placeDetail?.local_names || undefined,
  };
}

export default function LocationPicker() {
  // ⚠️ CRITICAL: Lấy location từ weather locationStore (đã lưu từ home)
  const {
    locationData: weatherLocationData,
    setSelectedLocation: setWeatherLocation,
  } = useWeatherLocationStore();

  // Convert và set initial location
  const initialLocation = convertWeatherToSimulationLocation(
    weatherLocationData,
  ) || {
    address: "Tân Bình, Viet Nam",
    coordinates: { lat: 12.7106, lng: 108.2183 },
  };

  const [location, setLocation] = useState<LocationData>(initialLocation);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [lastPlaceDetail, setLastPlaceDetail] = useState<any>(null);

  const debouncedQuery = useDebounce(searchQuery, 800);

  const router = useRouter();

  const {
    coordinates: currentCoords,
    loading: geoLoading,
    getCurrentLocation,
  } = useGeolocation();

  // Search autocomplete
  const { data: searchResults, isLoading: isLoadingSearch } =
    useGoongAutocomplete(
      debouncedQuery,
      debouncedQuery.length >= 3 && isSearching,
    );

  const reverseGeocodeTimeout = useRef<NodeJS.Timeout | null>(null);
  const lastReverseGeocodeTime = useRef<number>(0);
  const MIN_REVERSE_GEOCODE_INTERVAL = 2000;

  // ⚠️ DEBOUNCED reverse geocode
  const handleLocationChange = useCallback(
    async (newLocation: LocationData) => {
      setLocation(newLocation);

      if (reverseGeocodeTimeout.current) {
        clearTimeout(reverseGeocodeTimeout.current);
      }

      reverseGeocodeTimeout.current = setTimeout(async () => {
        const now = Date.now();
        const timeSinceLastCall = now - lastReverseGeocodeTime.current;

        if (timeSinceLastCall < MIN_REVERSE_GEOCODE_INTERVAL) {
          console.log("⏱️ Rate limited - skipping reverse geocode");
          return;
        }

        try {
          lastReverseGeocodeTime.current = now;
          console.log("🌍 Calling reverse geocode API...");

          const place = await goongService.reverseGeocode(
            newLocation.coordinates.lat,
            newLocation.coordinates.lng,
          );

          if (place) {
            setLocation({
              address: place.formatted_address,
              coordinates: newLocation.coordinates,
            });
            setLastPlaceDetail(place);
          }
        } catch (error) {
          console.error("Reverse geocode error:", error);
        }
      }, 2000);
    },
    [],
  );

  // Handle search select
  const handleSelectPlace = useCallback(async (prediction: GoongPrediction) => {
    setSearchQuery(prediction.description);
    setIsSearching(false);

    try {
      const place = await goongService.getPlaceDetail(prediction.place_id);
      if (place) {
        setLocation({
          address: place.formatted_address,
          coordinates: {
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng,
          },
        });
        setLastPlaceDetail(place);
      }
    } catch (error) {
      console.error("Get place detail error:", error);
    }
  }, []);

  // Handle current location
  const handleUseCurrentLocation = useCallback(async () => {
    if (currentCoords) {
      try {
        const place = await goongService.reverseGeocode(
          currentCoords.lat,
          currentCoords.lng,
        );
        setLocation({
          address: place?.formatted_address || "Current Location",
          coordinates: currentCoords,
        });
      } catch (error) {
        setLocation({
          address: "Current Location",
          coordinates: currentCoords,
        });
      }
    } else {
      getCurrentLocation();
    }
  }, [currentCoords, getCurrentLocation]);

  const handleConfirmLocation = useCallback(() => {
    // Convert và lưu vào weather location store
    const weatherLocationData = convertSimulationToWeatherLocation(
      location,
      lastPlaceDetail,
    );
    // Lưu vào store
    setWeatherLocation(weatherLocationData.name, weatherLocationData);

    // Navigate to simulation config
    router.push(ROUTES.SIMULATION_CONFIG);
  }, [location, lastPlaceDetail, setWeatherLocation, router]);

  const handleRecenter = useCallback(() => {
    setLocation({ ...location });
  }, [location]);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Mobile Layout */}
      <div className="lg:hidden">
        <MobileLayout
          location={location}
          searchQuery={searchQuery}
          onSearchChange={(query) => {
            setSearchQuery(query);
            setIsSearching(query.length >= 3);
          }}
          onLocationChange={handleLocationChange}
          onConfirm={handleConfirmLocation}
          onRecenter={handleRecenter}
          onUseCurrentLocation={handleUseCurrentLocation}
          geoLoading={geoLoading}
          searchResults={searchResults || []}
          isLoadingSearch={isLoadingSearch}
          isSearching={isSearching}
          onSelectPlace={handleSelectPlace}
          onClearSearch={() => {
            setSearchQuery("");
            setIsSearching(false);
          }}
        />
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <DesktopLayout
          location={location}
          searchQuery={searchQuery}
          onSearchChange={(query) => {
            setSearchQuery(query);
            setIsSearching(query.length >= 3);
          }}
          onLocationChange={handleLocationChange}
          onConfirm={handleConfirmLocation}
          onRecenter={handleRecenter}
          onUseCurrentLocation={handleUseCurrentLocation}
          geoLoading={geoLoading}
          searchResults={searchResults || []}
          isLoadingSearch={isLoadingSearch}
          isSearching={isSearching}
          onSelectPlace={handleSelectPlace}
          onClearSearch={() => {
            setSearchQuery("");
            setIsSearching(false);
          }}
        />
      </div>
    </div>
  );
}

interface LayoutProps {
  location: LocationData;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onLocationChange: (location: LocationData) => void;
  onConfirm: () => void;
  onRecenter: () => void;
  onUseCurrentLocation: () => void;
  geoLoading: boolean;
  searchResults: GoongPrediction[];
  isLoadingSearch: boolean;
  isSearching: boolean;
  onSelectPlace: (place: GoongPrediction) => void;
  onClearSearch: () => void;
}

function MobileLayout({
  location,
  searchQuery,
  onSearchChange,
  onLocationChange,
  onConfirm,
  onRecenter,
  onUseCurrentLocation,
  geoLoading,
  searchResults,
  isLoadingSearch,
  isSearching,
  onSelectPlace,
  onClearSearch,
}: LayoutProps) {
  return (
    <div className="relative h-screen flex flex-col">
      {/* Map Container */}
      <div className="relative flex-1">
        <GoongMap location={location} onChangeLocation={onLocationChange} />

        {/* Search Bar - Floating */}
        <div className="absolute top-4 left-4 right-4 z-10">
          <SearchBar
            value={searchQuery}
            onChange={onSearchChange}
            onClear={onClearSearch}
          />
          {isSearching && (
            <SearchResults
              results={searchResults}
              isLoading={isLoadingSearch}
              onSelect={onSelectPlace}
            />
          )}
        </div>

        {/* Center Pin Indicator */}
        <CenterPinIndicator />

        {/* Map Controls - Floating */}
        <MapControls
          onRecenter={onRecenter}
          onUseCurrentLocation={onUseCurrentLocation}
          geoLoading={geoLoading}
          display={true}
        />
      </div>

      {/* Bottom Sheet */}
      <BottomSheet location={location} onConfirm={onConfirm} />
    </div>
  );
}

function DesktopLayout({
  location,
  searchQuery,
  onSearchChange,
  onLocationChange,
  onConfirm,
  onRecenter,
  onUseCurrentLocation,
  geoLoading,
  searchResults,
  isLoadingSearch,
  isSearching,
  onSelectPlace,
  onClearSearch,
}: LayoutProps) {
  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <aside className="w-[400px] xl:w-[480px] bg-white border-r border-neutral-200 flex flex-col shadow-lg z-10">
        {/* ✅ Back Button */}
        <div className="px-6 pb-0 pt-4">
          <BackButton label={"Back"} className="!text-xl" href={ROUTES.HOME} />
        </div>

        {/* Header */}
        <div className="p-6 border-b border-neutral-200">
          <h1 className="text-2xl font-semibold text-neutral-950 mb-4">
            Location Picker
          </h1>
          <div className="relative">
            <SearchBar
              value={searchQuery}
              onChange={onSearchChange}
              onClear={onClearSearch}
              fullWidth
            />
            {isSearching && (
              <SearchResults
                results={searchResults}
                isLoading={isLoadingSearch}
                onSelect={onSelectPlace}
              />
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <LocationDetails location={location} />
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-neutral-200">
          <Button
            onClick={onConfirm}
            className="w-full h-12 bg-[#46a758] hover:bg-[#3d9049] text-white"
            size="lg"
          >
            <MapPin className="size-5 mr-2" />
            Confirm Location
          </Button>
        </div>
      </aside>

      {/* Map Area */}
      <main className="flex-1 relative">
        <GoongMap location={location} onChangeLocation={onLocationChange} />
        <CenterPinIndicator />
        <MapControls
          onRecenter={onRecenter}
          onUseCurrentLocation={onUseCurrentLocation}
          geoLoading={geoLoading}
          position="right"
          display={false}
        />
        <CoordinatesDisplay coordinates={location.coordinates} />
      </main>
    </div>
  );
}

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  fullWidth?: boolean;
}

function SearchBar({ value, onChange, onClear, fullWidth }: SearchBarProps) {
  return (
    <div className={`relative ${fullWidth ? "w-full" : ""}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500 z-10" />
      <Input
        type="text"
        placeholder="Search address, place..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 pr-10 h-10 bg-white border-neutral-200 focus:border-neutral-400 focus:ring-neutral-400"
        aria-label="Search location"
      />
      {value && (
        <button
          onClick={onClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 z-10"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}

interface SearchResultsProps {
  results: GoongPrediction[];
  isLoading: boolean;
  onSelect: (place: GoongPrediction) => void;
}

function SearchResults({ results, isLoading, onSelect }: SearchResultsProps) {
  return (
    <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-lg shadow-lg border border-neutral-200 max-h-80 overflow-y-auto z-20">
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="size-5 text-[#94ce9a] animate-spin" />
          <span className="ml-2 text-sm text-neutral-600">Searching...</span>
        </div>
      )}

      {!isLoading && results.length === 0 && (
        <div className="text-center py-8 text-neutral-500">
          <p className="text-sm">No results found</p>
        </div>
      )}

      {!isLoading && results.length > 0 && (
        <div className="py-2">
          {results.map((result) => (
            <button
              key={result.place_id}
              onClick={() => onSelect(result)}
              className="w-full flex items-start gap-3 px-4 py-3 hover:bg-neutral-50 transition-colors text-left"
            >
              <MapPin className="size-4 text-[#94ce9a] mt-1 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900 truncate">
                  {result.structured_formatting.main_text}
                </p>
                <p className="text-xs text-neutral-500 truncate mt-0.5">
                  {result.structured_formatting.secondary_text}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function CenterPinIndicator() {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full z-20 pointer-events-none">
      <div className="relative animate-bounce">
        <MapPin
          className="size-12 text-red-500 drop-shadow-lg"
          fill="currentColor"
        />
        <div className="absolute inset-0 animate-ping">
          <MapPin className="size-12 text-red-500 opacity-75" />
        </div>
      </div>
    </div>
  );
}

interface MapControlsProps {
  onRecenter: () => void;
  onUseCurrentLocation: () => void;
  geoLoading: boolean;
  position?: "left" | "right";
  display?: boolean;
}

function MapControls({
  onRecenter,
  onUseCurrentLocation,
  geoLoading,
  position = "left",
  display,
}: MapControlsProps) {
  const positionClass = position === "right" ? "right-4" : "left-4";

  return (
    <div
      className={`absolute ${positionClass} top-20 lg:top-4 z-10 flex flex-col gap-2`}
    >
      <BackMobileButton
        className="hover:text-rose-500"
        display={display}
        href={ROUTES.HOME}
      />
      <Button
        variant="secondary"
        size="icon"
        className="size-10 bg-white hover:bg-neutral-100 shadow-md hover:size-11 hover:text-rose-500"
        onClick={onRecenter}
        aria-label="Recenter map"
      >
        <Crosshair className="size-5" />
      </Button>
      <Button
        variant="secondary"
        size="icon"
        className="size-10 bg-white hover:bg-neutral-100 shadow-md hover:size-11 hover:text-rose-500"
        onClick={onUseCurrentLocation}
        aria-label="Current location"
        disabled={geoLoading}
      >
        {geoLoading ? (
          <Loader2 className="size-5 animate-spin" />
        ) : (
          <Locate className="size-5" />
        )}
      </Button>
    </div>
  );
}

interface BottomSheetProps {
  location: LocationData;
  onConfirm: () => void;
}

function BottomSheet({ location, onConfirm }: BottomSheetProps) {
  return (
    <div className="bg-white rounded-t-2xl shadow-[0_-4px_20px_0_rgba(0,0,0,0.1)] z-30">
      <div className="flex flex-col items-center gap-4 px-4 pt-3 pb-6">
        {/* Handle */}
        <div className="w-12 h-1 bg-neutral-300 rounded-full" />

        {/* Content */}
        <div className="w-full text-center space-y-2">
          <h2 className="text-base font-semibold text-neutral-900">
            Selected Location
          </h2>
          <p className="text-sm text-neutral-600 px-4">{location.address}</p>
          <div className="flex items-center justify-center gap-4 text-xs text-neutral-500">
            <span>Lat: {location.coordinates.lat.toFixed(6)}</span>
            <span>Lng: {location.coordinates.lng.toFixed(6)}</span>
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={onConfirm}
          className="w-[200px] h-9 bg-[#46a758] hover:bg-[#3d9049] text-white"
        >
          Confirm Location
        </Button>
      </div>
    </div>
  );
}

function LocationDetails({ location }: { location: LocationData }) {
  return (
    <Card className="border-neutral-200">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start gap-3">
          <MapPin className="size-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-neutral-900 mb-1">
              Current Location
            </h3>
            <p className="text-sm text-neutral-600">{location.address}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-100">
          <div>
            <p className="text-xs text-neutral-500">Latitude</p>
            <p className="text-sm font-medium text-neutral-900">
              {location.coordinates.lat.toFixed(6)}
            </p>
          </div>
          <div>
            <p className="text-xs text-neutral-500">Longitude</p>
            <p className="text-sm font-medium text-neutral-900">
              {location.coordinates.lng.toFixed(6)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CoordinatesDisplay({
  coordinates,
}: {
  coordinates: { lat: number; lng: number };
}) {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md border border-neutral-200">
      <p className="text-xs text-neutral-600">
        <span className="font-medium">Lat:</span> {coordinates.lat.toFixed(6)} |
        <span className="font-medium ml-2">Lng:</span>{" "}
        {coordinates.lng.toFixed(6)}
      </p>
    </div>
  );
}
