import {
    useQuery,
} from "@tanstack/react-query";

import {
    getCategorySales,
    getChannelSales,
    getDashboardKpi,
    getMonthlySales,
    getTopProducts,
} from "../api/dashboardApi";

export const useDashboardKpi = () => {
    return useQuery({
        queryKey: ["dashboard", "kpi"],
        queryFn: getDashboardKpi,
    });
};

export const useMonthlySales = () => {
    return useQuery({
        queryKey: [
            "dashboard",
            "monthly-sales",
        ],
        queryFn: getMonthlySales,
    });
};

export const useTopProducts = (
    limit = 10,
) => {
    return useQuery({
        queryKey: [
            "dashboard",
            "top-products",
            limit,
        ],
        queryFn: () =>
            getTopProducts(limit),
    });
};

export const useCategorySales = () => {
    return useQuery({
        queryKey: [
            "dashboard",
            "category-sales",
        ],
        queryFn: getCategorySales,
    });
};

export const useChannelSales = () => {
    return useQuery({
        queryKey: [
            "dashboard",
            "channel-sales",
        ],
        queryFn: getChannelSales,
    });
};