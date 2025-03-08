import axios from "axios";
import {
    Hotel,
} from "../model/model-hotel.tsx";
import { toast } from "react-toastify";
import {HotelUpdateRequestData, HotelUpdateResponseData} from "../model/hotel/hotel-update.tsx";
import {HotelCreateRequestData, HotelCreateResponseData} from "../model/hotel/hotel-create.tsx";

const apiUrl = import.meta.env.VITE_API_URL;
const API_URL = `${apiUrl}/hotels`;

const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("user_token")}`,
    "Content-Type": "application/json",
});

export const fetchHotels = async (): Promise<Hotel[]> => {
    try {
        const response = await axios.get<Hotel[]>(API_URL,{ headers: getAuthHeaders() });
        return response.data.data;
    } catch (error) {
        if (error instanceof Error) {
            console.error("Erreur:", error);
        }
        throw error;
    }
};

export const fetchHotel = async (id: number): Promise<Hotel> => {
    try {
        const response = await axios.get<Hotel>(`${API_URL}/${id}`, { headers: getAuthHeaders() });
        return response.data.data;
    } catch (error) {
        if (error instanceof Error) {
            toast.error(`Error: ${error.message || "Unknown error"}`);
            console.error("Erreur:", error);
        }
        throw error;
    }
};

export const createHotel = async (params: HotelCreateRequestData): Promise<HotelCreateResponseData> => {
    try {
        const response = await axios.post<HotelCreateResponseData>(API_URL, params, { headers: getAuthHeaders() });
        toast.success(response.data.message);
        return response.data;
    } catch (error) {
        if (error instanceof Error) {
            toast.error(`Error: ${error.message || "Unknown error"}`);
            console.error("Erreur:", error);
        }
        throw error;
    }
};

export const updateHotel = async (id: number, params: HotelUpdateRequestData): Promise<HotelUpdateResponseData> => {
    try {
        const response = await axios.put<HotelUpdateResponseData>(API_URL +`/${id}`, params, { headers: getAuthHeaders() });
        toast.success(response.data.message);
        return response.data;
    } catch (error) {
        if (error instanceof Error) {
            toast.error(`Error: ${error.message || "Unknown error"}`);
            console.error("Erreur:", error);
        }
        throw error;
    }
};

export const deleteHotel = async (id: number): Promise<void> => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
        toast.success(response.data.message);
    } catch (error) {
        if (error instanceof Error) {
            toast.error(`Error: ${error.message || "Unknown error"}`);
            console.error("Erreur:", error);
        }
        throw error;
    }
};
