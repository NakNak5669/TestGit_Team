// src/api/auth.js
import { http } from "./http";

/**
 * login(email, password)
 * POST /auth/login
 * -> { access_token, refresh_token }
 */
export async function login(email, password) {
  const res = await http.post("/auth/login", { email, password });
  return res.data;
}

/**
 * getProfile(accessToken)
 * GET /auth/profile (Bearer token)
 */
export async function getProfile(accessToken) {
  const res = await http.get("/auth/profile", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return res.data;
}

/**
 * refreshAccessToken(refreshToken)
 * POST /auth/refresh-token
 * -> { access_token, refresh_token }
 */
export async function refreshAccessToken(refreshToken) {
  const res = await http.post("/auth/refresh-token", { refreshToken });
  return res.data;
}