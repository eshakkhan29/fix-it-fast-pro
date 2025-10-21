import axios from 'axios';
import { useSession } from 'next-auth/react';

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://uat-api3.azurewebsites.net';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      // const token = window.localStorage.getItem('token');
      const session: any = useSession();
      if (session?.data?.accessToken) {
        config.headers.Authorization = `Bearer ${session?.data?.accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    if (status === 401) {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('token');
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export const endpoints = {
  auth: {
    token: '/token',
    me: '/me',
  },
} as const;
