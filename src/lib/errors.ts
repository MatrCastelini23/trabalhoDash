import type { ApiErrorReason } from "../types/sports";

export function errorMessage(reason?: ApiErrorReason): string {
    if (reason === "live-session") {
        return "A OpenF1 limita o acesso gratuito enquanto há uma sessão de F1 ao vivo. Os dados voltam quando a sessão terminar.";
    }
    return "Não foi possível carregar os dados agora. Tente novamente em instantes.";
}