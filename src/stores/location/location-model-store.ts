import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getApiData } from '@/lib/getApiData';

interface LocationModelState {
  campus: any[];
  building: any[];
  floor: any[];
  area: any[];
  room: any[];
  // Action: Reset location model state
  reset: () => void;
}

interface LocationModelActions {
  setBuilding: (building: any[]) => void;
  setFloor: (floor: any[]) => void;
  setArea: (area: any[]) => void;
  setRoom: (room: any[]) => void;
  fetchCampusByLocationTypes: (
    accountId: string,
    locationTypes: Array<number | { Id: number }>
  ) => Promise<void>;
}

type LocationModelStore = LocationModelState & LocationModelActions;

export const useLocationModelStore = create<LocationModelStore>()(
  persist(
    (set) => ({
      // State
      campus: [],
      building: [],
      floor: [],
      area: [],
      room: [],

      // Actions
      setBuilding: (building: any[]) => set({ building }),
      setFloor: (floor: any[]) => set({ floor }),
      setArea: (area: any[]) => set({ area }),
      setRoom: (room: any[]) => set({ room }),

      // Action: Fetch campus by location types
      fetchCampusByLocationTypes: async (
        accountId: string,
        locationTypes: Array<number | { Id: number }>
      ) => {
        const ids = (locationTypes || [])
          .map((lt) => (typeof lt === 'number' ? lt : lt?.Id))
          .filter((v): v is number => typeof v === 'number' && !isNaN(v));

        if (!accountId || ids.length === 0) {
          return;
        }

        try {
          const responses = await Promise.all(
            ids.map(async (id) => {
              try {
                const data = await getApiData(
                  `/locationNodes/ByLocationType?accountId=${encodeURIComponent(
                    accountId
                  )}&locationTypes=${encodeURIComponent(String(id))}`
                );
                if ((data as any)?.error) return null;
                return data;
              } catch (err) {
                console.error('Campus fetch error for id', id, err);
                return null;
              }
            })
          );
          

          const combined = responses.filter((r): r is any => !!r).flat();

          set({ campus: combined });
        } catch (error) {
          console.error('Failed to fetch campus by location types:', error);
        }
      },

      // Action: Reset location model state
      reset: () =>
        set({ campus: [], building: [], floor: [], area: [], room: [] }),
    }),

    {
      name: 'location-model-storage',
      partialize: (state) => ({
        campus: state.campus,
        building: state.building,
        floor: state.floor,
        area: state.area,
        room: state.room,
      }),
    }
  )
);
