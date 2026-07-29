import axiosInstance from "./axiosInstance";

export const getSales = async ({
                                   keyword = "",
                                   limit = 100,
                               } = {}) => {
    const response = await axiosInstance.get(
        "/sales/",
        {
            params: {
                keyword,
                limit,
            },
        },
    );

    return response.data.items ?? response.data;
};

export const getSaleGraph = async (
    saleId,
) => {
    const response = await axiosInstance.get(
        `/sales/${encodeURIComponent(
            saleId,
        )}/graph/`,
    );

    return response.data;
};