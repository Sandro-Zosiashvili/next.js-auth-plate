const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
export const API_ENDPOINTS = {
    login: `${API_BASE}/login`,
    register: `${API_BASE}/register`,
} as const;
export const COOKIE_NAME = 'token';
export const COOKIE_EXPIRES_DAYS = 7;
