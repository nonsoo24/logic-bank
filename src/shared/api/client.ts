import axios, { type AxiosError } from 'axios';

export const api = axios.create({
  baseURL: 'https://api.logicbank.com',
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Attach auth token when available
api.interceptors.request.use((config) => {
  // TODO: inject Bearer token here when auth is wired up
  // const token = getAuthToken();
  // if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Normalize network errors vs HTTP errors into consistent Error instances
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (!error.response) {
      // No response = network failure (offline, timeout, DNS, CORS)
      return Promise.reject(
        new Error('Network error. Please check your connection and try again.')
      );
    }
    // Server returned an HTTP error — pass through for callers to inspect
    return Promise.reject(error);
  }
);
