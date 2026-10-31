export type WeatherIcon = "sun" | "cloud" | "rain" | "storm" | "snow" | "fog";

const TABLE: Record<number, [string, WeatherIcon]> = {
    0: ["Céu limpo", "sun"],
    1: ["Predomínio de sol", "sun"],
    2: ["Parcialmente nublado", "cloud"],
    3: ["Nublado", "cloud"],
    45: ["Neblina", "fog"],
    48: ["Neblina", "fog"],
    51: ["Garoa fraca", "rain"],
    53: ["Garoa", "rain"],
    55: ["Garoa forte", "rain"],
    56: ["Garoa congelante", "rain"],
    57: ["Garoa congelante", "rain"],
    61: ["Chuva fraca", "rain"],
    63: ["Chuva", "rain"],
    65: ["Chuva forte", "rain"],
    66: ["Chuva congelante", "rain"],
    67: ["Chuva congelante", "rain"],
    71: ["Neve fraca", "snow"],
    73: ["Neve", "snow"],
    75: ["Neve forte", "snow"],
    77: ["Grãos de neve", "snow"],
    80: ["Pancadas de chuva", "rain"],
    81: ["Pancadas de chuva", "rain"],
    82: ["Pancadas fortes", "rain"],
    85: ["Pancadas de neve", "snow"],
    86: ["Pancadas de neve", "snow"],
    95: ["Trovoada", "storm"],
    96: ["Trovoada com granizo", "storm"],
    99: ["Trovoada com granizo", "storm"],
};

export function describeWeather(code: number): { label: string; icon: WeatherIcon } {
    const [label, icon] = TABLE[code] ?? ["Tempo indefinido", "cloud"];
    return { label, icon };
}