const API_BASE_URL = "https://auth-plate-nestjs.onrender.com";
export const API_ENDPOINTS = {
    login: `${API_BASE_URL}/login`,
    register: `${API_BASE_URL}/register`,
} as const;
export const COOKIE_NAME = 'token';
export const COOKIE_EXPIRES_DAYS = 7;
