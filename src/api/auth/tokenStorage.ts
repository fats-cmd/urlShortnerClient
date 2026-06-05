const kAccessTokenKey = "__app_access_token";

let accessToken: string | null = null;

// Initialize from localStorage (if present)
try {
    const stored = localStorage.getItem(kAccessTokenKey);
    accessToken = stored ?? null;
} catch {
    accessToken = null;
}

export const setAccessToken = (token: string): void => {
    accessToken = token;
    try {
        localStorage.setItem(kAccessTokenKey, token);
    } catch {
        // ignore storage errors (e.g. disabled cookies)
    }
};

export const getAccessToken = (): string | null => {
    if (accessToken) return accessToken;
    try {
        const stored = localStorage.getItem(kAccessTokenKey);
        accessToken = stored ?? null;
        return accessToken;
    } catch {
        return null;
    }
};

export const clearAccessToken = (): void => {
    accessToken = null;
    try {
        localStorage.removeItem(kAccessTokenKey);
    } catch {
        // ignore
    }
};
