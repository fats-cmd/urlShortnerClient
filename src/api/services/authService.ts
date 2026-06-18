import api from "../axios";

import { setAccessToken, clearAccessToken } from "../auth/tokenStorage";
import type {
    AuthResponse,
    LoginCredentials,
    SignupCredentials,
} from "../../types/Auth";
import type { User } from "../../types/User";

// Backends vary in how they nest the payload; this covers the shapes we accept.
interface RawAuthData {
    user?: User;
    accessToken?: string;
    token?: string;
}
interface RawAuthResponse extends RawAuthData {
    data?: RawAuthData;
    message?: string;
    success?: boolean;
}

export const loginRequest = async (
    loginDetails: LoginCredentials,
): Promise<AuthResponse> => {
    const { data: response } = await api.post<RawAuthResponse>(
        "/auth/login",
        loginDetails,
    );

    // Handle nested response format: { success, message, data: { user, accessToken } }
    const actualData = response.data ?? response;

    if (actualData.accessToken) {
        setAccessToken(actualData.accessToken);
    }

    // Return in expected format
    const authResponse: AuthResponse = {
        accessToken: actualData.accessToken || actualData.token || "",
        user: (actualData.user ?? actualData) as User,
        message: response.message,
        success: response.success,
    };

    return authResponse;
};

export const signupRequest = async (
    signupDetails: SignupCredentials,
): Promise<AuthResponse> => {
    const { data: response } = await api.post<RawAuthResponse>(
        "/auth/signup",
        signupDetails,
    );

    // Handle nested response format
    const actualData = response.data ?? response;

    if (actualData.accessToken) {
        setAccessToken(actualData.accessToken);
    }

    // Return in expected format
    const authResponse: AuthResponse = {
        accessToken: actualData.accessToken || actualData.token || "",
        user: (actualData.user ?? actualData) as User,
        message: response.message,
        success: response.success,
    };

    return authResponse;
};

export const logoutRequest = async (): Promise<void> => {
    try {
        await api.post("/auth/logout");
    } finally {
        clearAccessToken();
    }
};

export const meRequest = async () => {
    const { data } = await api.get("/auth/me");

    return data;
};
