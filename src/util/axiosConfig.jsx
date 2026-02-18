import axios from "axios";
import { BASE_URL } from "./apiEndpoints";

const axiosConfig = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    }
});

// List of endpoints that do not require authentication
const excludeEndpoints = ["/login", "/register", "/status", "/activate", "/health"];

// request interceptor to add token to headers
axiosConfig.interceptors.request.use((config) => {
    const shouldSkipToken = excludeEndpoints.some((endpoint) => {
        return config.url?.includes(endpoint);
    });

    if (!shouldSkipToken) {
        const accessToken = localStorage.getItem("token");
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;

        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// response interceptor
axiosConfig.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if(error.response) {
        if (error.response.status === 401) {
            window.location.href = "/login";
        } else if (error.response.status === 500) {
            window.location.href = "/error";
            console.error("Server error: ", error.response.data);
        }
    } else if (error.code === "ECONNABORTED") {
        console.error("Request timeout: ", error.message);
    }
    return Promise.reject(error);
});

export default axiosConfig;