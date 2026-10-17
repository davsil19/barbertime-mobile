// Controlador de sesión: guarda el usuario logueado y expone login/logout a toda la app
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authService } from '../services/auth';
import { setUnauthorizedHandler } from '../services/http';
import { storage } from '../services/storage';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [cargando, setCargando] = useState(true);

  const logout = useCallback(async () => { await authService.logout(); setUser(null); }, []);

  useEffect(() => {
    setUnauthorizedHandler(logout); // token vencido -> volver al login
    (async () => {
      try {
        const token = await authService.token();
        if (token) {
          const payload = JSON.parse(decodeURIComponent(escape(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))));
          const u = await authService.me(payload.id);
          setUser(u);
        }
      } catch { await authService.logout(); }
      setCargando(false);
    })();
  }, [logout]);

  const value = {
    user, cargando, logout, setUser,
    esAdmin: user?.rol === 'admin',
    login: async (email, password) => setUser(await authService.login(email, password)),
    register: async (d) => setUser(await authService.register(d)),
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
