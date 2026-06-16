import { create } from 'zustand';

interface AuthState {
  token: string | null;
  user: any | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('authforge_token'),
  user: null,
  
  login: async (email, password) => {
    // Para local dev (localhost) u OnRender
    const AUTH_URL = import.meta.env.VITE_AUTHFORGE_URL || 'http://localhost:4000';
    const res = await fetch(`${AUTH_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    if (!res.ok) throw new Error('Login failed');
    
    const data = await res.json();
    localStorage.setItem('authforge_token', data.tokens.accessToken);
    localStorage.setItem('authforge_refresh', data.tokens.refreshToken);
    set({ token: data.tokens.accessToken, user: data.user });
  },
  
  logout: () => {
    localStorage.removeItem('authforge_token');
    localStorage.removeItem('authforge_refresh');
    set({ token: null, user: null });
  },
}));
