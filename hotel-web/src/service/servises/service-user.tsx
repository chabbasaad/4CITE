import axios from "axios";
import {toast} from "react-toastify";
import {
    UserLogin,
    UserLoginResponseData,
    UserRegisterResponseData, UserRequest,
} from "../model/model-user.tsx";
import {UserCreateRequestData, UserCreateResponseData} from "../model/user/user-create.tsx";
import {UserFetchResponseData} from "../model/user/user-fetch.tsx";
import {UserUpdateRequestData, UserUpdateResponseData} from "../model/user/user-update.tsx";

const apiUrl = import.meta.env.VITE_API_URL;
const API_URL = `${apiUrl}/`;

const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("user_token")}`,
    "Content-Type": "application/json",
});

export const register = async (params: Omit<UserRequest, "id">): Promise<UserRegisterResponseData> => {
    try {
        const response = await axios.post<UserRegisterResponseData>(API_URL +'auth/register', params);
        toast.success(response.data.message);
        return response.data;
    }catch (error: unknown) {

        if (error instanceof Error) {
            toast.error(`Error: ${error.message || "Unknown error"}`);
            console.error("Erreur:", error);
        }
        throw error;

    }
};

export const login = async (param: Omit<UserLogin, "id">): Promise<UserLoginResponseData> => {
    try {
         const response = await axios.post<UserLoginResponseData>(API_URL + `auth/login`,param)
         return response.data;
        } catch (error) {
            if (error instanceof Error) {
                toast.error(`Error: ${error.message || "Unknown error"}`);
                console.error("Erreur:", error);
            }
            throw error;;
        }
};

export const fetchUsers = async (): Promise<UserFetchResponseData> => {
    try {
        const response = await axios.get<UserFetchResponseData>(`${API_URL}users`, { headers: getAuthHeaders() });
        console.log(response)
        return response.data;
    } catch (error) {
        if (error instanceof Error) {
            toast.error(`${error.response.data.message || "Unknown error"}`);
            console.error("Erreur:", error);
        }
        throw error;
    }
};

export const createUser = async (params : UserCreateRequestData): Promise<UserCreateResponseData> => {
    try {
        const response = await axios.post<UserCreateResponseData>(`${API_URL}users`, params, { headers: getAuthHeaders() });
        toast.success(response.data.message);
        return response.data;
    } catch (error) {
        if (error instanceof Error) {
            toast.error(`${error.response.data.message || "Unknown error"}`);
            console.error("Erreur:", error);
        }
        throw error;
    }
};

export const updateUser = async (id: number, params: UserUpdateRequestData): Promise<UserUpdateResponseData> => {
    try {

        const response = await axios.put<UserUpdateResponseData>(`${API_URL}users/${id}`, params, { headers: getAuthHeaders() });
        toast.success(response.data.message);
        return response.data;

    }catch (error: unknown) {

        if (error instanceof Error) {
            toast.error(error.message);
            console.error("Erreur:", error);
        }
        throw error;

    }
};

export const deleteUser = async (id: number): Promise<void> => {
    try {
        const response = await axios.delete(`${API_URL}users/${id}`, { headers: getAuthHeaders() });
        toast.success(response.data.message);
    } catch (error) {
        if (error instanceof Error) {
            toast.error(error.message);
            console.error("Erreur:", error);
        }
        throw error;
    }
};