export const API_BASE_URL = 'http://localhost:3000';

export const API_ENDPOINTS = {
  login: `${API_BASE_URL}/login`,
  register: `${API_BASE_URL}/register`,
} as const;

export const COOKIE_NAME = 'auth_token';
export const COOKIE_EXPIRES_DAYS = 7;
