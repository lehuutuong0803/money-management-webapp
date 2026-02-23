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
    INCOME_EXCEL_DOWNLOAD: "/incomes/export/excel",
    EXPENSE_EXCEL_DOWNLOAD: "/expenses/export/excel",
    EMAIL_INCOME: "/incomes/email",
    EMAIL_EXPENSE: "/expenses/email",
    APP_FILTERS: "/filter",
    GET_USER_INFO: "/profile",
    GET_ALL_CATEGORIES: "/categories",
    GET_ALL_INCOME: "/incomes",
    GET_ALL_EXPENSES: "/expenses",
    CATEGORY_BY_TYPE: (type) => `/categories/${type}`,
    ADD_CATEGORY: "/categories",
    ADD_INCOME: "/incomes",
    ADD_EXPENSE: "/expenses",
    UPDATE_CATEGORY: (categoryId) => `/categories/${categoryId}`,
    DELETE_INCOME: (incomeId) => `/incomes/${incomeId}`,
    DELETE_EXPENSE: (expenseId) => `/expenses/${expenseId}`
}