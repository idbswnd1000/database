import axiosInstance from "./axiosInstance";

export const register = async (
    registerData,
) => {
    const response =
        await axiosInstance.post(
            "/auth/register/",
            registerData,
        );

    return response.data;
};

export const login = async (
    loginData,
) => {
    const response =
        await axiosInstance.post(
            "/auth/login/",
            loginData,
        );

    return response.data;
};

export const getMe = async () => {
    const response =
        await axiosInstance.get(
            "/auth/me/",
        );

    return response.data;
};

export const refreshAccessToken =
    async (refreshToken) => {
        const response =
            await axiosInstance.post(
                "/auth/refresh/",
                {
                    refresh: refreshToken,
                },
            );

        return response.data;
    };

export const logout = async (
    refreshToken,
) => {
    const response =
        await axiosInstance.post(
            "/auth/logout/",
            {
                refresh: refreshToken,
            },
        );

    return response.data;
};