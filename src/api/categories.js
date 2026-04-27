// src/api/categories.js
import { http } from "./http";

/**
 * ✅ getCategories()
 * GET /categories
 * Returns: [{ id, name, slug, image }, ...]
 */
export async function getCategories() {
  const res = await http.get("/categories");
  return res.data;
}