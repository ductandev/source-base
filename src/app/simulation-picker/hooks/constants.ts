import { MapConfig, SavedPlace, Place } from '../../../types/simulation';

export const DEFAULT_MAP_CONFIG: MapConfig = {
  center: { lat: 12.2388, lng: 109.1967 },
  zoom: 13,
  minZoom: 3,
  maxZoom: 20,
};

export const DEFAULT_LOCATION = {
  address: 'Nha Trang, Vietnam',
  coordinates: { lat: 12.2388, lng: 109.1967 },
};

export const SAMPLE_RECENT_PLACES: Place[] = [
  {
    id: '1',
    name: 'Cam Ranh Airport',
    address: 'Cam Lâm, Khánh Hòa',
    coordinates: { lat: 11.9982, lng: 109.2192 },
    type: 'recent',
  },
  {
    id: '2',
    name: 'Vinpearl Resort',
    address: 'Hon Tre Island',
    coordinates: { lat: 12.1896, lng: 109.1467 },
    type: 'recent',
  },
  {
    id: '3',
    name: 'Po Nagar Temple',
    address: '2 Thang 4, Nha Trang',
    coordinates: { lat: 12.2652, lng: 109.1956 },
    type: 'recent',
  },
];

export const SAMPLE_SAVED_PLACES: SavedPlace[] = [
  {
    id: 'home',
    name: 'Home',
    address: 'Add home address',
    coordinates: { lat: 0, lng: 0 },
    type: 'saved',
    category: 'home',
  },
  {
    id: 'work',
    name: 'Work',
    address: 'Add work address',
    coordinates: { lat: 0, lng: 0 },
    type: 'saved',
    category: 'work',
  },
];

export const MAP_CONTROL_LABELS = {
  zoomIn: 'Zoom in',
  zoomOut: 'Zoom out',
  recenter: 'Recenter map',
  locate: 'Current location',
} as const;

export const ANIMATIONS = {
  pin: 'animate-bounce',
  ping: 'animate-ping',
} as const;
