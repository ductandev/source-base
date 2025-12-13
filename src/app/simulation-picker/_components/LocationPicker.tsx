"use client";

import { useState, useCallback } from "react";
import {
  Search,
  MapPin,
  Crosshair,
  Plus,
  Minus,
  Navigation,
  Locate,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
const imgMap = "../../../../public/assets/maps.png";
import {
  DEFAULT_LOCATION,
  SAMPLE_RECENT_PLACES,
} from "@/app/simulation-picker/hooks/constants";
import { useGeolocation } from "../hooks/useGeolocation";
import { ImageWithFallback } from "@/common/ImageWithFallback";
import { LocationData } from "@/types/simulation";
import { searchAddress } from "@/api/simulation/goongSearch";
import GoongMap from "@/app/simulation-picker/_components/GoongMap";

export default function LocationPicker() {
  const [location, setLocation] = useState<LocationData>(DEFAULT_LOCATION);

  const [searchQuery, setSearchQuery] = useState("");
  const {
    coordinates,
    loading: geoLoading,
    getCurrentLocation,
  } = useGeolocation();

  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (!query) return;

    const result = await searchAddress(query);
    if (!result) return;

    setLocation({
      address: result.formatted_address,
      coordinates: {
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
      },
    });
  };

  const handleConfirmLocation = useCallback(() => {
    console.log("Location confirmed:", location);
    // Add your location confirmation logic here
  }, [location]);

  const handleRecenter = useCallback(() => {
    console.log("Recentering map");
    // Add your recenter logic here
  }, []);

  const handleUseCurrentLocation = useCallback(() => {
    if (!coordinates) {
      getCurrentLocation();
      return;
    }

    setLocation({
      address: "Current location",
      coordinates,
    });
  }, [coordinates, getCurrentLocation]);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Mobile Layout */}
      <div className="lg:hidden">
        <MobileLayout
          location={location}
          searchQuery={searchQuery}
          onSearchChange={handleSearch}
          onConfirm={handleConfirmLocation}
          onRecenter={handleRecenter}
          onUseCurrentLocation={handleUseCurrentLocation}
          geoLoading={geoLoading}
        />
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <DesktopLayout
          location={location}
          searchQuery={searchQuery}
          onSearchChange={handleSearch}
          onConfirm={handleConfirmLocation}
          onRecenter={handleRecenter}
          onUseCurrentLocation={handleUseCurrentLocation}
          geoLoading={geoLoading}
        />
      </div>
    </div>
  );
}

interface LayoutProps {
  location: LocationData;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onConfirm: () => void;
  onRecenter: () => void;
  onUseCurrentLocation: () => void;
  geoLoading: boolean;
}

function MobileLayout({
  location,
  searchQuery,
  onSearchChange,
  onConfirm,
  onRecenter,
  onUseCurrentLocation,
  geoLoading,
}: LayoutProps) {
  return (
    <div className="relative h-screen flex flex-col">
      {/* Status Bar */}
      <StatusBar />

      {/* Map Container */}
      <div className="relative flex-1">
        <GoongMap location={location} onChangeLocation={setLocation} />

        {/* Search Bar - Floating */}
        <div className="absolute top-4 left-4 right-4 z-10">
          <SearchBar value={searchQuery} onChange={onSearchChange} />
        </div>

        {/* Center Pin Indicator */}
        <CenterPinIndicator />

        {/* Map Controls - Floating */}
        <MapControls
          onRecenter={onRecenter}
          onUseCurrentLocation={onUseCurrentLocation}
          geoLoading={geoLoading}
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
  onConfirm,
  onRecenter,
  onUseCurrentLocation,
  geoLoading,
}: LayoutProps) {
  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <aside className="w-[400px] xl:w-[480px] bg-white border-r border-neutral-200 flex flex-col shadow-lg z-10">
        {/* Header */}
        <div className="p-6 border-b border-neutral-200">
          <h1 className="text-2xl font-semibold text-neutral-950 mb-4">
            Location Picker
          </h1>
          <SearchBar value={searchQuery} onChange={onSearchChange} fullWidth />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <LocationDetails location={location} />
          <RecentLocations />
          <SavedPlaces />
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-neutral-200">
          <Button
            onClick={onConfirm}
            className="w-full h-12 bg-[#94ce9a] hover:bg-[#7db882] text-neutral-900"
            size="lg"
          >
            <MapPin className="size-5 mr-2" />
            Confirm Location
          </Button>
        </div>
      </aside>

      {/* Map Area */}
      <main className="flex-1 relative">
        <GoongMap location={location} onChangeLocation={setLocation} />
        <CenterPinIndicator />
        <MapControls
          onRecenter={onRecenter}
          onUseCurrentLocation={onUseCurrentLocation}
          geoLoading={geoLoading}
          position="right"
        />

        {/* Coordinates Display */}
        <CoordinatesDisplay coordinates={location.coordinates} />
      </main>
    </div>
  );
}

