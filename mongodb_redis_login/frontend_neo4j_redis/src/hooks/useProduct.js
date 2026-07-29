import {
    useQuery,
} from "@tanstack/react-query";

import {
    getProductGraph,
    getProducts,
} from "../api/productApi";

export const useProducts = (
    keyword = "",
) => {
    return useQuery({
        queryKey: [
            "products",
            keyword,
        ],
        queryFn: () =>
            getProducts({
                keyword,
                limit: 100,
            }),
    });
};

export const useProductGraph = (
    productCode,
) => {
    return useQuery({
        queryKey: [
            "product",
            productCode,
            "graph",
        ],
        queryFn: () =>
            getProductGraph(
                productCode,
            ),
        enabled: Boolean(productCode),
    });
};