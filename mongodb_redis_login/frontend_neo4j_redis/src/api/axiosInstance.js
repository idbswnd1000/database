import axios from "axios";

import {
    clearAuth,
    getAccessToken,
    getRefreshToken,
    saveAccessToken,
} from "../store/authStorage";

const API_URL =
    import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

const refreshAxios = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken =
            getAccessToken();

        if (accessToken) {
            config.headers.Authorization =
                `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

let isRefreshing = false;
let refreshSubscribers = [];

const addRefreshSubscriber = (
    callback,
) => {
    refreshSubscribers.push(callback);
};

const notifyRefreshSubscribers = (
    accessToken,
) => {
    refreshSubscribers.forEach(
        (callback) => {
            callback(accessToken);
        },
    );

    refreshSubscribers = [];
};

const rejectRefreshSubscribers = (
    error,
) => {
    refreshSubscribers.forEach(
        (callback) => {
            callback(null, error);
        },
    );

    refreshSubscribers = [];
};

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest =
            error.config;

        const status =
            error.response?.status;

        const refreshToken =
            getRefreshToken();

        const isAuthRequest =
            originalRequest?.url?.includes(
                "/auth/login/",
            ) ||
            originalRequest?.url?.includes(
                "/auth/register/",
            ) ||
            originalRequest?.url?.includes(
                "/auth/refresh/",
            );

        if (
            status !== 401 &&
            status !== 403
        ) {
            return Promise.reject(error);
        }

        if (
            !originalRequest ||
            originalRequest._retry ||
            !refreshToken ||
            isAuthRequest
        ) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        if (isRefreshing) {
            return new Promise(
                (resolve, reject) => {
                    addRefreshSubscriber(
                        (
                            accessToken,
                            refreshError,
                        ) => {
                            if (
                                refreshError ||
                                !accessToken
                            ) {
                                reject(
                                    refreshError ||
                                    error,
                                );
                                return;
                            }

                            originalRequest.headers.Authorization =
                                `Bearer ${accessToken}`;

                            resolve(
                                axiosInstance(
                                    originalRequest,
                                ),
                            );
                        },
                    );
                },
            );
        }

        isRefreshing = true;

        try {
            const response =
                await refreshAxios.post(
                    "/auth/refresh/",
                    {
                        refresh: refreshToken,
                    },
                );

            const newAccessToken =
                response.data.access;

            saveAccessToken(
                newAccessToken,
            );

            notifyRefreshSubscribers(
                newAccessToken,
            );

            originalRequest.headers.Authorization =
                `Bearer ${newAccessToken}`;

            return axiosInstance(
                originalRequest,
            );
        } catch (refreshError) {
            rejectRefreshSubscribers(
                refreshError,
            );

            clearAuth();

            window.location.href =
                "/login";

            return Promise.reject(
                refreshError,
            );
        } finally {
            isRefreshing = false;
        }
    },
);

export default axiosInstance;