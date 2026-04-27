// src/api/users.js
import { http } from "./http";

/**
 * registerUser(payload)
 * POST /users
 * payload: { name, email, password, avatar }
 */
export async function registerUser(payload) {
  const res = await http.post("/users", payload);
  return res.data; // returns created user
}