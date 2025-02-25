import { create } from "zustand";
import { createJSONStorage, persist, PersistOptions } from "zustand/middleware";

interface User {
  id: number;
  name: string;
  email: string;
  role: string | null;
  posts_count: number;
  followers_count: number;
  following_count: number;
}

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const persistOptions: PersistOptions<AuthState> = {
  name: "auth-storage", // Key used in localStorage
  storage: createJSONStorage(() => localStorage), // Use JSON serialization for localStorage
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      token: null,
      user: null,
      login: (token: string, user: User) =>
        set({ isAuthenticated: true, token: token, user: user }),
      logout: () => set({ isAuthenticated: false, token: null, user: null }),
    }),
    persistOptions
  )
);

// Helper function to retrieve the access token
export const getAccessToken = () => useAuthStore.getState().token;

// Helper function to retrieve the authenticated user
export const getAuthenticatedUser = () => useAuthStore.getState().user;
