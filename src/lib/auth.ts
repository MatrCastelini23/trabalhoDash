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

export function setStoredToken(token: string) {
    try {
        window.localStorage.setItem(TOKEN_KEY, token);
    } catch {
        /* armazenamento bloqueado: o usuário só precisará entrar de novo */
    }
}

export function clearStoredToken() {
    try {
        window.localStorage.removeItem(TOKEN_KEY);
    } catch {
        /* ignora */
    }
}

export function decodeToken(token: string): TokenPayload | null {
    try {
        return jwtDecode<TokenPayload>(token);
    } catch {
        return null;
    }
}

/** Sem `exp` (ou ilegível), o token conta como expirado. */
export function isTokenExpired(token: string): boolean {
    const payload = decodeToken(token);
    if (!payload?.exp) return true;
    return payload.exp * 1000 <= Date.now();
}

export function isTokenValid(token: string | null): token is string {
    return token !== null && !isTokenExpired(token);
}