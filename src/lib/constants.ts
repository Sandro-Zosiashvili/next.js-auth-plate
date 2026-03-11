export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
  login: `${API_BASE_URL}/auth/login`,
  register: `${API_BASE_URL}/auth/register`,
} as const;

export const COOKIE_NAME = 'auth_token';
export const COOKIE_EXPIRES_DAYS = 7;
