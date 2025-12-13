'use client';

import { Coordinates, MapConfig } from '@/types/simulation';
import { useState, useCallback } from 'react';

const DEFAULT_MAP_CONFIG: MapConfig = {
  center: { lat: 12.2388, lng: 109.1967 },
  zoom: 13,
  minZoom: 3,
  maxZoom: 20,
};

export function useMapControls(initialConfig?: Partial<MapConfig>) {
  const [config, setConfig] = useState<MapConfig>({
    ...DEFAULT_MAP_CONFIG,
    ...initialConfig,
  });

  const zoomIn = useCallback(() => {
    setConfig((prev) => ({
      ...prev,
      zoom: Math.min(prev.zoom + 1, prev.maxZoom || DEFAULT_MAP_CONFIG.maxZoom!),
    }));
  }, []);

  const zoomOut = useCallback(() => {
    setConfig((prev) => ({
      ...prev,
      zoom: Math.max(prev.zoom - 1, prev.minZoom || DEFAULT_MAP_CONFIG.minZoom!),
    }));
  }, []);

  const setCenter = useCallback((center: Coordinates) => {
    setConfig((prev) => ({ ...prev, center }));
  }, []);

  const setZoom = useCallback((zoom: number) => {
    setConfig((prev) => ({
      ...prev,
      zoom: Math.max(
        prev.minZoom || DEFAULT_MAP_CONFIG.minZoom!,
        Math.min(zoom, prev.maxZoom || DEFAULT_MAP_CONFIG.maxZoom!)
      ),
    }));
  }, []);

  const resetToInitial = useCallback(() => {
    setConfig({
      ...DEFAULT_MAP_CONFIG,
      ...initialConfig,
    });
  }, [initialConfig]);

  return {
    config,
    zoomIn,
    zoomOut,
    setCenter,
    setZoom,
    resetToInitial,
  };
}
