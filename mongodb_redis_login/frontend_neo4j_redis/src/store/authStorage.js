const ACCESS_TOKEN_KEY =
    "accessToken";

const REFRESH_TOKEN_KEY =
    "refreshToken";

export const getAccessToken = () => {
    return localStorage.getItem(
        ACCESS_TOKEN_KEY,
    );
};

export const getRefreshToken = () => {
    return localStorage.getItem(
        REFRESH_TOKEN_KEY,
    );
};

export const saveAuth = ({
                             access,
                             refresh,
                         }) => {
    if (access) {
        localStorage.setItem(
            ACCESS_TOKEN_KEY,
            access,
        );
    }

    if (refresh) {
        localStorage.setItem(
            REFRESH_TOKEN_KEY,
            refresh,
        );
    }
};

export const saveAccessToken = (
    accessToken,
) => {
    if (!accessToken) {
        return;
    }

    localStorage.setItem(
        ACCESS_TOKEN_KEY,
        accessToken,
    );
};

export const clearAuth = () => {
    localStorage.removeItem(
        ACCESS_TOKEN_KEY,
    );

    localStorage.removeItem(
        REFRESH_TOKEN_KEY,
    );
};