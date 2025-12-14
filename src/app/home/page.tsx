"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  MapPin,
  ChevronDown,
  ChevronRight,
  Cloud,
  Zap,
  Wind,
  Clock,
  Droplets,
  Eye,
  Gauge,
  Thermometer,
  Sun,
  CloudRain,
} from "lucide-react";
import dayjs from "dayjs";
import { useWeatherData } from "@/api/openWeather";
import { useLocationStore } from "@/stores/locationStore";
import { weatherService } from "@/api/openWeather/api";
import { useGeolocation } from "@/app/home/_components/useGeolocation";
import { LocationSearchDropdown } from "@/app/home/_components/LocationSearchDropdown";
import { LocationPermissionDialog } from "@/app/home/_components/LocationPermissionDialog";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/utils/routes";
import Link from "next/link";

export default function ResponsiveWeatherApp() {
  const { selectedLocation, locationData, setSelectedLocation } =
    useLocationStore();

  // Location permission states
  const [showPermissionDialog, setShowPermissionDialog] = useState(true);
  const [allowGeolocation, setAllowGeolocation] = useState(false);
  const [hasCheckedPermission, setHasCheckedPermission] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const geolocation = useGeolocation(allowGeolocation);

  const router = useRouter();

  const {
    currentWeather,
    hourlyForecast,
    dailyForecast,
    todayHighlights,
    alerts,
    isLoading,
    isError,
    error,
  } = useWeatherData(selectedLocation);

  // Check localStorage for permission preference
  useEffect(() => {
    const savedPreference = localStorage.getItem("location-permission");
    if (savedPreference !== null) {
      setShowPermissionDialog(false);
      setHasCheckedPermission(true);
      if (savedPreference === "allowed") {
        setAllowGeolocation(true);
      }
    }
  }, []);

  // Handle geolocation result
  useEffect(() => {
    if (geolocation.location && !geolocation.loading) {
      // Reverse geocode to get city name
      weatherService
        .getCurrentWeatherByCoords(
          geolocation.location.lat,
          geolocation.location.lon,
        )
        .then((weather) => {
          const locationData = {
            name: weather.location,
            country: weather.country,
            lat: geolocation.location!.lat,
            lon: geolocation.location!.lon,
            displayName: `${weather.location}, ${weather.country}`,
          };
          setSelectedLocation(weather.location, locationData);
        })
        .catch(() => {
          // If fails, use default
          setSelectedLocation("Tân Bình");
        });
    }
  }, [geolocation.location, geolocation.loading, setSelectedLocation]);

  const handleAllowLocation = () => {
    localStorage.setItem("location-permission", "allowed");
    setAllowGeolocation(true);
    setHasCheckedPermission(true);
  };

  const handleDenyLocation = () => {
    localStorage.setItem("location-permission", "denied");
    setSelectedLocation("Tân Bình");
    setHasCheckedPermission(true);
  };

  const handleGoToStimulationPicker = () => {
    router.push(ROUTES.STIMULATION_PICKER);
  };

  // Show permission dialog first
  if (showPermissionDialog && !hasCheckedPermission) {
    return (
      <LocationPermissionDialog
        onAllow={handleAllowLocation}
        onDeny={handleDenyLocation}
      />
    );
  }

  // Loading State with animation
  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-[#2B7FFF] border-t-transparent"></div>
            <Cloud className="absolute inset-0 m-auto h-8 w-8 text-[#2B7FFF] animate-pulse" />
          </div>
          <p className="mt-6 text-neutral-600 animate-pulse">
            Loading weather data...
          </p>
        </div>
      </div>
    );
  }

  // Error State
  if (isError || !currentWeather) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <div className="text-center max-w-md px-4 animate-fadeIn">
          <div className="text-6xl mb-4 animate-bounce">⚠️</div>
          <h2 className="text-xl font-semibold text-neutral-900 mb-2">
            Unable to load weather data
          </h2>
          <p className="text-neutral-600">
            {error?.message || "An unknown error occurred"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Mobile View - Hidden on Desktop */}
      <div className="lg:hidden">
        <MobileLayout
          weather={currentWeather}
          hourly={hourlyForecast}
          daily={dailyForecast}
          highlights={todayHighlights}
          alerts={alerts}
          location={locationData?.displayName || selectedLocation}
          showMobileSearch={showMobileSearch}
          setShowMobileSearch={setShowMobileSearch}
        />
      </div>

      {/* Desktop View - Hidden on Mobile */}
      <div className="hidden lg:block">
        <DesktopLayout
          weather={currentWeather}
          hourly={hourlyForecast}
          daily={dailyForecast}
          highlights={todayHighlights}
          alerts={alerts}
          location={locationData?.displayName || selectedLocation}
        />
      </div>

      {/* Add custom CSS for animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        @keyframes rainDrop {
          0% {
            transform: translateY(-100px);
            opacity: 1;
          }
          100% {
            transform: translateY(100px);
            opacity: 0;
          }
        }

        @keyframes sunRays {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.6s ease-out;
        }

        .animate-slideInRight {
          animation: slideInRight 0.6s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.5s ease-out;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-shimmer {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }

        .animate-rainDrop {
          animation: rainDrop 1s linear infinite;
        }

        .animate-sunRays {
          animation: sunRays 20s linear infinite;
        }

        .animate-pulse-slow {
          animation: pulse 3s ease-in-out infinite;
        }

        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
        .delay-300 {
          animation-delay: 0.3s;
        }
        .delay-400 {
          animation-delay: 0.4s;
        }
        .delay-500 {
          animation-delay: 0.5s;
        }
      `}</style>
    </div>
  );
}

function MobileLayout({
  weather,
  hourly,
  daily,
  highlights,
  alerts,
  location,
  showMobileSearch,
  setShowMobileSearch,
}: any) {
  return (
    <div className="relative min-h-screen bg-neutral-100 pb-[106px]">
      {/* Top Bar */}
      <div className="px-5 pt-4 pb-3 animate-slideInLeft">
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setShowMobileSearch(true)}
          >
            <MapPin className="size-5 text-[#2B7FFF] animate-bounce" />
            <div>
              <p className="text-xs text-[#6a7282]">Your location</p>
              <div className="flex items-center gap-1">
                <p className="text-[17px] text-[#101828] tracking-tight">
                  {location}
                </p>
                <ChevronDown className="size-4 text-[#4A5565]" />
              </div>
            </div>
          </div>
          <div className="relative animate-scaleIn">
            <button className="size-11 bg-white rounded-full shadow-sm flex items-center justify-center hover:scale-110 transition-transform">
              <Bell className="size-5 text-[#364153]" />
            </button>
            {alerts && alerts.length > 0 && (
              <div className="absolute -top-1 -right-1 bg-[#ff6900] size-5 rounded-full flex items-center justify-center text-white text-[10px] animate-pulse">
                {alerts.length}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {showMobileSearch && (
        <div className="fixed inset-0 bg-white z-50 animate-fadeIn">
          <div className="p-4 border-b border-neutral-200 flex items-center gap-3">
            <button
              onClick={() => setShowMobileSearch(false)}
              className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
            >
              <svg
                className="size-6 text-neutral-900"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <h2 className="text-lg font-semibold text-neutral-900">
              Select Location
            </h2>
          </div>
          <div className="p-4">
            <LocationSearchDropdown
              currentLocation={location}
              onClose={() => setShowMobileSearch(false)}
            />
          </div>
        </div>
      )}

      {/* Weather Card */}
      <div className="px-5 mb-4 animate-fadeIn">
        <WeatherCard weather={weather} />
      </div>

      {/* Info Cards */}
      <div className="px-5 mb-4">
        <div className="grid grid-cols-3 gap-2">
          <div className="animate-slideInLeft delay-100">
            <InfoCard
              icon={<Clock className="size-6 text-[#5EB1EF]" />}
              label="Time"
              value={dayjs().format("hh:mm A")}
            />
          </div>
          <div className="animate-fadeIn delay-200">
            <InfoCard
              icon={
                <Droplets className="size-6 text-[#5EB1EF] animate-pulse" />
              }
              label="Humidity"
              value={`${weather.humidity}%`}
            />
          </div>
          <div className="animate-slideInRight delay-300">
            <InfoCard
              icon={<Wind className="size-6 text-[#5EB1EF]" />}
              label="Wind"
              value={`${weather.windSpeed} km/h`}
            />
          </div>
        </div>
      </div>

      {/* Early Warning Section */}
      {alerts && alerts.length > 0 && (
        <div className="px-5 animate-fadeIn delay-400">
          <EarlyWarningSection alerts={alerts} />
        </div>
      )}

      {/* Bottom Tab Bar */}
      <BottomTabBar />
    </div>
  );
}

