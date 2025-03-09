import axios, {AxiosError} from "axios";
import { toast } from "react-toastify";
import {HotelUpdateRequestData, HotelUpdateResponseData} from "../model/hotel/hotel-update";
import {HotelCreateRequestData, HotelCreateResponseData} from "../model/hotel/hotel-create";
import {HotelFetchResponseData, HotelFetchsResponseData} from "../model/hotel/hotel-fetch";

const apiUrl = "http://89.168.20.112:8000/api";
const API_URL = `${apiUrl}/hotels`;

const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("user_token")}`,
    "Content-Type": "application/json",
});

export const fetchHotels = async (): Promise<HotelFetchsResponseData> => {
    try {
        const response = await axios.get<HotelFetchsResponseData>(API_URL,{ headers: getAuthHeaders() });
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

export const fetchHotel = async (id: number): Promise<HotelFetchResponseData> => {
    try {
        const response = await axios.get<HotelFetchResponseData>(`${API_URL}/${id}`, { headers: getAuthHeaders() });
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

export const createHotel = async (params: HotelCreateRequestData): Promise<HotelCreateResponseData> => {
    try {
        const response = await axios.post<HotelCreateResponseData>(API_URL, params, { headers: getAuthHeaders() });
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

export const updateHotel = async (id: number, params: HotelUpdateRequestData): Promise<HotelUpdateResponseData> => {
    try {
        const response = await axios.put<HotelUpdateResponseData>(API_URL +`/${id}`, params, { headers: getAuthHeaders() });
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

export const deleteHotel = async (id: number): Promise<void> => {
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
