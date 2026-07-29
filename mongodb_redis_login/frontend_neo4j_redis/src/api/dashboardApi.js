import axiosInstance from "./axiosInstance";

export const getDashboardKpi = async () => {
    const response = await axiosInstance.get(
        "/dashboard/kpi/",
    );

    return response.data;
};

export const getMonthlySales = async () => {
    const response = await axiosInstance.get(
        "/dashboard/monthly-sales/",
    );

    return response.data.items ?? [];
};

export const getTopProducts = async (
    limit = 10,
) => {
    const response = await axiosInstance.get(
        "/dashboard/top-products/",
        {
            params: {
                limit,
            },
        },
    );

    return response.data.items ?? [];
};

export const getCategorySales = async () => {
    const response = await axiosInstance.get(
        "/dashboard/category-sales/",
    );

    return response.data.items ?? [];
};

export const getChannelSales = async () => {
    const response = await axiosInstance.get(
        "/dashboard/channel-sales/",
    );

    return response.data.items ?? [];
};