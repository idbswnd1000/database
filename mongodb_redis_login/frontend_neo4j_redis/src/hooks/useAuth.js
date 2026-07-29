import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    getMe,
    login,
    logout,
    register,
} from "../api/authApi";

import {
    clearAuth,
    getAccessToken,
    getRefreshToken,
    saveAuth,
} from "../store/authStorage";

export const useRegister = () => {
    return useMutation({
        mutationFn: register,
    });
};

export const useLogin = () => {
    const queryClient =
        useQueryClient();

    return useMutation({
        mutationFn: login,

        onSuccess: (data) => {
            saveAuth(data);

            queryClient.setQueryData(
                ["auth", "me"],
                data.user,
            );
        },
    });
};

export const useMe = () => {
    const accessToken =
        getAccessToken();

    return useQuery({
        queryKey: ["auth", "me"],
        queryFn: getMe,
        enabled: Boolean(accessToken),
        retry: false,
        staleTime: 1000 * 60 * 5,
    });
};

export const useLogout = () => {
    const queryClient =
        useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const refreshToken =
                getRefreshToken();

            if (!refreshToken) {
                return null;
            }

            return logout(refreshToken);
        },

        onSettled: () => {
            clearAuth();
            queryClient.clear();
        },
    });
};