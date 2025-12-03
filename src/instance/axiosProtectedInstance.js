import axios from "axios";
import { ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from "../constant";
import { Cookie, LocalStorage } from "../utils";
import api from "./axiosInstance";  // Assuming this imports an instance for non-protected API calls

// Create the protected axios instance
const protectedApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add Authorization header (access token) to every request
protectedApi.interceptors.request.use(
    (config) => {
        const token = Cookie.get(ACCESS_TOKEN_COOKIE_NAME);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


export default protectedApi;
