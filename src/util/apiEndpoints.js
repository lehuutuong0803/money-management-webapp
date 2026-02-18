// export const BASE_URL = "https://money-management-ntm7.onrender.com/api/v1.0";
export const BASE_URL = "http://localhost:8080/api/v1.0";

const CLOUNDINARY_CLOUD_NAME = "drcdg3uvv";

export const API_ENDPOINTS = { 
    LOGIN: "/login",
    REGISTER: "/register",
    DASHBOARD: "/dashboard",
    INCOME: "/income",
    EXPENSE: "/expense",
    CATEGORY: "/category",
    FILTER: "/filter",
    UPLOAD_IMAGE: `https://api.cloudinary.com/v1_1/${CLOUNDINARY_CLOUD_NAME}/image/upload`,
    GET_USER_INFO: "/profile",
    GET_ALL_CATEGORIES: "/categories",
    GET_ALL_INCOME: "/income",
    ADD_CATEGORY: "/categories",
    UPDATE_CATEGORY: (categoryId) => `/categories/${categoryId}`,
}