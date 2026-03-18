// import Cookies from 'js-cookie';
// import { API_ENDPOINTS, COOKIE_NAME, COOKIE_EXPIRES_DAYS } from './constants';
//
// export interface LoginDto {
//   email: string;
//   password: string;
// }
//
// export interface RegisterDto {
//   name: string;
//   email: string;
//   password: string;
// }
//
// export interface AuthResponse {
//   access_token: string;
// }
//
// export interface AuthError {
//   message: string | string[];
//   statusCode?: number;
// }
//
// async function handleResponse<T>(response: Response): Promise<T> {
//   if (!response.ok) {
//     const error: AuthError = await response.json().catch(() => ({
//       message: 'An unexpected error occurred',
//       statusCode: response.status,
//     }));
//     throw new Error(
//       Array.isArray(error.message) ? error.message.join(', ') : error.message,
//     );
//   }
//   return response.json() as Promise<T>;
// }
//
// export async function loginUser(dto: LoginDto, endpoint: string = API_ENDPOINTS.login): Promise<AuthResponse> {
//   const response = await fetch(endpoint, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(dto),
//   });
//   const data = await handleResponse<AuthResponse>(response);
//   Cookies.set(COOKIE_NAME, data.access_token, {
//     expires: COOKIE_EXPIRES_DAYS,
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: 'strict',
//   });
//   return data;
// }
//
// export async function loginUserPanel(dto: LoginDto): Promise<AuthResponse> {
//   return loginUser(dto, API_ENDPOINTS.userLogin);
// }
//
// export async function registerUser(dto: RegisterDto): Promise<AuthResponse> {
//   const response = await fetch(API_ENDPOINTS.register, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(dto),
//   });
//   const data = await handleResponse<AuthResponse>(response);
//   Cookies.set(COOKIE_NAME, data.access_token, {
//     expires: COOKIE_EXPIRES_DAYS,
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: 'strict',
//   });
//   return data;
// }
//
// export function logoutUser(): void {
//   Cookies.remove(COOKIE_NAME);
// }
//


import axios from 'axios';
import Cookies from 'js-cookie';
import { API_ENDPOINTS, COOKIE_NAME, COOKIE_EXPIRES_DAYS } from './constants';

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
}

const api = axios.create({
  headers: { 'Content-Type': 'application/json' },
});

function saveToken(token: string): void {
  Cookies.set(COOKIE_NAME, token, {
    expires: COOKIE_EXPIRES_DAYS,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
}

export async function adminLogin(dto: LoginDto): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>(API_ENDPOINTS.adminLogin, dto);
  saveToken(data.access_token);
  return data;
}



export async function userLogin(dto: LoginDto): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>(API_ENDPOINTS.userLogin, dto);
  saveToken(data.access_token);
  return data;
}

export async function registerUser(dto: RegisterDto): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>(API_ENDPOINTS.register, dto);
  saveToken(data.access_token);
  return data;
}

export function logoutUser(): void {
  Cookies.remove(COOKIE_NAME);
}
