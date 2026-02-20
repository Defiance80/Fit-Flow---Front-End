import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { store } from "@/redux/store";
import { tokenSelector } from "@/redux/reducers/userSlice";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const ENDPOINT = process.env.NEXT_PUBLIC_END_POINT;

const EXTERNAL_API_URL = `${BASE_URL}/${ENDPOINT}`;

const DEFAULT_TIMEOUT = 30000;

/**
 * Get authentication token from Redux store
 * This is the preferred method as it works reliably on the client side
 * @returns string | null - The auth token or null if not found
 */
const getAuthTokenFromRedux = (): string | null => {
  // Check if we're in a browser environment
  if (typeof window === "undefined") {
    return null;
  }

  try {
    // Get the current state from Redux store
    const state = store.getState();
    // Use the tokenSelector to get the token from state
    const token = tokenSelector(state);
    return token || null;
  } catch (error) {
    console.error("Error getting auth token from Redux store:", error);
    return null;
  }
};

const axiosConfig: AxiosRequestConfig = {
  baseURL: EXTERNAL_API_URL,
  timeout: DEFAULT_TIMEOUT,
  headers: {
    "Content-Type": "multipart/form-data",
    Accept: "application/json",
  },
};

const axiosClient: AxiosInstance = axios.create(axiosConfig);

/**
 * Request interceptor to add authentication token dynamically
 * This runs on each request, so we can get the token at request time
 * instead of module initialization time
 */
axiosClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Only add Authorization header if it's not already set
    // This allows API functions to override the token if needed
    if (!config.headers.Authorization) {
      // Get token from Redux store
      const token = getAuthTokenFromRedux();
      // console.log('token', token)
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    const statusCode = error.response?.status;

    switch (statusCode) {
      case 401:
        break;
      case 403:
        break;
      case 404:
        break;
      case 500:
        break;
      default:
        break;
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
