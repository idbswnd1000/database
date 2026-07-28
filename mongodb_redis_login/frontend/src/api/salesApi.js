import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

const getHeaders = () => {
    const accessToken =
        localStorage.getItem("access_token");

    return {
        Authorization: `Bearer ${accessToken}`
    };
};

export const getDashboard = async () => {
    const response = await axios.get(
        `${API_URL}/sales/dashboard/`,
        {
            headers: getHeaders()
        }
    );

    return response.data;
};

export const getTopProducts = async () => {
    const response = await axios.get(
        `${API_URL}/sales/top-products/`,
        {
            headers: getHeaders()
        }
    );

    return response.data;
};

export const getCategorySales = async () => {
    const response = await axios.get(
        `${API_URL}/sales/categories/`,
        {
            headers: getHeaders()
        }
    );

    return response.data;
};