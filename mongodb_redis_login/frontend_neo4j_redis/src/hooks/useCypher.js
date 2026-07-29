import { useMutation } from "@tanstack/react-query";

import { executeCypher } from "../api/cypherApi";

export const useExecuteCypher = () => {
    return useMutation({
        mutationFn: executeCypher,
    });
};