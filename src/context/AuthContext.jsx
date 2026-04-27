import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getProfile, login as apiLogin, refreshAccessToken } from "../api/auth";
import { registerUser } from "../api/users";

const AuthContext = createContext(null);
const STORAGE_KEY = "nakshop_auth";

/**
 * AuthProvider
 * - store tokens in localStorage
 * - fetch profile when token exists
 * - refresh token when access token expired (401)
 */
export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true); // restoring session/profile
  const [error, setError] = useState("");

  // ✅ Restore tokens from localStorage on first load
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const saved = JSON.parse(raw);
        setAccessToken(saved.accessToken || "");
        setRefreshToken(saved.refreshToken || "");
      } catch {}
    }
    setLoading(false);
  }, []);

  // ✅ Fetch profile when accessToken changes
  useEffect(() => {
    let alive = true;

    async function run() {
      setError("");

      // no token => logged out
      if (!accessToken) {
        setUser(null);
        return;
      }

      try {
        setLoading(true);
        const profile = await getProfile(accessToken);
        if (!alive) return;
        setUser(profile);
      } catch (e) {
        // if token expired -> try refresh
        if (!refreshToken) {
          if (!alive) return;
          setUser(null);
          setAccessToken("");
          return;
        }

        try {
          const tokens = await refreshAccessToken(refreshToken);
          if (!alive) return;

          setAccessToken(tokens.access_token);
          setRefreshToken(tokens.refresh_token);

          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
              accessToken: tokens.access_token,
              refreshToken: tokens.refresh_token,
            })
          );
          // profile will refetch automatically because accessToken changed
        } catch (e2) {
          if (!alive) return;
          setError(e2?.message || "Session expired");
          setUser(null);
          setAccessToken("");
          setRefreshToken("");
          localStorage.removeItem(STORAGE_KEY);
        }
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    run();
    return () => {
      alive = false;
    };
  }, [accessToken, refreshToken]);

  // ✅ login action (called from Login page)
  async function login(email, password) {
    setError("");
    const tokens = await apiLogin(email, password);

    setAccessToken(tokens.access_token);
    setRefreshToken(tokens.refresh_token);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
      })
    );
  }

  /**
   * ✅ register action
   * Standard flow:
   * 1) create user via POST /users
   * 2) login automatically to get tokens
   */
  async function register({ name, email, password, avatar }) {
    setError("");
    await registerUser({
      name,
      email,
      password,
      avatar: avatar || "https://i.pravatar.cc/300",
    });

    // auto login after register
    await login(email, password);
  }

  function logout() {
    setAccessToken("");
    setRefreshToken("");
    setUser(null);
    setError("");
    localStorage.removeItem(STORAGE_KEY);
  }

  const isAuthed = !!accessToken;

  const value = useMemo(
    () => ({ user, isAuthed, accessToken, refreshToken, loading, error, login, register, logout }),
    [user, isAuthed, accessToken, refreshToken, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}