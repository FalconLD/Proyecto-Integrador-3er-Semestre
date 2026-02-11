import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

const STORAGE_USER = 'h2o_user';
const STORAGE_TOKEN = 'h2o_token';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(STORAGE_USER);
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_TOKEN));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem(STORAGE_TOKEN);
    if (t) api.setToken(t);
  }, []);

  useEffect(() => {
    if (token) {
      api.setToken(token);
      api.auth
        .me()
        .then((u) => {
          const full = { ...u };
          setUser(full);
          localStorage.setItem(STORAGE_USER, JSON.stringify(full));
        })
        .catch(() => {
          localStorage.removeItem(STORAGE_TOKEN);
          setToken(null);
          setUser(null);
        });
    }
  }, [token]);

  const login = (userData, authToken) => {
    setToken(authToken);
    setUser({ ...userData, token: authToken });
    localStorage.setItem(STORAGE_TOKEN, authToken);
    localStorage.setItem(STORAGE_USER, JSON.stringify({ ...userData, token: authToken }));
    api.setToken(authToken);
  };

  const setGuestUser = (userData) => {
    setUser(userData);
    setToken(null);
    localStorage.removeItem(STORAGE_TOKEN);
    localStorage.setItem(STORAGE_USER, JSON.stringify(userData));
    api.setToken(null);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_USER);
    localStorage.removeItem(STORAGE_TOKEN);
    api.setToken(null);
  };

  const updateUser = (changes) => {
    const merged = { ...user, ...changes };
    setUser(merged);
    localStorage.setItem(STORAGE_USER, JSON.stringify(merged));
  };

  const tienePermiso = (permiso) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    const permisos = user.permisos || [];
    return Array.isArray(permisos) && permisos.includes(permiso);
  };

  const puedeVerPanelAdmin = () =>
    tienePermiso('ver_panel_admin') || tienePermiso('ver_estadisticas_avanzadas');

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        setLoading,
        login,
        setGuestUser,
        logout,
        updateUser,
        tienePermiso,
        puedeVerPanelAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
