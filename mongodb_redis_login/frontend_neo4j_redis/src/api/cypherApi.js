import axiosInstance from "./axiosInstance";

export const executeCypher = async (query) => {
    const response = await axiosInstance.post(
        "/cypher/execute/",
        {
            query,
        },
    );

    return response.data;
};