function StatusBar() {
  return (
    <div className="bg-white px-6 py-3 flex items-center justify-between border-b border-neutral-100">
      <span className="text-neutral-950 font-medium">9:41</span>
      <div className="flex items-center gap-2">
        <div className="size-4 text-neutral-700">
          <svg fill="currentColor" viewBox="0 0 18 10">
            <path d="M2 6C2.55228 6 3 6.44772 3 7V9C3 9.55228 2.55228 10 2 10H1C0.447715 10 0 9.55228 0 9V7C0 6.44772 0.447715 6 1 6H2ZM7 4C7.55228 4 8 4.44772 8 5V9C8 9.55228 7.55228 10 7 10H6C5.44772 10 5 9.55228 5 9V5C5 4.44772 5.44772 4 6 4H7ZM12 2C12.5523 2 13 2.42979 13 2.95996V9.04004C13 9.57021 12.5523 10 12 10H11C10.4478 9.99994 10 9.57018 10 9.04004V2.95996C10 2.42982 10.4478 2.00006 11 2H12ZM17 0C17.5523 0 18 0.419733 18 0.9375V9.0625C18 9.58027 17.5523 10 17 10H16C15.4477 10 15 9.58027 15 9.0625V0.9375C15 0.419733 15.4477 0 16 0H17Z" />
          </svg>
        </div>
      </div>
    </div>
  );
}

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  fullWidth?: boolean;
}

function SearchBar({ value, onChange, fullWidth }: SearchBarProps) {
  return (
    <div className={`relative ${fullWidth ? "w-full" : ""}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500" />
      <Input
        type="text"
        placeholder="Search address, coordinates..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 h-10 bg-white border-neutral-200 focus:border-neutral-400 focus:ring-neutral-400"
        aria-label="Search location"
      />
    </div>
  );
}

function MapView() {
  return (
    <div className="absolute inset-0">
      <iframe
        src="https://maps.goong.io/maps/embed?mid=36ab2924-22f6-454a-b032-6343df19ab3f&lat=10.805711998860659&long=106.65323825762289&z=14"
        className="w-full h-full"
        style={{ border: 0 }}
        loading="lazy"
      />
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
}

function MapControls({
  onRecenter,
  onUseCurrentLocation,
  geoLoading,
  position = "left",
}: MapControlsProps) {
  const positionClass = position === "right" ? "right-4" : "left-4";

  return (
    <div
      className={`absolute ${positionClass} top-20 lg:top-4 z-10 flex flex-col gap-2`}
    >
      <Button
        variant="secondary"
        size="icon"
        className="size-10 bg-white hover:bg-neutral-100 shadow-md"
        aria-label="Zoom in"
      >
        <Plus className="size-5" />
      </Button>
      <Button
        variant="secondary"
        size="icon"
        className="size-10 bg-white hover:bg-neutral-100 shadow-md"
        aria-label="Zoom out"
      >
        <Minus className="size-5" />
      </Button>
      <Button
        variant="secondary"
        size="icon"
        className="size-10 bg-white hover:bg-neutral-100 shadow-md"
        onClick={onRecenter}
        aria-label="Recenter map"
      >
        <Crosshair className="size-5" />
      </Button>
      <Button
        variant="secondary"
        size="icon"
        className="size-10 bg-white hover:bg-neutral-100 shadow-md"
        onClick={onUseCurrentLocation}
        aria-label="Current location"
        disabled={geoLoading}
      >
        <Locate className="size-5" />
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
        <div className="text-center space-y-1">
          <h2 className="text-base font-semibold text-neutral-900">
            Pin Location
          </h2>
          <p className="text-sm text-neutral-500">
            Move the map to place the pin precisely
          </p>
        </div>

        {/* Action Button */}
        <Button
          onClick={onConfirm}
          className="w-[200px] h-9 bg-[#94ce9a] hover:bg-[#7db882] text-neutral-900"
        >
          Confirm Location
        </Button>

        {/* Home Indicator */}
        <div className="w-[148px] h-1 bg-neutral-900 rounded-full mt-2" />
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
              {location.coordinates.lat}
            </p>
          </div>
          <div>
            <p className="text-xs text-neutral-500">Longitude</p>
            <p className="text-sm font-medium text-neutral-900">
              {location.coordinates.lng}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function RecentLocations() {
  const recentPlaces = SAMPLE_RECENT_PLACES;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-neutral-900">
        Recent Locations
      </h3>
      <div className="space-y-2">
        {recentPlaces.map((place, index) => (
          <button
            key={index}
            className="w-full text-left p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300 transition-colors"
          >
            <p className="text-sm font-medium text-neutral-900">{place.name}</p>
            <p className="text-xs text-neutral-500 mt-0.5">{place.address}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function SavedPlaces() {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-neutral-900">Saved Places</h3>
      <div className="space-y-2">
        <button className="w-full flex items-center gap-3 p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300 transition-colors">
          <div className="size-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Navigation className="size-4 text-blue-600" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-neutral-900">Home</p>
            <p className="text-xs text-neutral-500">Add home address</p>
          </div>
        </button>
        <button className="w-full flex items-center gap-3 p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300 transition-colors">
          <div className="size-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
            <MapPin className="size-4 text-purple-600" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-neutral-900">Work</p>
            <p className="text-xs text-neutral-500">Add work address</p>
          </div>
        </button>
      </div>
    </div>
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
