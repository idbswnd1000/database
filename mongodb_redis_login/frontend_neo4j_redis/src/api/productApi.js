import axiosInstance from "./axiosInstance";

export const getProducts = async ({
                                      keyword = "",
                                      limit = 100,
                                  } = {}) => {
    const response = await axiosInstance.get(
        "/products/",
        {
            params: {
                keyword,
                limit,
            },
        },
    );

    return response.data.items ?? response.data;
};

export const getProductGraph = async (
    productCode,
) => {
    const response = await axiosInstance.get(
        `/products/${encodeURIComponent(
            productCode,
        )}/graph/`,
    );

    return response.data;
};