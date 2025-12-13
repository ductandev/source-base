import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

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

interface LocationState {
  selectedLocation: string;
  locationData: LocationData | null;
  recentLocations: LocationData[];
  favoriteLocations: LocationData[];

  setSelectedLocation: (location: string, data?: LocationData) => void;
  addRecentLocation: (location: LocationData) => void;
  clearRecentLocations: () => void;
  addFavoriteLocation: (location: LocationData) => void;
  removeFavoriteLocation: (displayName: string) => void;
  isFavorite: (displayName: string) => boolean;
}

const MAX_RECENT_LOCATIONS = 5;
const MAX_FAVORITE_LOCATIONS = 10;

export const useLocationStore = create<LocationState>()(
  persist(
    (set, get) => ({
      selectedLocation: 'Nha Trang',
      locationData: {
        name: 'Nha Trang',
        country: 'VN',
        countryCode: 'VN',
        lat: 12.2388,
        lon: 109.1967,
        displayName: 'Nha Trang, Viet Nam',
      },
      recentLocations: [],
      favoriteLocations: [],

      setSelectedLocation: (location: string, data?: LocationData) => {
        set({ selectedLocation: location });

        if (data) {
          set({ locationData: data });
          get().addRecentLocation(data);
        }
      },

      addRecentLocation: (location: LocationData) => {
        const { recentLocations } = get();

        // Remove if already exists
        const filtered = recentLocations.filter(
          (loc) => loc.displayName !== location.displayName
        );

        // Add to front and limit to MAX
        const updated = [location, ...filtered].slice(0, MAX_RECENT_LOCATIONS);

        set({ recentLocations: updated });
      },

      clearRecentLocations: () => {
        set({ recentLocations: [] });
      },

      addFavoriteLocation: (location: LocationData) => {
        const { favoriteLocations } = get();

        // Check if already exists
        const exists = favoriteLocations.some(
          (loc) => loc.displayName === location.displayName
        );

        if (!exists && favoriteLocations.length < MAX_FAVORITE_LOCATIONS) {
          set({ favoriteLocations: [...favoriteLocations, location] });
        }
      },

      removeFavoriteLocation: (displayName: string) => {
        const { favoriteLocations } = get();
        const filtered = favoriteLocations.filter(
          (loc) => loc.displayName !== displayName
        );
        set({ favoriteLocations: filtered });
      },

      isFavorite: (displayName: string) => {
        const { favoriteLocations } = get();
        return favoriteLocations.some((loc) => loc.displayName === displayName);
      },
    }),
    {
      name: 'weather-location-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        selectedLocation: state.selectedLocation,
        locationData: state.locationData,
        recentLocations: state.recentLocations,
        favoriteLocations: state.favoriteLocations,
      }),
    }
  )
);