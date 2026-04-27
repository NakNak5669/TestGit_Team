// src/api/products.js
import { http } from "./http";

/**
 * ✅ getProducts(params)
 * GET /products?...
 *
 * Params (API supports):
 * - offset, limit (pagination)
 * - title (search by title)
 * - price (exact price)
 * - price_min, price_max (price range)
 * - categoryId (filter by category id)
 */
export async function getProducts(params = {}) {
  const res = await http.get("/products", { params });
  return res.data;
}
/**
 * ✅ getProductById(id)
 * GET /products/:id
 */
export async function getProductById(id) {
  const res = await http.get(`/products/${id}`);
  return res.data;
}