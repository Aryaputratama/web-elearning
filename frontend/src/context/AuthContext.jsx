import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Configure axios to always send cookies
axios.defaults.withCredentials = true;

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);          // null = anonymous / not logged in
  const [loading, setLoading] = useState(true);    // true while checking existing session

  const refresh = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API}/auth/me`, { withCredentials: true });
      setUser(data.user);
      return data.user;
    } catch {
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    (async () => {
      await refresh();
      setLoading(false);
    })();
  }, [refresh]);

  const login = async (email, password) => {
    const { data } = await axios.post(
      `${API}/auth/login`,
      { email, password },
      { withCredentials: true }
    );
    setUser(data.user);
    return data.user;
  };

  const register = async (email, password, name) => {
    const { data } = await axios.post(
      `${API}/auth/register`,
      { email, password, name },
      { withCredentials: true }
    );
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    try {
      await axios.post(`${API}/auth/logout`, {}, { withCredentials: true });
    } catch {}
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refresh, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export function formatApiErrorDetail(detail) {
  if (detail == null) return "Terjadi kesalahan. Coba lagi.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))
    return detail
      .map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e)))
      .filter(Boolean)
      .join(" ");
  if (detail && typeof detail.msg === "string") return detail.msg;
  return String(detail);
}
