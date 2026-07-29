import axiosInstance from "./axiosInstance";

export const getCustomers = async ({
                                       keyword = "",
                                       limit = 100,
                                   } = {}) => {
    const response = await axiosInstance.get(
        "/customers/",
        {
            params: {
                keyword,
                limit,
            },
        },
    );

    return response.data.items ?? [];
};

export const getCustomerGraph = async (
    customerCode,
) => {
    const response = await axiosInstance.get(
        `/customers/${encodeURIComponent(
            customerCode,
        )}/graph/`,
        {
            params: {
                sale_limit: 5,
            },
        },
    );

    return response.data;
};