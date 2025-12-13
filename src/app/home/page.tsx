'use client';

import { useState } from 'react';
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
} from 'lucide-react';
import dayjs from 'dayjs';
import { useWeatherData } from '@/api/openWeather';
import { useLocationStore } from '@/stores/locationStore';

export default function ResponsiveWeatherApp() {
  const { selectedLocation, locationData } = useLocationStore();
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

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-[#2B7FFF] border-t-transparent"></div>
          <p className="mt-4 text-neutral-600">Loading weather data...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (isError || !currentWeather) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-neutral-900 mb-2">
            Unable to load weather data
          </h2>
          <p className="text-neutral-600">
            {error?.message || 'An unknown error occurred'}
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
}: any) {
  return (
    <div className="relative min-h-screen bg-neutral-100 pb-[106px]">
      {/* Top Bar */}
      <div className="px-5 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="size-5 text-[#2B7FFF]" />
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
          <div className="relative">
            <button className="size-11 bg-white rounded-full shadow-sm flex items-center justify-center">
              <Bell className="size-5 text-[#364153]" />
            </button>
            {alerts && alerts.length > 0 && (
              <div className="absolute -top-1 -right-1 bg-[#ff6900] size-5 rounded-full flex items-center justify-center text-white text-[10px]">
                {alerts.length}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Weather Card */}
      <div className="px-5 mb-4">
        <WeatherCard weather={weather} />
      </div>

      {/* Info Cards */}
      <div className="px-5 mb-4">
        <div className="grid grid-cols-3 gap-2">
          <InfoCard
            icon={<Clock className="size-6 text-[#5EB1EF]" />}
            label="Time"
            value={dayjs().format('hh:mm A')}
          />
          <InfoCard
            icon={<Droplets className="size-6 text-[#5EB1EF]" />}
            label="Humidity"
            value={`${weather.humidity}%`}
          />
          <InfoCard
            icon={<Wind className="size-6 text-[#5EB1EF]" />}
            label="Wind"
            value={`${weather.windSpeed} km/h`}
          />
        </div>
      </div>

      {/* Early Warning Section */}
      {alerts && alerts.length > 0 && (
        <div className="px-5">
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
      <header className="bg-white border-b border-neutral-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl text-neutral-900 flex items-center gap-2">
                <Cloud className="size-7 text-[#2B7FFF]" />
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
                  href="#"
                  className="text-sm text-neutral-600 hover:text-[#2B7FFF] transition-colors"
                >
                  What If
                </a>
                <a
                  href="#"
                  className="text-sm text-neutral-600 hover:text-[#2B7FFF] transition-colors"
                >
                  Simulation
                </a>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-neutral-50 rounded-lg cursor-pointer hover:bg-neutral-100 transition-colors">
                <MapPin className="size-5 text-[#2B7FFF]" />
                <span className="text-sm text-[#101828]">{location}</span>
                <ChevronDown className="size-4 text-[#4A5565]" />
              </div>
              <div className="relative">
                <button className="size-10 bg-neutral-100 rounded-full flex items-center justify-center hover:bg-neutral-200 transition-colors">
                  <Bell className="size-5 text-[#364153]" />
                </button>
                {alerts && alerts.length > 0 && (
                  <div className="absolute -top-1 -right-1 bg-[#ff6900] size-5 rounded-full flex items-center justify-center text-white text-[10px]">
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
            <WeatherCard weather={weather} />

            {/* Info Cards Row */}
            <div className="grid grid-cols-3 gap-4">
              <InfoCard
                icon={<Clock className="size-6 text-[#5EB1EF]" />}
                label="Time"
                value={dayjs().format('hh:mm A')}
              />
              <InfoCard
                icon={<Droplets className="size-6 text-[#5EB1EF]" />}
                label="Humidity"
                value={`${weather.humidity}%`}
              />
              <InfoCard
                icon={<Wind className="size-6 text-[#5EB1EF]" />}
                label="Wind"
                value={`${weather.windSpeed} km/h`}
              />
            </div>

            {/* Early Warning Section */}
            {alerts && alerts.length > 0 && (
              <EarlyWarningSection alerts={alerts} />
            )}
          </div>

          {/* Right Column - Additional Info */}
          <div className="space-y-6">
            {daily && <WeeklyForecast forecast={daily} />}
            {highlights && <QuickStats highlights={highlights} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function WeatherCard({ weather }: any) {
  // Determine gradient based on weather condition
  const getGradient = () => {
    const condition = weather.condition.toLowerCase();

    if (condition.includes('clear')) {
      return 'from-[#FFB347] to-[#FFCC33]';
    } else if (condition.includes('rain')) {
      return 'from-[#4A90E2] to-[#7EC8E3]';
    } else if (condition.includes('cloud')) {
      return 'from-[#62a4ee] to-[#afd0f8]';
    } else if (condition.includes('thunder')) {
      return 'from-[#5C6BC0] to-[#7986CB]';
    }

    return 'from-[#62a4ee] to-[#afd0f8]';
  };

  return (
    <div
      className={`relative bg-gradient-to-b ${getGradient()} rounded-3xl shadow-lg overflow-hidden h-[180px] lg:h-[240px]`}
    >
      {/* Cloud illustration */}
      <div className="absolute right-4 top-4 opacity-90">
        <div className="relative w-[120px] lg:w-[160px] h-[80px] lg:h-[100px]">
          <svg viewBox="0 0 134 104" fill="none" className="w-full h-full">
            <ellipse
              cx="53.5"
              cy="72.5"
              rx="31.5"
              ry="9.5"
              fill="#4DB4FF"
              opacity="0.3"
            />
            <path
              d="M47 5C63.5685 5 77 18.4315 77 35C77 35.7884 76.9679 36.5696 76.9082 37.3428C80.1933 34.6295 84.4065 33 89 33C99.4934 33 108 41.5066 108 52C108 62.158 100.029 70.4536 90 70.9736V71H17V70.8955C7.44669 69.8961 0 61.8179 0 52C0 42.161 7.47861 34.0677 17.0615 33.0967C18.0434 17.415 31.0708 5 47 5Z"
              fill="url(#cloud-gradient)"
            />
            <defs>
              <linearGradient
                id="cloud-gradient"
                x1="56"
                y1="94.5"
                x2="96.5"
                y2="5"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#0082DF" />
                <stop offset="0.3" stopColor="#48B2FF" stopOpacity="0.75" />
                <stop offset="1" stopColor="#3BADFF" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-6 lg:p-8 h-full flex flex-col justify-between">
        <div>
          <div className="text-7xl lg:text-8xl text-white tracking-tight">
            {weather.temperature}°
            <span className="text-5xl lg:text-6xl">C</span>
          </div>
          <p className="text-[17px] lg:text-lg text-white/90 mt-2 capitalize">
            {weather.conditionDescription}
          </p>
        </div>

        <div className="flex items-center gap-2 text-white/80">
          <MapPin className="size-4" />
          <span className="text-sm">
            {weather.location}, {weather.country}
          </span>
        </div>
      </div>
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
    <div className="bg-white rounded-2xl shadow-sm p-4 lg:p-5">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-[#6a7282]">
          {icon}
          <span className="text-xs lg:text-sm">{label}</span>
        </div>
        <p className="text-xl lg:text-2xl text-neutral-900 font-medium">
          {value}
        </p>
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
            For today, {dayjs().format('HH:mm')}–
            {dayjs().add(2, 'hour').format('HH:mm')}
          </p>
        </div>
        <button className="flex items-center gap-1 text-[#2b7fff] text-[15px] hover:underline">
          See more
          <ChevronRight className="size-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {alerts.slice(0, 2).map((alert: any) => (
          <WarningCard
            key={alert.id}
            type={alert.type}
            location={alert.location}
            description={alert.description}
            icon={
              alert.type.toLowerCase().includes('thunder') ? (
                <Zap className="size-6 text-white" />
              ) : (
                <Wind className="size-6 text-white" />
              )
            }
          />
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
    <div className="bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="bg-gradient-to-b from-[#62a4ee] to-[#afd0f8] p-5">
        <div className="bg-white/20 backdrop-blur-sm w-12 h-12 rounded-lg flex items-center justify-center mb-3">
          {icon}
        </div>
        <p className="text-sm text-white font-medium">{type}</p>
      </div>
      <div className="bg-white p-5">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="size-4 text-[#364153]" />
          <p className="text-[13px] text-[#101828]">{location}</p>
        </div>
        <p className="text-xs text-[#4a5565] leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

function WeeklyForecast({ forecast }: any) {
  // Map weather icons
  const getWeatherEmoji = (condition: string) => {
    const cond = condition.toLowerCase();
    if (cond.includes('clear')) return '☀️';
    if (cond.includes('cloud')) return '☁️';
    if (cond.includes('rain')) return '🌧️';
    if (cond.includes('thunder')) return '⛈️';
    if (cond.includes('snow')) return '❄️';
    return '⛅';
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h3 className="text-lg text-neutral-900 font-semibold mb-4">
        Weekly Forecast
      </h3>
      <div className="space-y-3">
        {forecast.slice(0, 5).map((day: any, index: number) => (
          <div
            key={day.date}
            className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">
                {getWeatherEmoji(day.condition)}
              </span>
              <div>
                <span className="text-sm text-neutral-900 font-medium">
                  {index === 0 ? 'Today' : day.day}
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
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h3 className="text-lg text-neutral-900 font-semibold mb-4">
        Today's Highlights
      </h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
          <div className="flex items-center gap-2">
            <Sun className="size-5 text-orange-600" />
            <span className="text-sm text-neutral-700 font-medium">
              UV Index
            </span>
          </div>
          <span className="text-neutral-900 font-semibold">
            {highlights.uvIndex} ({highlights.uvLevel})
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
          <div className="flex items-center gap-2">
            <Eye className="size-5 text-blue-600" />
            <span className="text-sm text-neutral-700 font-medium">
              Visibility
            </span>
          </div>
          <span className="text-neutral-900 font-semibold">
            {highlights.visibility} km
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
          <div className="flex items-center gap-2">
            <Gauge className="size-5 text-purple-600" />
            <span className="text-sm text-neutral-700 font-medium">
              Pressure
            </span>
          </div>
          <span className="text-neutral-900 font-semibold">
            {highlights.pressure} mb
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg">
          <div className="flex items-center gap-2">
            <Thermometer className="size-5 text-pink-600" />
            <span className="text-sm text-neutral-700 font-medium">
              Feels Like
            </span>
          </div>
          <span className="text-neutral-900 font-semibold">
            {highlights.feelsLike}°C
          </span>
        </div>
      </div>
    </div>
  );
}

function BottomTabBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-neutral-200 px-6 pt-3 pb-6 rounded-t-[32px] shadow-[0px_-4px_20px_0px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-between max-w-md mx-auto">
        <TabButton icon={<Cloud className="size-6" />} label="Simulation" />
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
    <button className="flex flex-col items-center gap-1.5 relative">
      {active && (
        <>
          <div className="absolute -top-2 size-1 bg-[#00c950] rounded-full" />
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#51a2ff] to-[#a9dbb2] flex items-center justify-center shadow-md">
            {icon}
          </div>
        </>
      )}
      {!active && (
        <div className="w-12 h-12 flex items-center justify-center text-[#6A7282]">
          {icon}
        </div>
      )}
      <span
        className={`text-[11px] ${active ? 'text-[#101828]' : 'text-[#4a5565]'}`}
      >
        {label}
      </span>
    </button>
  );
}