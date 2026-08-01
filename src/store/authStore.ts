import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import axios from "axios";

interface User {
  id: string;
  email: string;
  roles: string[];
  universityId?: string;
  scopeId?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  // refreshToken removed: handled by browser cookies
  isAuthenticated: boolean;
  setAuth: (accessToken: string, user: User) => void;
  updateAccessToken: (accessToken: string) => void;
  logout: () => void;
  hasRole: (role: string) => boolean;
}

export const normalizeOptionalId = (value?: string | null): string | undefined => {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const lowered = trimmed.toLowerCase();
  if (lowered === "null" || lowered === "undefined") return undefined;
  return trimmed;
};

const GATEWAY_URL = "http://localhost:8080";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      // Only take accessToken and user; cookies handle the rest
      setAuth: (accessToken, user) =>
        set({
          accessToken,
          user: {
            ...user,
            universityId: normalizeOptionalId(user.universityId),
            scopeId: normalizeOptionalId(user.scopeId),
          },
          isAuthenticated: true,
        }),

      updateAccessToken: (accessToken) => set({ accessToken }),

     logout: async () => {
        try {
          // Attempt to notify backend to clear cookies and tokens
          await api.post("/api/v1/auth/logout"); 
        } catch (e) {
          // Log error for debugging, but proceed with local cleanup
          console.warn("Backend logout failed or user already unauthenticated", e);
        } finally {
          // ALWAYS clear local state regardless of server response
          set({ 
            accessToken: null, 
            user: null, 
            isAuthenticated: false 
          });
          
          // Clear persisted storage to prevent auto-login on refresh
          localStorage.removeItem("auth-storage");
          
          // Optional: Clear any other session-specific cache
          // queryClient.clear(); 
        }
      },

      hasRole: (role) => get().user?.roles.includes(role) || false,
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

/**
 * PRODUCTION-READY AXIOS INSTANCE
 */
export const api = axios.create({
  baseURL: GATEWAY_URL,
  withCredentials: true, // CRITICAL: This allows browser to send/receive cookies
});



let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// 1. Request Interceptor
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 2. Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise(async (resolve, reject) => {
        try {
          // Note: Empty body because refreshToken is in the Cookie
          const res = await axios.post(
            `${GATEWAY_URL}/api/v1/auth/refresh`,
            {},
            { withCredentials: true } 
          );
          
          const newAccessToken = res.data.data.accessToken;

          useAuthStore.getState().updateAccessToken(newAccessToken);
          processQueue(null, newAccessToken);

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          resolve(api(originalRequest));
        } catch (refreshError) {
          processQueue(refreshError, null);
          useAuthStore.getState().logout();
          window.location.href = "/signin";
          reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      });
    }
    return Promise.reject(error);
  }
);