function DesktopLayout({
  weather,
  hourly,
  daily,
  highlights,
  alerts,
  location,
}: any) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      {/* Desktop Header */}
      <header className="bg-white border-b border-neutral-200 shadow-sm sticky top-0 z-50 animate-slideInLeft">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl text-neutral-900 flex items-center gap-2">
                <Cloud className="size-7 text-[#2B7FFF] animate-float" />
                <span>Weather App</span>
              </h1>
              <nav className="flex items-center gap-6">
                <a
                  href="#"
                  className="text-sm text-neutral-900 hover:text-[#2B7FFF] transition-colors"
                >
                  Home
                </a>
                <a
                  href={ROUTES.WHAT_IF}
                  className="text-sm text-neutral-600 hover:text-[#2B7FFF] transition-colors"
                >
                  What If
                </a>
                <a
                  href={ROUTES.STIMULATION_PICKER}
                  className="text-sm text-neutral-600 hover:text-[#2B7FFF] transition-colors"
                >
                  Simulation
                </a>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <LocationSearchDropdown currentLocation={location} />
              <div className="relative">
                <button className="size-10 bg-neutral-100 rounded-full flex items-center justify-center hover:bg-neutral-200 transition-all hover:scale-110">
                  <Bell className="size-5 text-[#364153]" />
                </button>
                {alerts && alerts.length > 0 && (
                  <div className="absolute -top-1 -right-1 bg-[#ff6900] size-5 rounded-full flex items-center justify-center text-white text-[10px] animate-pulse">
                    {alerts.length}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Desktop Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Main Weather */}
          <div className="xl:col-span-2 space-y-6">
            <div className="animate-fadeIn">
              <WeatherCard weather={weather} />
            </div>

            {/* Info Cards Row */}
            <div className="grid grid-cols-3 gap-4">
              <div className="animate-slideInLeft delay-100">
                <InfoCard
                  icon={<Clock className="size-6 text-[#5EB1EF]" />}
                  label="Time"
                  value={dayjs().format("hh:mm A")}
                />
              </div>
              <div className="animate-fadeIn delay-200">
                <InfoCard
                  icon={
                    <Droplets className="size-6 text-[#5EB1EF] animate-pulse" />
                  }
                  label="Humidity"
                  value={`${weather.humidity}%`}
                />
              </div>
              <div className="animate-slideInRight delay-300">
                <InfoCard
                  icon={<Wind className="size-6 text-[#5EB1EF]" />}
                  label="Wind"
                  value={`${weather.windSpeed} km/h`}
                />
              </div>
            </div>

            {/* Early Warning Section */}
            {alerts && alerts.length > 0 && (
              <div className="animate-fadeIn delay-400">
                <EarlyWarningSection alerts={alerts} />
              </div>
            )}
          </div>

          {/* Right Column - Additional Info */}
          <div className="space-y-6">
            {daily && (
              <div className="animate-slideInRight delay-200">
                <WeeklyForecast forecast={daily} />
              </div>
            )}
            {highlights && (
              <div className="animate-slideInRight delay-400">
                <QuickStats highlights={highlights} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function WeatherCard({ weather }: any) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine gradient based on weather condition
  const getGradient = () => {
    const condition = weather.condition.toLowerCase();

    if (condition.includes("clear")) {
      return "from-[#FFB347] to-[#FFCC33]";
    } else if (condition.includes("rain")) {
      return "from-[#4A90E2] to-[#7EC8E3]";
    } else if (condition.includes("cloud")) {
      return "from-[#62a4ee] to-[#afd0f8]";
    } else if (condition.includes("thunder")) {
      return "from-[#5C6BC0] to-[#7986CB]";
    } else if (condition.includes("snow")) {
      return "from-[#E3F2FD] to-[#BBDEFB]";
    }

    return "from-[#62a4ee] to-[#afd0f8]";
  };

  // Get animated weather icon
  const getWeatherIcon = () => {
    const condition = weather.condition.toLowerCase();

    // Clear/Sunny
    if (condition.includes("clear")) {
      return (
        <div className="relative w-32 h-32 lg:w-40 lg:h-40">
          {/* Sun with rotating rays */}
          <div className="absolute inset-0 animate-sunRays">
            <Sun className="w-full h-full text-yellow-300 drop-shadow-[0_0_20px_rgba(255,220,100,0.6)]" />
          </div>
          {/* Pulsing glow */}
          <div className="absolute inset-0 bg-yellow-300/30 rounded-full blur-2xl animate-pulse-slow" />
        </div>
      );
    }

    // Rain
    if (condition.includes("rain")) {
      return (
        <div className="relative w-32 h-32 lg:w-40 lg:h-40">
          {/* Cloud */}
          <CloudRain className="w-full h-full text-white/90 drop-shadow-lg animate-float" />

          {/* Rain drops */}
          <div className="absolute inset-0 overflow-visible">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-3 bg-blue-200/60 rounded-full animate-rainDrop"
                style={{
                  left: `${20 + i * 12}%`,
                  top: "60%",
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: "1.5s",
                }}
              />
            ))}
          </div>
        </div>
      );
    }

    // Thunder/Storm
    if (condition.includes("thunder") || condition.includes("storm")) {
      return (
        <div className="relative w-32 h-32 lg:w-40 lg:h-40">
          {/* Cloud */}
          <Cloud className="w-full h-full text-gray-700/80 drop-shadow-lg animate-float" />

          {/* Lightning bolts */}
          <div className="absolute inset-0">
            <Zap
              className="absolute left-1/2 top-1/2 w-8 h-8 text-yellow-300 -translate-x-1/2 animate-pulse"
              fill="currentColor"
            />
            <Zap
              className="absolute left-1/3 top-2/3 w-6 h-6 text-yellow-400 animate-pulse"
              fill="currentColor"
              style={{ animationDelay: "0.5s" }}
            />
          </div>

          {/* Rain drops */}
          <div className="absolute inset-0 overflow-visible">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-3 bg-blue-300/60 rounded-full animate-rainDrop"
                style={{
                  left: `${25 + i * 12}%`,
                  top: "60%",
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: "1.2s",
                }}
              />
            ))}
          </div>
        </div>
      );
    }

    // Snow
    if (condition.includes("snow")) {
      return (
        <div className="relative w-32 h-32 lg:w-40 lg:h-40">
          {/* Cloud */}
          <Cloud className="w-full h-full text-white drop-shadow-lg animate-float" />

          {/* Snowflakes */}
          <div className="absolute inset-0 overflow-visible">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="absolute text-white text-xl animate-snowfall"
                style={{
                  left: `${10 + i * 10}%`,
                  top: "50%",
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: `${2 + Math.random()}s`,
                }}
              >
                ❄
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Cloudy (default)
    return (
      <div className="relative w-32 h-32 lg:w-40 lg:h-40">
        <Cloud className="w-full h-full text-white/90 drop-shadow-lg animate-float" />

        {/* Additional small cloud */}
        <Cloud
          className="absolute -right-4 top-8 w-20 h-20 text-white/70 animate-float"
          style={{ animationDelay: "1s", animationDuration: "4s" }}
        />
      </div>
    );
  };

  return (
    <div
      className={`relative bg-gradient-to-b ${getGradient()} rounded-3xl shadow-lg overflow-hidden h-[180px] lg:h-[240px] transition-all duration-500 ${
        mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"
      }`}
    >
      {/* Shimmer Effect on Load */}
      <div className="absolute inset-0 animate-shimmer pointer-events-none" />

      {/* Animated Weather Icon - Right Side */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-90">
        {getWeatherIcon()}
      </div>

      {/* Content */}
      <div className="relative z-10 p-6 lg:p-8 h-full flex flex-col justify-between">
        <div>
          <div className="text-7xl lg:text-8xl text-white tracking-tight animate-scaleIn">
            {weather.temperature}°
            <span className="text-5xl lg:text-6xl">C</span>
          </div>
          <p className="text-[17px] lg:text-lg text-white/90 mt-2 capitalize animate-fadeIn delay-200">
            {weather.conditionDescription}
          </p>
        </div>

        <div className="flex items-center gap-2 text-white/80 animate-slideInLeft delay-300">
          <MapPin className="size-4 animate-bounce" />
          <span className="text-sm">
            {weather.location}, {weather.country}
          </span>
        </div>
      </div>

      {/* Add additional CSS animations */}
      <style jsx>{`
        @keyframes snowfall {
          0% {
            transform: translateY(-10px) translateX(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100px) translateX(10px) rotate(360deg);
            opacity: 0;
          }
        }

        .animate-snowfall {
          animation: snowfall linear infinite;
        }
      `}</style>
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 lg:p-5 hover:shadow-md transition-all hover:scale-105">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-[#6a7282]">{icon}</div>
        <div>
          <p className="text-xs lg:text-sm text-[#6a7282] mb-1">{label}</p>
          <p className="text-xl lg:text-2xl text-neutral-900 font-medium">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function EarlyWarningSection({ alerts }: any) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-lg text-neutral-900 font-semibold">
            Early Warning
          </h2>
          <p className="text-[13px] text-[#6a7282]">
            For today, {dayjs().format("HH:mm")}—
            {dayjs().add(2, "hour").format("HH:mm")}
          </p>
        </div>
        <button className="flex items-center gap-1 text-[#2b7fff] text-[15px] hover:underline transition-all hover:scale-105">
          See more
          <ChevronRight className="size-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {alerts.slice(0, 2).map((alert: any, index: number) => (
          <div
            key={alert.id}
            className="animate-scaleIn"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <WarningCard
              type={alert.type}
              location={alert.location}
              description={alert.description}
              icon={
                alert.type.toLowerCase().includes("thunder") ? (
                  <Zap className="size-6 text-white" />
                ) : (
                  <Wind className="size-6 text-white" />
                )
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function WarningCard({
  type,
  location,
  description,
  icon,
}: {
  type: string;
  location: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-xl transition-all hover:scale-105">
      <div className="bg-gradient-to-b from-[#62a4ee] to-[#afd0f8] p-5">
        <div className="bg-white/20 backdrop-blur-sm w-12 h-12 rounded-lg flex items-center justify-center mb-3 animate-pulse">
          {icon}
        </div>
        <p className="text-sm text-white font-medium">{type}</p>
      </div>
      <div className="bg-white p-5">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="size-4 text-[#364153]" />
          <p className="text-[13px] text-[#101828]">{location}</p>
        </div>
        <p className="text-xs text-[#4a5565] leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function WeeklyForecast({ forecast }: any) {
  const getWeatherEmoji = (condition: string) => {
    const cond = condition.toLowerCase();
    if (cond.includes("clear")) return "☀️";
    if (cond.includes("cloud")) return "☁️";
    if (cond.includes("rain")) return "🌧️";
    if (cond.includes("thunder")) return "⛈️";
    if (cond.includes("snow")) return "❄️";
    return "⛅";
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-lg text-neutral-900 font-semibold mb-4">
        Weekly Forecast
      </h3>
      <div className="space-y-3">
        {forecast.slice(0, 5).map((day: any, index: number) => (
          <div
            key={day.date}
            className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0 animate-fadeIn hover:bg-neutral-50 rounded-lg px-2 transition-all"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center gap-3">
              <span
                className="text-2xl animate-float"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {getWeatherEmoji(day.condition)}
              </span>
              <div>
                <span className="text-sm text-neutral-900 font-medium">
                  {index === 0 ? "Today" : day.day}
                </span>
                <p className="text-xs text-neutral-500 capitalize">
                  {day.description}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-neutral-900 font-medium">
                {day.tempMax}°
              </span>
              <span className="text-neutral-500 text-sm ml-1">
                {day.tempMin}°
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuickStats({ highlights }: any) {
  const stats = [
    {
      icon: <Sun className="size-5 text-orange-600 animate-sunRays" />,
      label: "UV Index",
      value: `${highlights.uvIndex} (${highlights.uvLevel})`,
      gradient: "from-orange-50 to-orange-100",
    },
    {
      icon: <Eye className="size-5 text-blue-600" />,
      label: "Visibility",
      value: `${highlights.visibility} km`,
      gradient: "from-blue-50 to-blue-100",
    },
    {
      icon: <Gauge className="size-5 text-purple-600" />,
      label: "Pressure",
      value: `${highlights.pressure} mb`,
      gradient: "from-purple-50 to-purple-100",
    },
    {
      icon: <Thermometer className="size-5 text-pink-600 animate-pulse" />,
      label: "Feels Like",
      value: `${highlights.feelsLike}°C`,
      gradient: "from-pink-50 to-pink-100",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-lg text-neutral-900 font-semibold mb-4">
        Today's Highlights
      </h3>
      <div className="space-y-4">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className={`flex items-center justify-between p-3 bg-gradient-to-br ${stat.gradient} rounded-lg hover:scale-105 transition-all animate-slideInRight`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center gap-2">
              {stat.icon}
              <span className="text-sm text-neutral-700 font-medium">
                {stat.label}
              </span>
            </div>
            <span className="text-neutral-900 font-semibold">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BottomTabBar() {
  const useRoute = useRouter()
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-neutral-200 px-6 pt-3 pb-6 rounded-t-[32px] shadow-[0px_-4px_20px_0px_rgba(0,0,0,0.08)] animate-slideInLeft">
      <div className="flex items-center justify-between max-w-md mx-auto">
        <TabButton icon={<Cloud className="size-6" />} label="Simulation" />
        <Link href={ROUTES.WHAT_IF}>
          <TabButton
            icon={
              <svg
                className="size-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            }
            label="What If"
          />
        </Link>
        <Link href='/home'>
          <TabButton
            icon={
              <svg
                className="size-7"
                viewBox="0 0 28 28"
                fill="none"
                stroke="white"
                strokeWidth="2.1"
              >
                <circle
                  cx="14"
                  cy="14"
                  r="11.67"
                  fill="white"
                  fillOpacity="0.3"
                />
                <path
                  d="M14 2.33C11 5.48 9.33 9.66 9.33 14s1.67 8.52 4.67 11.67C16.99 22.52 18.67 18.34 18.67 14S16.99 5.48 14 2.33z"
                  fill="white"
                  fillOpacity="0.3"
                />
                <path d="M2.33 14h23.34" />
              </svg>
            }
            label="Home"
            active
          />
        </Link>
        <TabButton
          icon={
            <svg
              className="size-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          }
          label="Share"
        />
        <TabButton
          icon={
            <svg
              className="size-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          }
          label="Profile"
        />
      </div>
    </div>
  );
}

function TabButton({
  icon,
  label,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <button className="flex flex-col items-center gap-1.5 relative group">
      {active && (
        <>
          <div className="absolute -top-2 size-1 bg-[#00c950] rounded-full animate-pulse" />
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#51a2ff] to-[#a9dbb2] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
            {icon}
          </div>
        </>
      )}
      {!active && (
        <div className="w-12 h-12 flex items-center justify-center text-[#6A7282] group-hover:scale-110 transition-transform">
          {icon}
        </div>
      )}
      <span
        className={`text-[11px] ${active ? "text-[#101828]" : "text-[#4a5565]"}`}
      >
        {label}
      </span>
    </button>
  );
}
