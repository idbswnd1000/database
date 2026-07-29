import {
    useQuery,
} from "@tanstack/react-query";

import {
    getCustomerGraph,
    getCustomers,
} from "../api/customerApi";

export const useCustomers = (
    keyword = "",
) => {
    return useQuery({
        queryKey: [
            "customers",
            keyword,
        ],
        queryFn: () =>
            getCustomers({
                keyword,
                limit: 100,
            }),
    });
};

export const useCustomerGraph = (
    customerCode,
) => {
    return useQuery({
        queryKey: [
            "customer",
            customerCode,
            "graph",
        ],
        queryFn: () =>
            getCustomerGraph(
                customerCode,
            ),
        enabled: Boolean(customerCode),
    });
};