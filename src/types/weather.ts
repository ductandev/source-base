/**
 * Weather API Types
 * Comprehensive TypeScript definitions for OpenWeatherMap API responses
 */

// ============================================================================
// API RESPONSE TYPES (Raw from OpenWeatherMap)
// ============================================================================

/**
 * Current Weather API Response
 * Endpoint: /data/2.5/weather
 */
export interface CurrentWeatherResponse {
  coord: {
    lon: number;
    lat: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  clouds: {
    all: number;
  };
  rain?: {
    '1h'?: number;
    '3h'?: number;
  };
  snow?: {
    '1h'?: number;
    '3h'?: number;
  };
  dt: number;
  sys: {
    type?: number;
    id?: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

/**
 * 5-Day Forecast API Response
 * Endpoint: /data/2.5/forecast
 */
export interface ForecastResponse {
  cod: string;
  message: number;
  cnt: number;
  list: Array<{
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      sea_level: number;
      grnd_level: number;
      humidity: number;
      temp_kf: number;
    };
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    clouds: {
      all: number;
    };
    wind: {
      speed: number;
      deg: number;
      gust: number;
    };
    visibility: number;
    pop: number;
    rain?: {
      '3h': number;
    };
    snow?: {
      '3h': number;
    };
    sys: {
      pod: string;
    };
    dt_txt: string;
  }>;
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

/**
 * Air Pollution API Response
 * Endpoint: /data/2.5/air_pollution
 */
export interface AirPollutionResponse {
  coord: {
    lon: number;
    lat: number;
  };
  list: Array<{
    main: {
      aqi: number;
    };
    components: {
      co: number;
      no: number;
      no2: number;
      o3: number;
      so2: number;
      pm2_5: number;
      pm10: number;
      nh3: number;
    };
    dt: number;
  }>;
}

/**
 * Geocoding API Response
 * Endpoint: /geo/1.0/direct
 */
export interface GeocodingResponse {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

// ============================================================================
// TRANSFORMED TYPES (For UI Components)
// ============================================================================

/**
 * Current Weather Data (Transformed for UI)
 */
export interface WeatherData {
  location: string;
  country: string;
  temperature: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  condition: string;
  conditionDescription: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  windDeg: number;
  windGust?: number;
  pressure: number;
  visibility: number;
  cloudiness: number;
  sunrise: number;
  sunset: number;
  timezone: number;
  timestamp: number;
  coordinates: {
    lat: number;
    lon: number;
  };
  rain?: {
    oneHour?: number;
    threeHours?: number;
  };
  snow?: {
    oneHour?: number;
    threeHours?: number;
  };
}

/**
 * Hourly Forecast Data
 */
export interface HourlyForecast {
  time: string;
  timestamp: number;
  temp: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  windSpeed: number;
  windDeg: number;
  icon: string;
  description: string;
  condition: string;
  pop: number; // Probability of precipitation (0-100)
  rain?: number;
  snow?: number;
  cloudiness: number;
  visibility: number;
  pressure: number;
}

/**
 * Daily Forecast Data
 */
export interface DailyForecast {
  date: string;
  day: string;
  dayFull: string;
  tempMin: number;
  tempMax: number;
  temp: number; // Average temperature
  humidity: number;
  windSpeed: number;
  icon: string;
  description: string;
  condition: string;
  pop: number; // Probability of precipitation (0-100)
  rain?: number;
  snow?: number;
  sunrise?: number;
  sunset?: number;
}

/**
 * Today's Highlights Data
 */
export interface TodayHighlights {
  uvIndex: number;
  uvLevel: string;
  visibility: number;
  pressure: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDeg: number;
  cloudiness: number;
  sunrise: number;
  sunset: number;
  aqi?: number;
  aqiLevel?: string;
}

/**
 * Weather Alert Data
 */
export interface WeatherAlert {
  id: string;
  type: string;
  severity: 'low' | 'moderate' | 'high' | 'extreme';
  location: string;
  description: string;
  icon: string;
  startTime: number;
  endTime: number;
  source?: string;
  headline?: string;
  instructions?: string;
}

/**
 * Location Data
 */
export interface LocationData {
  name: string;
  country: string;
  countryCode?: string;
  state?: string;
  lat: number;
  lon: number;
  displayName: string;
  localNames?: Record<string, string>;
}

/**
 * Air Quality Data
 */
export interface AirQualityData {
  aqi: number;
  aqiLevel: string;
  components: {
    co: number;
    no: number;
    no2: number;
    o3: number;
    so2: number;
    pm2_5: number;
    pm10: number;
    nh3: number;
  };
  timestamp: number;
  recommendations?: string[];
}

// ============================================================================
// ENUMS & CONSTANTS
// ============================================================================

/**
 * Weather Condition Types
 */
export enum WeatherCondition {
  CLEAR = 'Clear',
  CLOUDS = 'Clouds',
  RAIN = 'Rain',
  DRIZZLE = 'Drizzle',
  THUNDERSTORM = 'Thunderstorm',
  SNOW = 'Snow',
  MIST = 'Mist',
  SMOKE = 'Smoke',
  HAZE = 'Haze',
  DUST = 'Dust',
  FOG = 'Fog',
  SAND = 'Sand',
  ASH = 'Ash',
  SQUALL = 'Squall',
  TORNADO = 'Tornado',
}

/**
 * Air Quality Index Levels
 */
export enum AQILevel {
  GOOD = 1,
  FAIR = 2,
  MODERATE = 3,
  POOR = 4,
  VERY_POOR = 5,
}

/**
 * UV Index Levels
 */
export enum UVLevel {
  LOW = 'Thấp',
  MODERATE = 'Trung bình',
  HIGH = 'Cao',
  VERY_HIGH = 'Rất cao',
  EXTREME = 'Nguy hiểm',
}

/**
 * Temperature Units
 */
export enum TemperatureUnit {
  CELSIUS = 'metric',
  FAHRENHEIT = 'imperial',
  KELVIN = 'standard',
}

/**
 * Wind Direction
 */
export enum WindDirection {
  NORTH = 'Bắc',
  NORTH_EAST = 'Đông Bắc',
  EAST = 'Đông',
  SOUTH_EAST = 'Đông Nam',
  SOUTH = 'Nam',
  SOUTH_WEST = 'Tây Nam',
  WEST = 'Tây',
  NORTH_WEST = 'Tây Bắc',
}

// ============================================================================
// ERROR TYPES
// ============================================================================

/**
 * Weather API Error
 */
export interface WeatherError {
  code: string;
  message: string;
  details?: string;
  statusCode?: number;
}

/**
 * API Error Codes
 */
export enum WeatherErrorCode {
  INVALID_API_KEY = '401',
  NOT_FOUND = '404',
  RATE_LIMIT = '429',
  SERVER_ERROR = '500',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Weather API Query Parameters
 */
export interface WeatherQueryParams {
  q?: string; // City name
  lat?: number; // Latitude
  lon?: number; // Longitude
  appid: string; // API key
  units?: TemperatureUnit;
  lang?: string; // Language code
}

/**
 * Forecast Query Parameters
 */
export interface ForecastQueryParams extends WeatherQueryParams {
  cnt?: number; // Number of timestamps
}

/**
 * Geocoding Query Parameters
 */
export interface GeocodingQueryParams {
  q: string; // City name, state code, country code
  limit?: number; // Number of results (1-5)
  appid: string; // API key
}

/**
 * Air Pollution Query Parameters
 */
export interface AirPollutionQueryParams {
  lat: number;
  lon: number;
  appid: string;
}

/**
 * Weather Service Configuration
 */
export interface WeatherServiceConfig {
  apiKey: string;
  baseURL?: string;
  timeout?: number;
  defaultUnits?: TemperatureUnit;
  defaultLang?: string;
}

/**
 * Cache Configuration
 */
export interface CacheConfig {
  currentWeatherStaleTime: number;
  forecastStaleTime: number;
  airPollutionStaleTime: number;
  geocodingStaleTime: number;
}

// ============================================================================
// COMPONENT PROP TYPES
// ============================================================================

/**
 * Current Weather Card Props
 */
export interface CurrentWeatherCardProps {
  data: WeatherData;
  onRefresh?: () => void;
  isLoading?: boolean;
}

/**
 * Weekly Forecast Props
 */
export interface WeeklyForecastProps {
  forecast: DailyForecast[];
  isLoading?: boolean;
}

/**
 * Today's Highlights Props
 */
export interface TodayHighlightsProps {
  highlights: TodayHighlights;
  isLoading?: boolean;
}

/**
 * Weather Alerts Props
 */
export interface WeatherAlertsProps {
  alerts: WeatherAlert[];
  isLoading?: boolean;
}

/**
 * Location Selector Props
 */
export interface LocationSelectorProps {
  onLocationSelect?: (location: LocationData) => void;
  defaultLocation?: LocationData;
}

/**
 * Hourly Forecast Props
 */
export interface HourlyForecastProps {
  forecast: HourlyForecast[];
  isLoading?: boolean;
}

// ============================================================================
// HOOK RETURN TYPES
// ============================================================================

/**
 * Use Weather Data Hook Return Type
 */
export interface UseWeatherDataReturn {
  currentWeather?: WeatherData;
  hourlyForecast?: HourlyForecast[];
  dailyForecast?: DailyForecast[];
  todayHighlights?: TodayHighlights;
  alerts: WeatherAlert[];
  isLoading: boolean;
  isError: boolean;
  error: WeatherError | null;
  refetch: () => void;
}

/**
 * Use Location Search Hook Return Type
 */
export interface UseLocationSearchReturn {
  locations: LocationData[];
  isLoading: boolean;
  isError: boolean;
  error: WeatherError | null;
}

// ============================================================================
// STORE TYPES
// ============================================================================

/**
 * Location Store State
 */
export interface LocationStoreState {
  selectedLocation: string;
  locationData: LocationData | null;
  recentLocations: LocationData[];
  setSelectedLocation: (location: string, data?: LocationData) => void;
  addRecentLocation: (location: LocationData) => void;
  clearRecentLocations: () => void;
}

/**
 * Weather Store State (Optional - if using global state)
 */
export interface WeatherStoreState {
  currentWeather: WeatherData | null;
  dailyForecast: DailyForecast[];
  hourlyForecast: HourlyForecast[];
  alerts: WeatherAlert[];
  isLoading: boolean;
  error: WeatherError | null;
  setWeatherData: (data: WeatherData) => void;
  setForecast: (daily: DailyForecast[], hourly: HourlyForecast[]) => void;
  setAlerts: (alerts: WeatherAlert[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: WeatherError | null) => void;
  clearWeatherData: () => void;
}

// ============================================================================
// TYPE GUARDS
// ============================================================================

/**
 * Check if error is a WeatherError
 */
export function isWeatherError(error: unknown): error is WeatherError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error
  );
}

/**
 * Check if response is CurrentWeatherResponse
 */
export function isCurrentWeatherResponse(
  data: unknown
): data is CurrentWeatherResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'main' in data &&
    'weather' in data &&
    'coord' in data
  );
}

/**
 * Check if response is ForecastResponse
 */
export function isForecastResponse(data: unknown): data is ForecastResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'list' in data &&
    'city' in data &&
    Array.isArray((data as ForecastResponse).list)
  );
}

