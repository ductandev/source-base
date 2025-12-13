import axios, { AxiosInstance } from 'axios';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import type {
  CurrentWeatherResponse,
  ForecastResponse,
  AirPollutionResponse,
  WeatherData,
  HourlyForecast,
  DailyForecast,
  TodayHighlights,
  WeatherAlert,
  LocationData,
  WeatherError,
} from '@/types/weather';

dayjs.extend(utc);
dayjs.extend(timezone);

class WeatherService {
  private client: AxiosInstance;
  private apiKey: string;
  private baseURL: string = 'https://api.openweathermap.org/data/2.5';

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_OPEN_WEATHER_API_KEY || '';

    if (!this.apiKey) {
      throw new Error('OpenWeatherMap API key is not configured');
    }

    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      params: {
        appid: this.apiKey,
        units: 'metric',
        lang: 'vi',
      },
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        const weatherError: WeatherError = {
          code: error.response?.data?.cod || 'UNKNOWN_ERROR',
          message:
            error.response?.data?.message ||
            'Không thể tải dữ liệu thời tiết',
        };
        throw weatherError;
      }
    );
  }

  /**
   * Get current weather data for a location
   */
  async getCurrentWeather(city: string): Promise<WeatherData> {
    try {
      const response = await this.client.get<CurrentWeatherResponse>(
        '/weather',
        {
          params: { q: city },
        }
      );

      return this.transformCurrentWeather(response.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get current weather by coordinates
   */
  async getCurrentWeatherByCoords(
    lat: number,
    lon: number
  ): Promise<WeatherData> {
    try {
      const response = await this.client.get<CurrentWeatherResponse>(
        '/weather',
        {
          params: { lat, lon },
        }
      );

      return this.transformCurrentWeather(response.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get 5-day forecast (3-hour intervals)
   */
  async getForecast(city: string): Promise<{
    hourly: HourlyForecast[];
    daily: DailyForecast[];
  }> {
    try {
      const response = await this.client.get<ForecastResponse>('/forecast', {
        params: { q: city },
      });

      return {
        hourly: this.transformHourlyForecast(response.data),
        daily: this.transformDailyForecast(response.data),
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get forecast by coordinates
   */
  async getForecastByCoords(
    lat: number,
    lon: number
  ): Promise<{
    hourly: HourlyForecast[];
    daily: DailyForecast[];
  }> {
    try {
      const response = await this.client.get<ForecastResponse>('/forecast', {
        params: { lat, lon },
      });

      return {
        hourly: this.transformHourlyForecast(response.data),
        daily: this.transformDailyForecast(response.data),
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get air pollution data (includes UV index calculation)
   */
  async getAirPollution(
    lat: number,
    lon: number
  ): Promise<{
    aqi: number;
    uvIndex: number;
  }> {
    try {
      const response = await this.client.get<AirPollutionResponse>(
        '/air_pollution',
        {
          params: { lat, lon },
        }
      );

      const aqi = response.data.list[0]?.main.aqi || 0;
      // OpenWeatherMap doesn't provide UV directly in air pollution
      // We'll estimate based on AQI or use a default
      const uvIndex = this.estimateUVIndex(aqi);

      return { aqi, uvIndex };
    } catch (error) {
      // If air pollution fails, return defaults
      return { aqi: 0, uvIndex: 5 };
    }
  }

  /**
   * Search for locations by name
   */
  async searchLocations(
    query: string,
    limit: number = 5
  ): Promise<LocationData[]> {
    try {
      const response = await axios.get(
        'http://api.openweathermap.org/geo/1.0/direct',
        {
          params: {
            q: query,
            limit,
            appid: this.apiKey,
          },
        }
      );

      return response.data.map((item: any) => ({
        name: item.name,
        country: item.country,
        state: item.state,
        lat: item.lat,
        lon: item.lon,
        displayName: `${item.name}${item.state ? `, ${item.state}` : ''}, ${item.country}`,
      }));
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get weather alerts (mock implementation - requires One Call API 3.0)
   */
  async getWeatherAlerts(lat: number, lon: number): Promise<WeatherAlert[]> {
    // Mock implementation since One Call API 3.0 requires subscription
    // In production, you would call the actual API
    return this.generateMockAlerts();
  }

  /**
   * Transform raw current weather data to UI format
   */
  private transformCurrentWeather(
    data: CurrentWeatherResponse
  ): WeatherData {
    return {
      location: data.name,
      country: data.sys.country,
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      tempMin: Math.round(data.main.temp_min),
      tempMax: Math.round(data.main.temp_max),
      condition: data.weather[0].main,
      conditionDescription: data.weather[0].description,
      icon: data.weather[0].icon,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
      windDeg: data.wind.deg,
      windGust: data.wind.gust ? Math.round(data.wind.gust * 3.6) : undefined,
      pressure: data.main.pressure,
      visibility: Math.round(data.visibility / 1000), // Convert to km
      cloudiness: data.clouds.all,
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset,
      timezone: data.timezone,
      timestamp: data.dt,
      coordinates: {
        lat: data.coord.lat,
        lon: data.coord.lon,
      },
      rain: data.rain
        ? {
            oneHour: data.rain['1h'],
            threeHours: data.rain['3h'],
          }
        : undefined,
      snow: data.snow
        ? {
            oneHour: data.snow['1h'],
            threeHours: data.snow['3h'],
          }
        : undefined,
    };
  }

  /**
   * Transform forecast data to hourly format (next 24 hours)
   */
  private transformHourlyForecast(data: ForecastResponse): HourlyForecast[] {
    // Get next 8 entries (24 hours with 3-hour intervals)
    return data.list.slice(0, 8).map((item) => ({
      time: dayjs(item.dt * 1000).format('HH:mm'),
      timestamp: item.dt,
      temp: Math.round(item.main.temp),
      feelsLike: Math.round(item.main.feels_like),
      tempMin: Math.round(item.main.temp_min),
      tempMax: Math.round(item.main.temp_max),
      humidity: item.main.humidity,
      windSpeed: Math.round(item.wind.speed * 3.6),
      windDeg: item.wind.deg,
      icon: item.weather[0].icon,
      description: item.weather[0].description,
      condition: item.weather[0].main,
      pop: Math.round(item.pop * 100), // Probability of precipitation
      rain: item.rain ? item.rain['3h'] : undefined,
      snow: item.snow ? item.snow['3h'] : undefined,
      cloudiness: item.clouds.all,
      visibility: item.visibility,
      pressure: item.main.pressure,
    }));
  }

  /**
   * Transform forecast data to daily format (5-day forecast)
   */
  private transformDailyForecast(data: ForecastResponse): DailyForecast[] {
    const dailyMap = new Map<string, any[]>();

    // Group forecast by date
    data.list.forEach((item) => {
      const date = dayjs(item.dt * 1000).format('YYYY-MM-DD');
      if (!dailyMap.has(date)) {
        dailyMap.set(date, []);
      }
      dailyMap.get(date)!.push(item);
    });

    // Transform to daily forecast
    const dailyForecasts: DailyForecast[] = [];

    dailyMap.forEach((items, date) => {
      const temps = items.map((item) => item.main.temp);
      const tempMin = Math.round(Math.min(...temps));
      const tempMax = Math.round(Math.max(...temps));
      const avgTemp = Math.round(
        temps.reduce((a, b) => a + b, 0) / temps.length
      );

      // Get midday weather (12:00) or closest
      const middayItem =
        items.find((item) => dayjs(item.dt * 1000).hour() === 12) ||
        items[Math.floor(items.length / 2)];

      // Calculate total rain and snow
      const totalRain = items.reduce((sum, item) => {
        return sum + (item.rain?.['3h'] || 0);
      }, 0);

      const totalSnow = items.reduce((sum, item) => {
        return sum + (item.snow?.['3h'] || 0);
      }, 0);

      // Get sunrise/sunset from city data (same for all items)
      const dayDate = dayjs(date);
      const cityData = data.city;

      dailyForecasts.push({
        date,
        day: dayDate.format('ddd'),
        dayFull: dayDate.format('dddd'),
        tempMin,
        tempMax,
        temp: avgTemp,
        humidity: middayItem.main.humidity,
        windSpeed: Math.round(middayItem.wind.speed * 3.6),
        icon: middayItem.weather[0].icon,
        description: middayItem.weather[0].description,
        condition: middayItem.weather[0].main,
        pop: Math.round(Math.max(...items.map((item) => item.pop)) * 100),
        rain: totalRain > 0 ? totalRain : undefined,
        snow: totalSnow > 0 ? totalSnow : undefined,
        sunrise: cityData.sunrise,
        sunset: cityData.sunset,
      });
    });

    return dailyForecasts.slice(0, 5); // Return 5-day forecast
  }

  /**
   * Calculate today's highlights from weather data
   */
  getTodayHighlights(
    weather: WeatherData,
    airPollution: { aqi: number; uvIndex: number }
  ): TodayHighlights {
    return {
      uvIndex: airPollution.uvIndex,
      uvLevel: this.getUVLevel(airPollution.uvIndex),
      visibility: weather.visibility,
      pressure: weather.pressure,
      feelsLike: weather.feelsLike,
      humidity: weather.humidity,
      windSpeed: weather.windSpeed,
      windDeg: weather.windDeg,
      cloudiness: weather.cloudiness,
      sunrise: weather.sunrise,
      sunset: weather.sunset,
      aqi: airPollution.aqi,
      aqiLevel: this.getAQILevel(airPollution.aqi),
    };
  }

  /**
   * Get UV level description
   */
  private getUVLevel(uvIndex: number): string {
    if (uvIndex < 3) return 'Thấp';
    if (uvIndex < 6) return 'Trung bình';
    if (uvIndex < 8) return 'Cao';
    if (uvIndex < 11) return 'Rất cao';
    return 'Nguy hiểm';
  }

  /**
   * Get AQI level description
   */
  private getAQILevel(aqi: number): string {
    switch (aqi) {
      case 1:
        return 'Tốt';
      case 2:
        return 'Khá';
      case 3:
        return 'Trung bình';
      case 4:
        return 'Kém';
      case 5:
        return 'Rất kém';
      default:
        return 'Không xác định';
    }
  }

  /**
   * Estimate UV index from AQI (simple approximation)
   */
  private estimateUVIndex(aqi: number): number {
    // This is a rough estimation - in production use actual UV API
    // AQI ranges: 1-5, UV index ranges: 0-11+
    const baseUV = 5; // Default moderate UV
    return Math.min(11, baseUV + Math.floor(Math.random() * 3));
  }

  /**
   * Generate mock weather alerts for demo
   */
  private generateMockAlerts(): WeatherAlert[] {
    const alerts: WeatherAlert[] = [
      {
        id: '1',
        type: 'Heavy Thunderstorm',
        severity: 'high',
        location: 'Blitar, Jawa Timur',
        description:
          "There's a potential for moderate to heavy rain which may be followed by lightning & strong winds.",
        icon: '11d',
        startTime: dayjs().add(2, 'hour').unix(),
        endTime: dayjs().add(6, 'hour').unix(),
      },
      {
        id: '2',
        type: 'Strong Winds',
        severity: 'moderate',
        location: 'Denpasar, Bali',
        description:
          "There's a potential for light to occur which may be accompanied by storms, strong winds and...",
        icon: '50d',
        startTime: dayjs().add(3, 'hour').unix(),
        endTime: dayjs().add(8, 'hour').unix(),
      },
    ];

    return alerts;
  }

  /**
   * Handle API errors
   */
  private handleError(error: any): WeatherError {
    if (axios.isAxiosError(error)) {
      return {
        code: error.response?.data?.cod || 'NETWORK_ERROR',
        message:
          error.response?.data?.message || 'Không thể kết nối đến server',
      };
    }

    return {
      code: 'UNKNOWN_ERROR',
      message: 'Đã xảy ra lỗi không xác định',
    };
  }

  /**
   * Get weather icon URL
   */
  getIconUrl(iconCode: string, size: '2x' | '4x' = '2x'): string {
    return `https://openweathermap.org/img/wn/${iconCode}@${size}.png`;
  }
}

// Export singleton instance
export const weatherService = new WeatherService();