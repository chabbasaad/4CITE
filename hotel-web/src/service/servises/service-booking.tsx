import axios from "axios";
import { toast } from "react-toastify";
import {BookingFetchRequestData, BookingFetchResponseData} from "../model/booking/booking-fetch.tsx";
import {BookingCreateRequestData, BookingCreateResponseData} from "../model/booking/booking-create.tsx";
import {BookingUpdateRequestData, BookingUpdateResponseData} from "../model/booking/booking-update.tsx";

const API_URL = "http://89.168.20.112:8000/api/bookings";

const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("user_token")}`,
    "Content-Type": "application/json",
});

export const fetchBookings = async (params : BookingFetchRequestData): Promise<BookingFetchResponseData> => {
    try {
        const response = await axios.get<BookingFetchResponseData>(`${API_URL}`,{ params, headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        if (error instanceof Error) {
            toast.error(error.response.data.message);
            console.error("Erreur:", error);
        }
        throw error;
    }
};

export const createBooking= async (params : BookingCreateRequestData): Promise<BookingCreateResponseData> => {
    try {
        const response = await axios.post<BookingCreateResponseData>(`${API_URL}`, params, { headers: getAuthHeaders() });
        toast.success(response.data.message);
        return response.data;
    } catch (error) {
        if (error instanceof Error) {
            toast.error(error.response.data.message);
            console.error("Erreur:", error);
        }
        throw error;
    }
};

export const updateBooking = async (id: number, params: BookingUpdateRequestData): Promise<BookingUpdateResponseData> => {
    try {

        const response = await axios.put<BookingUpdateResponseData>(`${API_URL}/${id}`, params, { headers: getAuthHeaders() });
        toast.success(response.data.message);
        return response.data;

    }catch (error: unknown) {

        if (error instanceof Error) {
            console.log(error)
            toast.error(error.response.data.message);
            console.error("Erreur:", error);
        }
        throw error;

    }
};

export const deleteBooking = async (id: number): Promise<void> => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
        toast.success(response.data.message);
    } catch (error) {
        if (error instanceof Error) {
            console.log(error)
            toast.error(error.response.data.message);
            console.error("Erreur:", error);
        }
        throw error;
    }
};