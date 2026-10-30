import axios from "axios";
// API para Fórmula 1
const API_FORMULA = process.env.NEXT_PUBLIC_API_FORMULA;
const API_SPORTS_KEY = process.env.NEXT_PUBLIC_API_SPORTS_KEY;

const configFormula = axios.create({
    method: 'get',
    url: `${API_FORMULA}`,
    headers: {
        'x-apisports-key': `${API_SPORTS_KEY}`,
    }
});
