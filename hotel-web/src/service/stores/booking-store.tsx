import { create } from "zustand";
import {Booking} from "../model/booking/booking";
import {createBooking, deleteBooking, fetchBookings, updateBooking} from "../servises/service-booking";
import {BookingCreateRequestData} from "../model/booking/booking-create";
import {BookingUpdateRequestData} from "../model/booking/booking-update";

interface BookingState {
    bookings: Booking[];
    booking: Booking | null;
    loading: boolean;
    fetchBookings: () => Promise<void>;
    createBooking : (params: BookingCreateRequestData) => Promise<void>;
    updateBooking : (id: number, params :BookingUpdateRequestData)=> Promise<void>;
    deleteBooking: (id: number) => Promise<void>;
}

const useBookingStore = create<BookingState>((set) => ({
    bookings: [],
    booking: null,
    loading : false,

    fetchBookings: async ( ) => {
        try {
            const response = await fetchBookings();
            const bookings = response.data
            set({ bookings });
        } catch (error) {
            console.error(error);
        }
    },

    createBooking: async (params) => {
        set({ loading: true });
        try {
            const response  = await createBooking(params);
            console.log(response)
            const newBokking = response.data;
            set((state) => ({ bookings: [...state.bookings, newBokking] }));
        } catch (error) {
            console.error(error);
        } finally {
            set({ loading: false });
        }
    },

    updateBooking: async (id, params) => {
        set({ loading: true });
        try {
            const response  = await updateBooking(id, params);
            const updatedBooking = response.data;
            set((state ) => ({
                bookings: state.bookings.map((h) => (h.id === id ? updatedBooking : h)),
                booking: updatedBooking,
            }));
        } catch (error) {
            console.error(error);
        } finally {
            set({ loading: false });
        }
    },

    deleteBooking: async (id) => {
        set({ loading: true });
        try {
            await deleteBooking(id);
            set((state) => ({
                bookings: state.bookings.filter((h) => h.id !== id),
                booking: state.booking?.id === id ? null : state.booking,
            }));
        } catch (error) {
            console.error("Erreur lors de la suppression de l'hôtel:", error);
        } finally {
            set({ loading: false });
        }
    },

}));

export default useBookingStore;
