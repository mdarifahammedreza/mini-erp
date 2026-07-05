import axios from 'axios';
import { API_BASE_URL } from '../../constants/config';
import { useAuthStore } from '../../store/auth.store';
import { toast } from 'sonner';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url?.includes('/auth/refresh') || originalRequest.url?.includes('/auth/login')) {
        useAuthStore.getState().clearUser();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const storedAuth = localStorage.getItem('mini-erp-auth');
        let parsedAuth: any = {};
        try {
          if (storedAuth) parsedAuth = JSON.parse(storedAuth);
        } catch (_) {}
        const refreshToken = parsedAuth?.state?.refreshToken || '';

        const { data } = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          { refreshToken },
          { withCredentials: true },
        );

        const newAccessToken = data.data.accessToken;
        useAuthStore.getState().setUser(data.data.user, newAccessToken);

        // Update local storage object so it preserves refresh tokens if any
        if (storedAuth) {
          const updated = {
            state: {
              ...parsedAuth.state,
              accessToken: newAccessToken,
              user: data.data.user,
              refreshToken: data.data.refreshToken || parsedAuth.state.refreshToken,
              isAuthenticated: true,
            },
            version: parsedAuth.version || 0,
          };
          localStorage.setItem('mini-erp-auth', JSON.stringify(updated));
        }

        apiClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        useAuthStore.getState().clearUser();
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response?.status === 403) {
      toast.error(error.response?.data?.message || 'You do not have permission to perform this action.');
    }

    if (error.response?.status === 400) {
      toast.error(error.response?.data?.message || 'Invalid request parameters.');
    }

    if (error.response?.status >= 500) {
      toast.error('Internal server error. Please try again later.');
    }

    return Promise.reject(error);
  },
);
