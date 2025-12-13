import axios, { AxiosInstance } from 'axios';

export interface GoongPlace {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  compound?: {
    district?: string;
    commune?: string;
    province?: string;
  };
}

export interface GoongPrediction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

export interface GoongAutocompleteResponse {
  predictions: GoongPrediction[];
  status: string;
}

export interface GoongPlaceDetailResponse {
  result: GoongPlace;
  status: string;
}

export interface GoongGeocodingResponse {
  results: GoongPlace[];
  status: string;
}

class GoongService {
  private client: AxiosInstance;
  private apiKey: string;
  private baseURL: string = 'https://rsapi.goong.io';

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_GOONG_API_KEY || '';

    if (!this.apiKey) {
      throw new Error('Goong API key is not configured');
    }

    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      params: {
        api_key: this.apiKey,
      },
    });
  }

  /**
   * Autocomplete search for places
   */
  async autocomplete(input: string, location?: string): Promise<GoongPrediction[]> {
    try {
      const params: any = {
        input,
        api_key: this.apiKey,
      };

      if (location) {
        params.location = location;
      }

      const response = await this.client.get<GoongAutocompleteResponse>(
        '/Place/AutoComplete',
        { params }
      );

      if (response.data.status === 'OK') {
        return response.data.predictions;
      }

      return [];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 429) {
          console.warn('Rate limit reached. Please wait before searching again.');
          throw new Error('Quá nhiều yêu cầu. Vui lòng đợi và thử lại.');
        }
      }
      console.error('Goong autocomplete error:', error);
      return [];
    }
  }

  /**
   * Get place details by place_id
   */
  async getPlaceDetail(placeId: string): Promise<GoongPlace | null> {
    try {
      const response = await this.client.get<GoongPlaceDetailResponse>(
        '/Place/Detail',
        {
          params: {
            place_id: placeId,
            api_key: this.apiKey,
          },
        }
      );

      if (response.data.status === 'OK') {
        return response.data.result;
      }

      return null;
    } catch (error) {
      console.error('Goong place detail error:', error);
      return null;
    }
  }

  /**
   * Geocoding - Convert address to coordinates
   */
  async geocode(address: string): Promise<GoongPlace | null> {
    try {
      const response = await this.client.get<GoongGeocodingResponse>(
        '/Geocode',
        {
          params: {
            address,
            api_key: this.apiKey,
          },
        }
      );

      if (response.data.status === 'OK' && response.data.results.length > 0) {
        return response.data.results[0];
      }

      return null;
    } catch (error) {
      console.error('Goong geocoding error:', error);
      return null;
    }
  }

  /**
   * Reverse geocoding - Convert coordinates to address
   */
  async reverseGeocode(lat: number, lng: number): Promise<GoongPlace | null> {
    try {
      const response = await this.client.get<GoongGeocodingResponse>(
        '/Geocode',
        {
          params: {
            latlng: `${lat},${lng}`,
            api_key: this.apiKey,
          },
        }
      );

      if (response.data.status === 'OK' && response.data.results.length > 0) {
        return response.data.results[0];
      }

      return null;
    } catch (error) {
      console.error('Goong reverse geocoding error:', error);
      return null;
    }
  }

  /**
   * Get map embed URL
   */
  getMapEmbedUrl(lat: number, lng: number, zoom: number = 15): string {
    const mapId = process.env.NEXT_PUBLIC_GOONG_MAPTILES_KEY || '';
    return `https://maps.goong.io/maps/embed?mid=${mapId}&lat=${lat}&long=${lng}&z=${zoom}`;
  }

  /**
   * Get static map image URL
   */
  getStaticMapUrl(
    lat: number,
    lng: number,
    zoom: number = 15,
    width: number = 600,
    height: number = 400,
    marker?: boolean
  ): string {
    let url = `https://rsapi.goong.io/staticmap?center=${lat},${lng}&zoom=${zoom}&width=${width}&height=${height}&api_key=${this.apiKey}`;

    if (marker) {
      url += `&markers=color:red|${lat},${lng}`;
    }

    return url;
  }
}

// Export singleton instance
export const goongService = new GoongService();