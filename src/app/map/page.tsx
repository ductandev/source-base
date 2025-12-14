"use client";

import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
  ZoomControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { SearchIcon, ArrowLeft } from "lucide-react";

// Main pin icon
const customPin = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/9057/9057101.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

// Marker for search result
const searchPin = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});

// Helper to detect mobile
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
};

export default function PinLocationMapClient() {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [positionInfo, setPositionInfo] = useState<string>("Loading location...");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<[number, number] | null>(null);
  const [searchName, setSearchName] = useState<string>("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const isMobile = useIsMobile();
  const [locating, setLocating] = useState(true);

  // Get user's current location
  useEffect(() => {
    if (!navigator.geolocation) {
      setPositionInfo("Geolocation not supported.");
      setLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
        setLocating(false);

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en`,
            { headers: { "User-Agent": "MyApp/1.0" } }
          );
          const data = await res.json();
          setPositionInfo(data.display_name || "No location information available");
        } catch (error) {
          console.error(error);
          setPositionInfo("Error fetching location information");
        }
      },
      (err) => {
        console.error(err);
        setPositionInfo("Unable to get your location.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  // Map click handler
  function MapClickHandler() {
    useMapEvents({
      click: async (e) => {
        const lat = e.latlng.lat;
        const lon = e.latlng.lng;
        setPosition([lat, lon]);

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=en`,
            { headers: { "User-Agent": "MyApp/1.0" } }
          );
          const data = await res.json();
          setPositionInfo(data.display_name || "No location information available");
        } catch (error) {
          console.error(error);
          setPositionInfo("Error fetching location information");
        }
      },
    });
    return null;
  }

  // Move map
  function MoveMapTo({ coords }: { coords: [number, number] }) {
    const map = useMap();
    map.setView(coords, 16);
    return null;
  }

  // Handle search
  const handleSearch = async (query?: string) => {
    const q = query ?? search;
    if (!q.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          q
        )}&format=json&limit=5&addressdetails=1&accept-language=en`,
        { headers: { "User-Agent": "MyApp/1.0" } }
      );
      const data = await res.json();
      if (data && data.length > 0) {
        if (query) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          setSearchResult([lat, lon]);
          setSearchName(data[0].display_name);
          setPosition([lat, lon]);
          setPositionInfo(data[0].display_name);
          setSuggestions([]);
        } else {
          setSuggestions(data);
        }
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (search.trim() === "") {
      setSuggestions([]);
      return;
    }
    const timeout = setTimeout(() => {
      handleSearch();
    }, 300);
    return () => clearTimeout(timeout);
  }, [search]);

  const selectSuggestion = (item: any) => {
    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);
    setSearchResult([lat, lon]);
    setSearchName(item.display_name);
    setPosition([lat, lon]);
    setPositionInfo(item.display_name);
    setSearch(item.display_name);
    setSuggestions([]);
  };

  return (
    <div className="relative w-full h-screen md:h-[100vh]">
      {/* Map */}
      <MapContainer
        center={position ?? [12.23879, 109.19675]}
        zoom={14}
        scrollWheelZoom={true}
        className="w-full h-full"
        zoomControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapClickHandler />
        {position && <Marker position={position} icon={customPin} />}
        {position && <MoveMapTo coords={position} />}
        {searchResult && (
          <Marker position={searchResult} icon={searchPin}>
            <Popup>{searchName}</Popup>
          </Marker>
        )}
        {!isMobile && <ZoomControl position="topright" />}
      </MapContainer>

      {/* Search Box */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-11/12 md:w-1/2 z-[600]">
        <div className="relative">
          <div className="flex items-center shadow-xl rounded-sm border border-gray-300 bg-white px-3 py-2">
            <SearchIcon className="text-gray-400 mr-2" size={18} />
            <input
              type="text"
              placeholder="Search address or coordinates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={async (e) => {
                if (e.key === "Enter") await handleSearch(search);
              }}
              className="flex-1 focus:outline-none text-sm md:text-base"
            />
            {(loading || locating) && (
              <div className="ml-2 w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            )}
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <ul className="absolute top-full left-0 right-0 bg-white border border-gray-200 shadow-md max-h-60 overflow-auto z-[700] rounded-b-xl">
              {suggestions.map((item, index) => (
                <li
                  key={index}
                  className="p-2 hover:bg-green-100 cursor-pointer text-sm md:text-base"
                  onClick={() => selectSuggestion(item)}
                >
                  {item.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Info Panel */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-3 md:p-5 shadow-xl z-[500] max-w-full md:max-w-lg mx-auto">
        <div className="flex items-center mb-2 md:mb-3">
          {isMobile && (
            <button
              className="mr-2 p-1"
              onClick={() => window.history.back()}
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-2"></div>
        </div>
        <h2 className="text-center text-md md:text-lg font-semibold mb-2 md:mb-3">
          Selected Location
        </h2>

        <div className="bg-gray-100 rounded-xl p-2 md:p-3 text-center border mb-3">
          <p className="text-sm md:text-md font-medium">
            <strong>Coordinates:</strong>{" "}
            {position
              ? `${position[0].toFixed(5)}, ${position[1].toFixed(5)}`
              : "_ _"}
          </p>
          <p className="text-sm md:text-md font-medium mt-1">
            <strong>Address:</strong> {positionInfo || "Click on the map to select"}
          </p>
        </div>

        <button className="w-full bg-green-600 text-white py-2 md:py-3 rounded-xl font-semibold hover:bg-green-700 transition text-sm md:text-base">
          Confirm Location
        </button>
      </div>
    </div>
  );
}
