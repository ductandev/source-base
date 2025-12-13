"use client";

import { useState, useRef, useEffect } from "react";
import { MapPin, Search, X, Loader2, Star } from "lucide-react";
import { useLocationSearch } from "@/api/openWeather";
import { useLocationStore } from "@/stores/locationStore";
import type { LocationData } from "@/types/weather";

interface LocationSearchDropdownProps {
  currentLocation: string;
  onClose?: () => void;
}

export function LocationSearchDropdown({
  currentLocation,
  onClose,
}: LocationSearchDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    setSelectedLocation,
    recentLocations,
    favoriteLocations,
    addFavoriteLocation,
    removeFavoriteLocation,
    isFavorite,
  } = useLocationStore();

  const {
    data: searchResults,
    isLoading: isSearching,
    isError,
  } = useLocationSearch(searchQuery, searchQuery.length >= 2);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        onClose?.();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onClose]);

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleLocationSelect = (location: LocationData) => {
    setSelectedLocation(location.displayName, location);
    setSearchQuery("");
    setIsOpen(false);
    onClose?.();
  };

  const toggleFavorite = (location: LocationData, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorite(location.displayName)) {
      removeFavoriteLocation(location.displayName);
    } else {
      addFavoriteLocation(location);
    }
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-all hover:scale-105"
      >
        <MapPin className="size-5 text-[#2B7FFF]" />
        <span className="text-sm text-[#101828] max-w-[200px] truncate">
          {currentLocation}
        </span>
        <svg
          className={`size-4 text-[#4A5565] transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-96 bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden z-50 animate-scaleIn">
          {/* Search Input */}
          <div className="p-4 border-b border-neutral-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-neutral-400" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search city or location..."
                className="w-full pl-10 pr-10 py-3 bg-neutral-50 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#2B7FFF] focus:ring-2 focus:ring-[#2B7FFF]/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  <X className="size-5" />
                </button>
              )}
            </div>
          </div>

          {/* Results Container */}
          <div className="max-h-96 overflow-y-auto">
            {/* Search Results */}
            {searchQuery.length >= 2 && (
              <div className="p-2">
                {isSearching && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="size-6 text-[#2B7FFF] animate-spin" />
                    <span className="ml-2 text-neutral-600">Searching...</span>
                  </div>
                )}

                {!isSearching && isError && (
                  <div className="text-center py-8 text-neutral-500">
                    <p>Unable to search locations</p>
                    <p className="text-sm mt-1">Please try again</p>
                  </div>
                )}

                {!isSearching &&
                  !isError &&
                  searchResults &&
                  searchResults.length === 0 && (
                    <div className="text-center py-8 text-neutral-500">
                      <p>No locations found</p>
                      <p className="text-sm mt-1">Try a different search</p>
                    </div>
                  )}

                {!isSearching &&
                  !isError &&
                  searchResults &&
                  searchResults.length > 0 && (
                    <>
                      <h3 className="text-xs font-semibold text-neutral-500 uppercase px-3 py-2">
                        Search Results
                      </h3>
                      {searchResults.map((location, index) => (
                        <LocationItem
                          key={`${location.name}-${location.lat}-${location.lon}-${index}`}
                          location={location}
                          onSelect={handleLocationSelect}
                          onToggleFavorite={toggleFavorite}
                          isFavorite={isFavorite(location.displayName)}
                        />
                      ))}
                    </>
                  )}
              </div>
            )}

            {/* Favorites */}
            {searchQuery.length === 0 && favoriteLocations.length > 0 && (
              <div className="p-2">
                <h3 className="text-xs font-semibold text-neutral-500 uppercase px-3 py-2">
                  Favorites
                </h3>
                {favoriteLocations.map((location) => (
                  <LocationItem
                    key={`fav-${location.lat}-${location.lon}`}
                    location={location}
                    onSelect={handleLocationSelect}
                    onToggleFavorite={toggleFavorite}
                    isFavorite={true}
                  />
                ))}
              </div>
            )}

            {/* Recent Locations */}
            {searchQuery.length === 0 && recentLocations.length > 0 && (
              <div className="p-2 border-t border-neutral-100">
                <h3 className="text-xs font-semibold text-neutral-500 uppercase px-3 py-2">
                  Recent
                </h3>
                {recentLocations.map((location) => (
                  <LocationItem
                    key={`recent-${location.lat}-${location.lon}`}
                    location={location}
                    onSelect={handleLocationSelect}
                    onToggleFavorite={toggleFavorite}
                    isFavorite={isFavorite(location.displayName)}
                  />
                ))}
              </div>
            )}

            {/* Empty State */}
            {searchQuery.length === 0 &&
              favoriteLocations.length === 0 &&
              recentLocations.length === 0 && (
                <div className="text-center py-8 text-neutral-500">
                  <MapPin className="size-12 mx-auto mb-2 text-neutral-300" />
                  <p>Start searching for locations</p>
                  <p className="text-sm mt-1">
                    Your recent and favorite locations will appear here
                  </p>
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
}

// Location Item Component
interface LocationItemProps {
  location: LocationData;
  onSelect: (location: LocationData) => void;
  onToggleFavorite: (location: LocationData, e: React.MouseEvent) => void;
  isFavorite: boolean;
}

function LocationItem({
  location,
  onSelect,
  onToggleFavorite,
  isFavorite,
}: LocationItemProps) {
  return (
    <div className="w-full flex items-center justify-between px-3 py-3 rounded-lg hover:bg-neutral-50 transition-all group">
      <button
        onClick={() => onSelect(location)}
        className="flex items-center gap-3 flex-1 min-w-0"
      >
        <div className="bg-blue-50 rounded-full p-2 group-hover:bg-blue-100 transition-colors">
          <MapPin className="size-4 text-[#2B7FFF]" />
        </div>
        <div className="text-left flex-1 min-w-0">
          <p className="text-sm font-medium text-neutral-900 truncate">
            {location.name}
          </p>
          <p className="text-xs text-neutral-500 truncate">
            {location.state && `${location.state}, `}
            {location.country}
          </p>
        </div>
      </button>
      <button
        onClick={(e) => onToggleFavorite(location, e)}
        className="ml-2 p-2 hover:bg-neutral-100 rounded-full transition-colors"
      >
        <Star
          className={`size-4 ${
            isFavorite ? "fill-yellow-400 text-yellow-400" : "text-neutral-300"
          }`}
        />
      </button>
    </div>
  );
}
