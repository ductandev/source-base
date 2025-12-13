import { useState, useEffect } from 'react';
import { weatherService } from '@/api/openWeather/api';

interface GeolocationState {
  loading: boolean;
  error: string | null;
  location: {
    lat: number;
    lon: number;
  } | null;
}

export function useGeolocation(shouldGetLocation: boolean) {
  const [state, setState] = useState<GeolocationState>({
    loading: false,
    error: null,
    location: null,
  });

  useEffect(() => {
    if (!shouldGetLocation) return;

    if (!navigator.geolocation) {
      setState({
        loading: false,
        error: 'Geolocation is not supported by your browser',
        location: null,
      });
      return;
    }

    setState({ loading: true, error: null, location: null });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          loading: false,
          error: null,
          location: {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          },
        });
      },
      (error) => {
        setState({
          loading: false,
          error: error.message,
          location: null,
        });
      }
    );
  }, [shouldGetLocation]);

  return state;
}