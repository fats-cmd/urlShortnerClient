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

// ── TEMPORARY: backend is unavailable, using localStorage mock auth ──────────
// Restore these real network calls once the backend is running.
// import {
//     loginRequest,
//     logoutRequest,
//     signupRequest,
//     meRequest,
// } from "../api/services/authService";
// import { refreshAuth } from "../api/auth/refreshAuth";
import {
    mockLogin,
    mockSignup,
    mockLogout,
    mockMe,
    mockUpdateProfile,
} from "../api/auth/mockAuth";

// ── Types ──────────────────────────────────────────────────────────────────

// ── Context ────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ── Provider ───────────────────────────────────────────────────────────────

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        // ── TEMPORARY: mock session restore from localStorage ────────────────
        const verifySession = async () => {
            try {
                const restored = mockMe();
                if (!cancelled) setUser(restored);
            } catch {
                if (!cancelled) setUser(null);
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };

        // ── Real session restore (restore when backend is available) ─────────
        // const verifySession = async () => {
        //     try {
        //         // Only attempt refresh if we have a stored token
        //         const { getAccessToken } = await import("../api/auth/tokenStorage");
        //         const token = getAccessToken();
        //
        //         if (!token) {
        //             setIsLoading(false);
        //             return;
        //         }
        //
        //         await refreshAuth();
        //         const data = await meRequest();
        //         if (!cancelled) {
        //             const resolvedUser: User = data.user ?? data;
        //             setUser(resolvedUser);
        //         }
        //     } catch {
        //         if (!cancelled) {
        //             setUser(null);
        //         }
        //     } finally {
        //         if (!cancelled) setIsLoading(false);
        //     }
        // };

        verifySession();

        return () => {
            cancelled = true;
        };
    }, []);

    // ── Login ───────────────────────────────────────────────────────────────
    const login = useCallback(
        async (loginDetails: LoginCredentials): Promise<AuthResponse> => {
            // TEMPORARY: mock login (real call commented out below)
            const data = await mockLogin(loginDetails);
            // const data = await loginRequest(loginDetails);
            console.log("[AuthContext] Login - setting user:", data.user);
            setUser(data.user ?? null);
            return data;
        },
        [],
    );

    // ── Signup ──────────────────────────────────────────────────────────────
    const signup = useCallback(
        async (signupDetails: SignupCredentials): Promise<AuthResponse> => {
            // TEMPORARY: mock signup (real call commented out below)
            const data = await mockSignup(signupDetails);
            // const data = await signupRequest(signupDetails);
            console.log("[AuthContext] Signup - setting user:", data.user);
            setUser(data.user ?? null);
            return data;
        },
        [],
    );

    // ── Update user (e.g. after profile edit) ────────────────────────────────
    const updateUser = useCallback(
        async (partial: Partial<User>): Promise<void> => {
            const updated = await mockUpdateProfile(partial);
            setUser(updated);
        },
        [],
    );

    // ── Logout ──────────────────────────────────────────────────────────────
    const logout = useCallback(async (): Promise<void> => {
        // TEMPORARY: mock logout (real call commented out below)
        await mockLogout();
        // await logoutRequest();
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
                updateUser,
            }}>
            {children}
        </AuthContext.Provider>
    );
};

// ── Hook ───────────────────────────────────────────────────────────────────

export default AuthContext;
