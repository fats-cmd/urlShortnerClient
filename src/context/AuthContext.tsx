import {
    createContext,
    useState,
    useEffect,
    useCallback,
    type ReactNode,
} from "react";
import type {
    LoginCredentials,
    AuthResponse,
    SignupCredentials,
    AuthContextValue,
} from "../types/Auth";
import type { User } from "../types/User";

import {
    loginRequest,
    logoutRequest,
    signupRequest,
    meRequest,
} from "../api/services/authService";
import { refreshAuth } from "../api/auth/refreshAuth";

// ── Types ──────────────────────────────────────────────────────────────────

// ── Context ────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ── Provider ───────────────────────────────────────────────────────────────

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        const verifySession = async () => {
            try {
                // Only attempt refresh if we have a stored token
                const { getAccessToken } = await import("../api/auth/tokenStorage");
                const token = getAccessToken();
                
                if (!token) {
                    setIsLoading(false);
                    return;
                }

                await refreshAuth();
                const data = await meRequest();
                if (!cancelled) {
                    const resolvedUser: User = data.user ?? data;
                    setUser(resolvedUser);
                }
            } catch {
                if (!cancelled) {
                    setUser(null);
                }
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };

        verifySession();

        return () => {
            cancelled = true;
        };
    }, []);

    // ── Login ───────────────────────────────────────────────────────────────
    const login = useCallback(
        async (loginDetails: LoginCredentials): Promise<AuthResponse> => {
            const data = await loginRequest(loginDetails);
            console.log("[AuthContext] Login - setting user:", data.user);
            setUser(data.user ?? null);
            return data;
        },
        [],
    );

    // ── Signup ──────────────────────────────────────────────────────────────
    const signup = useCallback(
        async (signupDetails: SignupCredentials): Promise<AuthResponse> => {
            const data = await signupRequest(signupDetails);
            console.log("[AuthContext] Signup - setting user:", data.user);
            setUser(data.user ?? null);
            return data;
        },
        [],
    );

    // ── Logout ──────────────────────────────────────────────────────────────
    const logout = useCallback(async (): Promise<void> => {
        await logoutRequest();
        setUser(null);
    }, []);

    // // ── Update user (e.g. after profile edit) ──────────────────────────────
    // const updateUser = useCallback((partial: Partial<User>): void => {
    //     setUser((prev) => {
    //         if (!prev) return prev;
    //         const updated: User = { ...prev, ...partial };
    //         localStorage.setItem(Strings.kUserKey, JSON.stringify(updated));
    //         return updated;
    //     });
    // }, []);

    // const isAuthenticated = Boolean(
    //     user && localStorage.getItem(Strings.kAccessTokenKey),
    // );

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                login,
                signup,
                logout,
            }}>
            {children}
        </AuthContext.Provider>
    );
};

// ── Hook ───────────────────────────────────────────────────────────────────

export default AuthContext;
