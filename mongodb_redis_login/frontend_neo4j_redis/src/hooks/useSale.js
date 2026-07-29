import {
    useQuery,
} from "@tanstack/react-query";

import {
    getSaleGraph,
    getSales,
} from "../api/saleApi";

export const useSales = (
    keyword = "",
) => {
    return useQuery({
        queryKey: [
            "sales",
            keyword,
        ],
        queryFn: () =>
            getSales({
                keyword,
                limit: 100,
            }),
    });
};

export const useSaleGraph = (
    saleId,
) => {
    return useQuery({
        queryKey: [
            "sale",
            saleId,
            "graph",
        ],
        queryFn: () =>
            getSaleGraph(saleId),
        enabled: Boolean(saleId),
    });
};