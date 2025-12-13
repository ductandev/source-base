import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { goongService, GoongPrediction, GoongPlace } from './goong-service';

// ============================================================================
// QUERY KEYS
// ============================================================================

export const goongKeys = {
  all: ['goong'] as const,
  autocomplete: (query: string) =>
    [...goongKeys.all, 'autocomplete', query] as const,
  placeDetail: (placeId: string) =>
    [...goongKeys.all, 'place-detail', placeId] as const,
  geocode: (address: string) =>
    [...goongKeys.all, 'geocode', address] as const,
  reverseGeocode: (lat: number, lng: number) =>
    [...goongKeys.all, 'reverse-geocode', lat, lng] as const,
};

// ============================================================================
// STALE TIMES
// ============================================================================

const STALE_TIME = {
  AUTOCOMPLETE: 5 * 60 * 1000, // 5 minutes
  PLACE_DETAIL: 30 * 60 * 1000, // 30 minutes
  GEOCODE: 30 * 60 * 1000, // 30 minutes
} as const;

// ============================================================================
// HOOKS
// ============================================================================

/**
 * Hook to autocomplete search for places
 */
export function useGoongAutocomplete(
  query: string,
  enabled: boolean = true
): UseQueryResult<GoongPrediction[], Error> {
  return useQuery<GoongPrediction[], Error>({
    queryKey: goongKeys.autocomplete(query),
    queryFn: () => goongService.autocomplete(query),
    enabled: enabled && query.length >= 2,
    staleTime: STALE_TIME.AUTOCOMPLETE,
    gcTime: STALE_TIME.AUTOCOMPLETE * 2,
    retry: (failureCount, error: any) => {
      // Không retry nếu lỗi 429 (rate limit)
      if (error?.response?.status === 429) {
        return false;
      }
      // Retry tối đa 2 lần cho các lỗi khác
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

/**
 * Hook to get place details
 */
export function useGoongPlaceDetail(
  placeId: string,
  enabled: boolean = true
): UseQueryResult<GoongPlace | null, Error> {
  return useQuery<GoongPlace | null, Error>({
    queryKey: goongKeys.placeDetail(placeId),
    queryFn: () => goongService.getPlaceDetail(placeId),
    enabled: enabled && !!placeId,
    staleTime: STALE_TIME.PLACE_DETAIL,
    gcTime: STALE_TIME.PLACE_DETAIL * 2,
    retry: 1,
  });
}

/**
 * Hook to geocode an address
 */
export function useGoongGeocode(
  address: string,
  enabled: boolean = true
): UseQueryResult<GoongPlace | null, Error> {
  return useQuery<GoongPlace | null, Error>({
    queryKey: goongKeys.geocode(address),
    queryFn: () => goongService.geocode(address),
    enabled: enabled && !!address,
    staleTime: STALE_TIME.GEOCODE,
    gcTime: STALE_TIME.GEOCODE * 2,
    retry: 1,
  });
}

/**
 * Hook to reverse geocode coordinates
 */
export function useGoongReverseGeocode(
  lat: number,
  lng: number,
  enabled: boolean = true
): UseQueryResult<GoongPlace | null, Error> {
  return useQuery<GoongPlace | null, Error>({
    queryKey: goongKeys.reverseGeocode(lat, lng),
    queryFn: () => goongService.reverseGeocode(lat, lng),
    enabled: enabled && !!lat && !!lng,
    staleTime: STALE_TIME.GEOCODE,
    gcTime: STALE_TIME.GEOCODE * 2,
    retry: 1,
  });
}