import axios, {AxiosError} from "axios";
import { toast } from "react-toastify";
import { BookingFetchResponseData} from "../model/booking/booking-fetch";
import {BookingCreateRequestData, BookingCreateResponseData} from "../model/booking/booking-create";
import {BookingUpdateRequestData, BookingUpdateResponseData} from "../model/booking/booking-update";
import {testEnv} from "../../../env";

const API_URL = `${testEnv.VITE_API_URL}/bookings`;

const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("user_token")}`,
    "Content-Type": "application/json",
});

export const fetchBookings = async (): Promise<BookingFetchResponseData> => {
    try {
        const response = await axios.get<BookingFetchResponseData>(`${API_URL}`,{ headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            const errorMessage = error.response.data?.message || "Une erreur est survenue";
            toast.error(errorMessage);
        } else {
            toast.error("Erreur inconnue");
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
        if (error instanceof AxiosError && error.response) {
            const errorMessage = error.response.data?.message || "Une erreur est survenue";
            toast.error(errorMessage);
        } else {
            toast.error("Erreur inconnue");
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
        if (error instanceof AxiosError && error.response) {
            const errorMessage = error.response.data?.message || "Une erreur est survenue";
            toast.error(errorMessage);
        } else {
            toast.error("Erreur inconnue");
        }
        throw error;
    }
};

export const deleteBooking = async (id: number): Promise<void> => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
        toast.success(response.data.message);
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            const errorMessage = error.response.data?.message || "Une erreur est survenue";
            toast.error(errorMessage);
        } else {
            toast.error("Erreur inconnue");
        }
        throw error;
    }
};