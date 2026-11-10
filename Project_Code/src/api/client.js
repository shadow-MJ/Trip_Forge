import axios from 'axios';

export const AUTH_TOKEN_KEY = 'tripforge_token';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // Ignore storage access errors
  }
  return config;
});

/**
 * Simulates realistic REST API latency for mock endpoints.
 */
export function simulateNetworkDelay(ms = 220) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Deep-clones mock payloads so local component state never mutates mockDb by reference.
 */
export function cloneData(value) {
  return JSON.parse(JSON.stringify(value));
}

export default apiClient;

