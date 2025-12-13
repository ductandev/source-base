export interface LocationData {
  address: string;
  coordinates: Coordinates;
  placeId?: string;
  formatted?: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Place {
  id: string;
  name: string;
  address: string;
  coordinates: Coordinates;
  type: 'recent' | 'saved' | 'search';
}

export interface SavedPlace extends Place {
  category: 'home' | 'work' | 'favorite';
  icon?: string;
}

export interface MapConfig {
  center: Coordinates;
  zoom: number;
  minZoom?: number;
  maxZoom?: number;
}

export interface LocationPickerProps {
  initialLocation?: LocationData;
  onLocationSelect?: (location: LocationData) => void;
  onLocationConfirm?: (location: LocationData) => void;
  savedPlaces?: SavedPlace[];
  recentPlaces?: Place[];
  enableGeolocation?: boolean;
  mapConfig?: Partial<MapConfig>;
}

export type MapControlAction = 'zoomIn' | 'zoomOut' | 'recenter' | 'locate';
