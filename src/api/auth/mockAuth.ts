// ─────────────────────────────────────────────────────────────────────────────
// TEMPORARY: localStorage-backed mock auth.
//
// The real backend (http://localhost:3000/api/v1) is not running, so login /
// signup fail with a Network/CORS error. This module fakes the auth flow
// against localStorage so the frontend / pages can be built without a backend.
//
// Remove this file and restore the real calls in AuthContext.tsx + authService.ts
// once the backend is available.
// ─────────────────────────────────────────────────────────────────────────────

import type {
    AuthResponse,
    LoginCredentials,
    SignupCredentials,
} from "../../types/Auth";
import type { User } from "../../types/User";
import { setAccessToken, clearAccessToken } from "./tokenStorage";

const kUsersKey = "__mock_users";
const kCurrentUserKey = "__mock_current_user";

interface StoredUser extends User {
    password: string;
}

const readUsers = (): StoredUser[] => {
    try {
        return JSON.parse(localStorage.getItem(kUsersKey) || "[]");
    } catch {
        return [];
    }
};

const writeUsers = (users: StoredUser[]): void => {
    localStorage.setItem(kUsersKey, JSON.stringify(users));
};

const stripPassword = ({ password: _password, ...user }: StoredUser): User =>
    user;

const buildResponse = (user: User): AuthResponse => ({
    accessToken: `mock-token-${user.id}`,
    refreshToken: `mock-refresh-${user.id}`,
    role: "user",
    user,
    expiresIn: null,
});

export const mockLogin = async (
    { email, password }: LoginCredentials,
): Promise<AuthResponse> => {
    const found = readUsers().find((u) => u.email === email);
    if (!found || found.password !== password) {
        throw new Error("Invalid email or password.");
    }
    const user = stripPassword(found);
    setAccessToken(`mock-token-${user.id}`);
    localStorage.setItem(kCurrentUserKey, JSON.stringify(user));
    return buildResponse(user);
};

export const mockSignup = async (
    { username, email, password }: SignupCredentials,
): Promise<AuthResponse> => {
    const users = readUsers();
    if (users.some((u) => u.email === email)) {
        throw new Error("An account with this email already exists.");
    }
    const stored: StoredUser = {
        id: crypto.randomUUID(),
        name: username,
        email,
        plan: "free",
        createdAt: new Date().toISOString(),
        password,
    };
    writeUsers([...users, stored]);

    const user = stripPassword(stored);
    setAccessToken(`mock-token-${user.id}`);
    localStorage.setItem(kCurrentUserKey, JSON.stringify(user));
    return buildResponse(user);
};

export const mockLogout = async (): Promise<void> => {
    clearAccessToken();
    localStorage.removeItem(kCurrentUserKey);
};

export const mockVerifyEmail = async (_token?: string | null): Promise<void> => {
    // No real verification without a backend — just succeed.
    return Promise.resolve();
};

export const mockResendVerification = async (_email: string): Promise<void> => {
    // No email is actually sent without a backend — just succeed.
    return Promise.resolve();
};

export const mockUpdateProfile = async (
    partial: Partial<User>,
): Promise<User> => {
    const raw = localStorage.getItem(kCurrentUserKey);
    if (!raw) throw new Error("Not authenticated.");
    const updated: User = { ...(JSON.parse(raw) as User), ...partial };
    localStorage.setItem(kCurrentUserKey, JSON.stringify(updated));
    writeUsers(
        readUsers().map((u) =>
            u.id === updated.id ? { ...u, ...partial } : u,
        ),
    );
    return updated;
};

export const mockMe = (): User | null => {
    try {
        const raw = localStorage.getItem(kCurrentUserKey);
        return raw ? (JSON.parse(raw) as User) : null;
    } catch {
        return null;
    }
};
