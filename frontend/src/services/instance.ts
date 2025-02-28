import { getAccessToken } from '@/store/auth-store';
import axios, { InternalAxiosRequestConfig } from 'axios';

 export const instance = axios.create({
     baseURL: import.meta.env.VITE_API_URL,
 });


 instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const accessToken = getAccessToken();
      if (accessToken && config.headers) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error: unknown) => {
      return Promise.reject(error);
   }
  );