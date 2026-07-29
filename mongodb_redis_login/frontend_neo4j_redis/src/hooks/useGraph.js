import {
    useQuery,
} from "@tanstack/react-query";

import {
    getGraphOverview,
} from "../api/graphApi";

export const useGraphOverview = () => {
    return useQuery({
        queryKey: [
            "graph",
            "overview",
        ],
        queryFn: getGraphOverview,
    });
};