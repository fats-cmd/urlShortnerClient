import type { User } from "./User";

export type Role = "admin" | "user";

export interface AuthResponse {
    accessToken: string;
    refreshToken?: string;
    role?: Role;
    user?: User;
    expiresIn?: number | null;
    message?: string;
    success?: boolean;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface SignupCredentials {
    username: string;
    email: string;
    password: string;
    confirm: string;
    role: Role;
}

export interface SignupForm {
    username: string;
    email: string;
    password: string;
    confirm: string;
}

export interface LoginForm {
    email: string;
    password: string;
}

export interface AuthContextValue {
    role?: Role | null;
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (credentials: LoginCredentials) => Promise<AuthResponse>;
    signup: (credentials: SignupCredentials) => Promise<AuthResponse>;
    logout: () => Promise<void>;
    updateUser: (partial: Partial<User>) => Promise<void>;
}
