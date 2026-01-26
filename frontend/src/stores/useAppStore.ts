import { create } from 'zustand';
import type { MapLevel, Indicator, SizeFilter, TooltipData } from '@/types/data';

interface AppState {
  // Map state
  level: MapLevel;
  setLevel: (level: MapLevel) => void;
  
  // Indicator state
  indicator: Indicator;
  setIndicator: (indicator: Indicator) => void;
  
  // Size filter state
  sizeFilter: SizeFilter;
  setSizeFilter: (filter: SizeFilter) => void;
  
  // Tooltip state
  tooltip: TooltipData | null;
  setTooltip: (tooltip: TooltipData | null) => void;
  
  // Zoom state (selected region code for drilling down)
  selectedRegion: string | null;
  setSelectedRegion: (code: string | null) => void;
  
  // UI state
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Map defaults
  level: 'regions',
  setLevel: (level) => set({ level, selectedRegion: null }),
  
  // Indicator defaults
  indicator: 'nb_exploitations',
  setIndicator: (indicator) => set({ indicator }),
  
  // Size filter defaults
  sizeFilter: 'all',
  setSizeFilter: (filter) => set({ sizeFilter: filter }),
  
  // Tooltip defaults
  tooltip: null,
  setTooltip: (tooltip) => set({ tooltip }),
  
  // Zoom defaults
  selectedRegion: null,
  setSelectedRegion: (code) => set({ selectedRegion: code }),
  
  // UI defaults
  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));
