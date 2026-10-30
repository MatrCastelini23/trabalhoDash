import { jwtDecode } from "jwt-decode";

export const TOKEN_KEY = "sportstrack.token";

export interface TokenPayload {
    sub?: string;
    name?: string;
    email?: string;
    exp?: number;
}

export function getStoredToken(): string | null {
    if (typeof window === "undefined") return null;
    try {
        return window.localStorage.getItem(TOKEN_KEY);
    } catch {
        return null;
    }
}

export function decodeToken(token: string): TokenPayload | null {
    try {
        return jwtDecode<TokenPayload>(token);
    } catch {
        return null;
    }
}

export function isTokenExpired(token: string): boolean {
    const payload = decodeToken(token);
    if (!payload?.exp) return true;
    return payload.exp * 1000 <= Date.now();
}
