import axios, {AxiosError} from "axios";
import {toast} from "react-toastify";
import {UserCreateRequestData, UserCreateResponseData} from "../model/user/user-create";
import {UserFetchResponseData} from "../model/user/user-fetch";
import {UserUpdateRequestData, UserUpdateResponseData} from "../model/user/user-update";
import {
    UserLogin,
    UserLoginResponseData,
    UserRegisterResponseData,
    UserRequest
} from "../model/user/user-connexion";
import {testEnv} from "../../../env";


const API_URL = `${testEnv.VITE_API_URL}/`;

const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("user_token")}`,
    "Content-Type": "application/json",
});

export const register = async (params: Omit<UserRequest, "id">): Promise<UserRegisterResponseData> => {
    try {
        const response = await axios.post<UserRegisterResponseData>(API_URL +'auth/register', params);
        toast.success(response.data.message);
        return response.data;
    }catch (error) {
        if (error instanceof AxiosError && error.response) {
            const errorMessage = error.response.data?.message || "Une erreur est survenue";
            toast.error(errorMessage);
        } else {
            toast.error("Erreur inconnue");
        }
        throw error;

    }
};

export const login = async (param: Omit<UserLogin, "id">): Promise<UserLoginResponseData> => {
    try {
         const response = await axios.post<UserLoginResponseData>(API_URL + `auth/login`,param)
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

export const fetchUsers = async (): Promise<UserFetchResponseData> => {
    try {
        const response = await axios.get<UserFetchResponseData>(`${API_URL}users`, { headers: getAuthHeaders() });
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


export const createUser = async (params : UserCreateRequestData): Promise<UserCreateResponseData> => {
    try {
        const response = await axios.post<UserCreateResponseData>(`${API_URL}users`, params, { headers: getAuthHeaders() });
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

export const updateUser = async (id: number, params: UserUpdateRequestData): Promise<UserUpdateResponseData> => {
    try {

        const response = await axios.put<UserUpdateResponseData>(`${API_URL}users/${id}`, params, { headers: getAuthHeaders() });
        toast.success(response.data.message);
        return response.data;

    }catch (error) {
        if (error instanceof AxiosError && error.response) {
            const errorMessage = error.response.data?.message || "Une erreur est survenue";
            toast.error(errorMessage);
        } else {
            toast.error("Erreur inconnue");
        }
        throw error;

    }
};

export const deleteUser = async (id: number): Promise<void> => {
    try {
        const response = await axios.delete(`${API_URL}users/${id}`, { headers: getAuthHeaders() });
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