// ============================================================================
// HELPER TYPE DEFINITIONS
// ============================================================================

/**
 * Partial Weather Data (for updates)
 */
export type PartialWeatherData = Partial<WeatherData>;

/**
 * Weather Data with Loading State
 */
export type WeatherDataWithLoading = {
  data: WeatherData | null;
  isLoading: boolean;
  error: WeatherError | null;
};

/**
 * Forecast Data with Loading State
 */
export type ForecastDataWithLoading = {
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  isLoading: boolean;
  error: WeatherError | null;
};

/**
 * Location with Weather Data
 */
export type LocationWithWeather = LocationData & {
  weather?: WeatherData;
  lastUpdated?: number;
};

// ============================================================================
// CONSTANTS AS TYPES
// ============================================================================

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  CURRENT_WEATHER: '/data/2.5/weather',
  FORECAST: '/data/2.5/forecast',
  AIR_POLLUTION: '/data/2.5/air_pollution',
  GEOCODING: '/geo/1.0/direct',
  REVERSE_GEOCODING: '/geo/1.0/reverse',
} as const;

export type APIEndpoint = (typeof API_ENDPOINTS)[keyof typeof API_ENDPOINTS];

/**
 * Supported Languages
 */
export const SUPPORTED_LANGUAGES = {
  VI: 'vi',
  EN: 'en',
  KO: 'ko',
  JA: 'ja',
  ZH_CN: 'zh_cn',
  ZH_TW: 'zh_tw',
} as const;

export type SupportedLanguage =
  (typeof SUPPORTED_LANGUAGES)[keyof typeof SUPPORTED_LANGUAGES];

/**
 * Default Stale Times (in milliseconds)
 */
export const DEFAULT_STALE_TIMES = {
  CURRENT_WEATHER: 10 * 60 * 1000, // 10 minutes
  FORECAST: 30 * 60 * 1000, // 30 minutes
  AIR_POLLUTION: 60 * 60 * 1000, // 1 hour
  GEOCODING: 5 * 60 * 1000, // 5 minutes
} as const;

export type StaleTimeKey = keyof typeof DEFAULT_STALE_TIMES;