export const API_ENDPOINTS = {
  login: `${process.env.NEXT_PUBLIC_API_BASE_URL}/login`,
  register: `${process.env.NEXT_PUBLIC_API_BASE_URL}/register`,
} as const;

export const COOKIE_NAME = 'token';
export const COOKIE_EXPIRES_DAYS = 7;
