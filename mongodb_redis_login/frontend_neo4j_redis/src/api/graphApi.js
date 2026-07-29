import axiosInstance from "./axiosInstance";

export const getGraphOverview =
    async () => {
        const response =
            await axiosInstance.get(
                "/graph/overview/",
            );

        return response.data;
    };