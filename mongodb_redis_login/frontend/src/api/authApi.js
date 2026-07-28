import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

export const registerUser = async (data) => {
    const response = await axios.post(
        `${API_URL}/auth/register/`,
        data
    );

    return response.data;
};

export const loginUser = async (data) => {
    const response = await axios.post(
        `${API_URL}/auth/login/`,
        data
    );

    return response.data;
};

export const logoutUser = async () => {
    const refreshToken =
        localStorage.getItem("refresh_token");

    const response = await axios.post(
        `${API_URL}/auth/logout/`,
        {
            refresh_token: refreshToken
        }
    );

    return response.data;
};

export const refreshAccessToken = async () => {
    const refreshToken =
        localStorage.getItem("refresh_token");

    const response = await axios.post(
        `${API_URL}/auth/refresh/`,
        {
            refresh_token: refreshToken
        }
    );

    return response.data;
};