import { create } from "zustand";
import {
    updateHotel,
    deleteHotel,
    createHotel,
    fetchHotels,
    fetchHotel
} from "../servises/service-hotel.tsx";
import {HotelUpdateRequestData} from "../model/hotel/hotel-update.tsx";
import {HotelCreateRequestData} from "../model/hotel/hotel-create.tsx";

interface HotelState {
    hotels: Hotel[];
    hotel: Hotel | null;
    loading: boolean;

    fetchHotels: () => Promise<void>;
    fetchHotel: (id: number) => Promise<void>;
    createHotel: (data: HotelCreateRequestData) => Promise<void>;
    updateHotel: (id: number, data: HotelUpdateRequestData) => Promise<void>;
    deleteHotel: (id: number) => Promise<void>;
}

const useHotelStore = create<HotelState>((set) => ({
    hotels: [],
    hotel: null,
    loading: false,

    fetchHotels: async () => {
        set({ loading: true });
        try {
            const hotels = await fetchHotels();
            set({ hotels });
        } catch (error) {
            console.error("Erreur de chargement:", error);
        } finally {
            set({ loading: false });
        }
    },

    fetchHotel: async (id) => {
        set({ loading: true });
        try {
            const hotel = await fetchHotel(id);
            set({ hotel });
        } catch (error) {
            console.error("Erreur de chargement:", error);
        } finally {
            set({ loading: false });
        }
    },

    createHotel: async (params) => {
        set({ loading: true });
        try {
            const response  = await createHotel(params);
            const newHotel = response.data;
            set((state) => ({ hotels: [...state.hotels, newHotel] }));
        } catch (error) {
            console.error(error);
        } finally {
            set({ loading: false });
        }
    },

    updateHotel: async (id, params) => {
        set({ loading: true });
        try {
            const response  = await updateHotel(id, params);
            const updatedHotel = response.data;
            set((state ) => ({
                hotels: state.hotels.map((h) => (h.id === id ? updatedHotel : h)),
                hotel: updatedHotel,
            }));
        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'hôtel:", error);
        } finally {
            set({ loading: false });
        }
    },

    deleteHotel: async (id) => {
        set({ loading: true });
        try {
            await deleteHotel(id);
            set((state) => ({
                hotels: state.hotels.filter((h) => h.id !== id),
                hotel: state.hotel?.id === id ? null : state.hotel,
            }));
        } catch (error) {
            console.error("Erreur lors de la suppression de l'hôtel:", error);
        } finally {
            set({ loading: false });
        }
    },
}));

export default useHotelStore;
