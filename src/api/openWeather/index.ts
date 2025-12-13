import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { weatherService } from '@/api/openWeather/api';
import type {
  WeatherData,
  HourlyForecast,
  DailyForecast,
  TodayHighlights,
  WeatherAlert,
  LocationData,
  WeatherError,
} from '@/types/weather';

// ============================================================================
// QUERY KEYS
// ============================================================================

export const weatherKeys = {
  all: ['weather'] as const,
  current: (location: string) =>
    [...weatherKeys.all, 'current', location] as const,
  currentByCoords: (lat: number, lon: number) =>
    [...weatherKeys.all, 'current', lat, lon] as const,
  forecast: (location: string) =>
    [...weatherKeys.all, 'forecast', location] as const,
  forecastByCoords: (lat: number, lon: number) =>
    [...weatherKeys.all, 'forecast', lat, lon] as const,
  airPollution: (lat: number, lon: number) =>
    [...weatherKeys.all, 'air-pollution', lat, lon] as const,
  alerts: (lat: number, lon: number) =>
    [...weatherKeys.all, 'alerts', lat, lon] as const,
  locations: (query: string) =>
    [...weatherKeys.all, 'locations', query] as const,
};

// ============================================================================
// STALE TIMES
// ============================================================================

const STALE_TIME = {
  CURRENT_WEATHER: 10 * 60 * 1000, // 10 minutes
  FORECAST: 30 * 60 * 1000, // 30 minutes
  AIR_POLLUTION: 60 * 60 * 1000, // 1 hour
  ALERTS: 30 * 60 * 1000, // 30 minutes
  LOCATIONS: 5 * 60 * 1000, // 5 minutes
} as const;

// ============================================================================
// HOOKS
// ============================================================================

/**
 * Hook to fetch current weather by city name
 */
export function useCurrentWeather(
  city: string,
  enabled: boolean = true
): UseQueryResult<WeatherData, WeatherError> {
  return useQuery<WeatherData, WeatherError>({
    queryKey: weatherKeys.current(city),
    queryFn: () => weatherService.getCurrentWeather(city),
    enabled: enabled && !!city,
    staleTime: STALE_TIME.CURRENT_WEATHER,
    gcTime: STALE_TIME.CURRENT_WEATHER * 2,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook to fetch current weather by coordinates
 */
export function useCurrentWeatherByCoords(
  lat: number,
  lon: number,
  enabled: boolean = true
): UseQueryResult<WeatherData, WeatherError> {
  return useQuery<WeatherData, WeatherError>({
    queryKey: weatherKeys.currentByCoords(lat, lon),
    queryFn: () => weatherService.getCurrentWeatherByCoords(lat, lon),
    enabled: enabled && !!lat && !!lon,
    staleTime: STALE_TIME.CURRENT_WEATHER,
    gcTime: STALE_TIME.CURRENT_WEATHER * 2,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook to fetch forecast by city name
 */
export function useForecast(
  city: string,
  enabled: boolean = true
): UseQueryResult<
  {
    hourly: HourlyForecast[];
    daily: DailyForecast[];
  },
  WeatherError
> {
  return useQuery<
    {
      hourly: HourlyForecast[];
      daily: DailyForecast[];
    },
    WeatherError
  >({
    queryKey: weatherKeys.forecast(city),
    queryFn: () => weatherService.getForecast(city),
    enabled: enabled && !!city,
    staleTime: STALE_TIME.FORECAST,
    gcTime: STALE_TIME.FORECAST * 2,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook to fetch forecast by coordinates
 */
export function useForecastByCoords(
  lat: number,
  lon: number,
  enabled: boolean = true
): UseQueryResult<
  {
    hourly: HourlyForecast[];
    daily: DailyForecast[];
  },
  WeatherError
> {
  return useQuery<
    {
      hourly: HourlyForecast[];
      daily: DailyForecast[];
    },
    WeatherError
  >({
    queryKey: weatherKeys.forecastByCoords(lat, lon),
    queryFn: () => weatherService.getForecastByCoords(lat, lon),
    enabled: enabled && !!lat && !!lon,
    staleTime: STALE_TIME.FORECAST,
    gcTime: STALE_TIME.FORECAST * 2,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook to fetch air pollution data
 */
export function useAirPollution(
  lat: number,
  lon: number,
  enabled: boolean = true
): UseQueryResult<
  {
    aqi: number;
    uvIndex: number;
  },
  WeatherError
> {
  return useQuery<
    {
      aqi: number;
      uvIndex: number;
    },
    WeatherError
  >({
    queryKey: weatherKeys.airPollution(lat, lon),
    queryFn: () => weatherService.getAirPollution(lat, lon),
    enabled: enabled && !!lat && !!lon,
    staleTime: STALE_TIME.AIR_POLLUTION,
    gcTime: STALE_TIME.AIR_POLLUTION * 2,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook to fetch weather alerts
 */
export function useWeatherAlerts(
  lat: number,
  lon: number,
  enabled: boolean = true
): UseQueryResult<WeatherAlert[], WeatherError> {
  return useQuery<WeatherAlert[], WeatherError>({
    queryKey: weatherKeys.alerts(lat, lon),
    queryFn: () => weatherService.getWeatherAlerts(lat, lon),
    enabled: enabled && !!lat && !!lon,
    staleTime: STALE_TIME.ALERTS,
    gcTime: STALE_TIME.ALERTS * 2,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook to search locations
 */
export function useLocationSearch(
  query: string,
  enabled: boolean = true
): UseQueryResult<LocationData[], WeatherError> {
  return useQuery<LocationData[], WeatherError>({
    queryKey: weatherKeys.locations(query),
    queryFn: () => weatherService.searchLocations(query),
    enabled: enabled && query.length >= 2,
    staleTime: STALE_TIME.LOCATIONS,
    gcTime: STALE_TIME.LOCATIONS * 2,
    retry: 1,
  });
}

// ============================================================================
// COMBINED HOOK
// ============================================================================

/**
 * Combined hook to fetch all weather data
 */
export function useWeatherData(location: string) {
  const currentWeather = useCurrentWeather(location);
  const forecast = useForecast(location);

  const airPollution = useAirPollution(
    currentWeather.data?.coordinates.lat || 0,
    currentWeather.data?.coordinates.lon || 0,
    !!currentWeather.data
  );

  const alerts = useWeatherAlerts(
    currentWeather.data?.coordinates.lat || 0,
    currentWeather.data?.coordinates.lon || 0,
    !!currentWeather.data
  );

  const isLoading = currentWeather.isLoading || forecast.isLoading;

  const isError = currentWeather.isError || forecast.isError;

  const error = currentWeather.error || forecast.error;

  const todayHighlights: TodayHighlights | undefined =
    currentWeather.data && airPollution.data
      ? weatherService.getTodayHighlights(
          currentWeather.data,
          airPollution.data
        )
      : undefined;

  return {
    currentWeather: currentWeather.data,
    hourlyForecast: forecast.data?.hourly,
    dailyForecast: forecast.data?.daily,
    todayHighlights,
    alerts: alerts.data || [],
    isLoading,
    isError,
    error,
    refetch: () => {
      currentWeather.refetch();
      forecast.refetch();
      airPollution.refetch();
      alerts.refetch();
    },
  };
}