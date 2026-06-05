import api from "../axios";

import { setAccessToken, clearAccessToken } from "../auth/tokenStorage";
import type {
    AuthResponse,
    LoginCredentials,
    SignupCredentials,
} from "../../types/Auth";

export const loginRequest = async (
    loginDetails: LoginCredentials,
): Promise<AuthResponse> => {
    const { data: response } = await api.post<any>("/auth/login", loginDetails);
    console.log("[authService] Raw response:", response);
    
    // Handle nested response format: { success, message, data: { user, accessToken } }
    const actualData = response.data || response;
    console.log("[authService] Actual data:", actualData);
    console.log("[authService] AccessToken:", actualData.accessToken);
    console.log("[authService] User:", actualData.user || actualData);
    
    if (actualData.accessToken) {
        setAccessToken(actualData.accessToken);
    }
    
    // Return in expected format
    const authResponse: AuthResponse = {
        accessToken: actualData.accessToken || actualData.token || "",
        user: actualData.user || actualData,
        message: response.message,
        success: response.success,
    };
    
    return authResponse;
};

export const signupRequest = async (
    signupDetails: SignupCredentials,
): Promise<AuthResponse> => {
    const { data: response } = await api.post<any>(
        "/auth/signup",
        signupDetails,
    );
    console.log("[authService] Signup response:", response);
    
    // Handle nested response format
    const actualData = response.data || response;
    
    if (actualData.accessToken) {
        setAccessToken(actualData.accessToken);
    }
    
    // Return in expected format
    const authResponse: AuthResponse = {
        accessToken: actualData.accessToken || actualData.token || "",
        user: actualData.user || actualData,
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
