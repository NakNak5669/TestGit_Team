import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { getProducts } from "../api/products";
import { getCategories } from "../api/categories";
import { normalizeProduct } from "../lib/normalizeProduct";
import { useDebouncedValue } from "../lib/debounce";

import ProductCard from "../components/ProductCard";
import CategoryChips from "../components/CategoryChips";
import PriceRange from "../components/PriceRange";
import LoadingState from "../components/LoadingState";
import EmptyState from "../components/EmptyState";
import { useCart } from "../context/CartContext";
import "../styles/Home.css";

export default function Home() {
  const { addToCart } = useCart();
  const [params] = useSearchParams();
  const q = (params.get("q") || "").trim();

  const pageSize = 12;
  const [page, setPage] = useState(1);

  // ✅ Filters (UI state)
  const [categoryId, setCategoryId] = useState("All");
  const [priceMax, setPriceMax] = useState(200);
  const [exactPrice, setExactPrice] = useState("");

  // ✅ Debounced values (API uses these, not raw typing/dragging)
  const debouncedExactPrice = useDebouncedValue(exactPrice, 450);
  const debouncedPriceMax = useDebouncedValue(priceMax, 350);

  // ✅ Data states
  const [products, setProducts] = useState([]);

  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Load categories once
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await getCategories();
        // console.log(data)
        if (!alive) return;
        setCats(Array.isArray(data) ? data : []);
      } catch (e) {
        // show error in console (not blocking UI)
        console.error("Categories error:", e);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // ✅ Load products when filters/page change
  useEffect(() => {
    let alive = true;

    async function run() {
      setLoading(true);
      setError("");

      try {
        const offset = (page - 1) * pageSize;

        const data = await getProducts({
          offset,
          limit: pageSize,
          title: q || undefined,  
          // ✅ category
          categoryId: categoryId === "All" ? undefined : categoryId,
          // ✅ exact price overrides range (debounced)
          price: debouncedExactPrice !== "" ? Number(debouncedExactPrice) : undefined,
          // ✅ range only works when exact price is empty (debounced)
          price_min: debouncedExactPrice === "" ? 0 : undefined,
          price_max: debouncedExactPrice === "" ? debouncedPriceMax : undefined,
        });
        // console.log(data)

        const normalized = Array.isArray(data) ? data.map(normalizeProduct) : [];
        if (!alive) return;
        setProducts(normalized);
      } catch (e) {
        if (!alive) return;
        console.error("Products error:", e);
        setError(e?.message || "Failed to load products");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    run();
    return () => {
      alive = false;
    };
  }, [page, q, categoryId, debouncedPriceMax, debouncedExactPrice]);

  const categoryLabels = useMemo(() => {
    const clean = cats
      .filter((c) => c && typeof c.name === "string")
      .map((c) => ({ id: c.id, name: c.name.trim() }))
      .filter((c) => c.name.length > 0 && c.name.length <= 18)
      .slice(0, 20);
    return ["All", ...clean.map((c) => c.name)];
  }, [cats]);

  // ✅ safe compare (categoryId might be string)
  const selectedCategoryName =
    categoryId === "All"
      ? "All"
      : (cats.find((c) => String(c.id) === String(categoryId))?.name || "All");



  const hasNext = products.length === pageSize;

  if (loading) return <LoadingState label="Loading products..." />;

  if (error) {
    return (
      <div className="container" style={{ padding: "18px 0" }}>
        <EmptyState
          title="Failed to load products"
          subtitle={error}
          action={
            <button className="btn btn-primary" onClick={() => setPage((p) => p)}>
              Retry
            </button>
          }
        />
      </div>
    );
  }

  return (
    <div className="container home">
      <section className="hero">
        <div>
          <h1>UI First Shop</h1>
          <p className="muted">Original React Hooks + Axios (debounced filters)</p>
        </div>
        <button
          className="btn"
          onClick={() => {
            setPage(1);
            setCategoryId("All");
            setPriceMax(200);
            setExactPrice("");
          }}
        >
          Reset
        </button>
      </section>

      <div className="layout">
        <aside className="sidebar">
          <div className="panel">
            <h3>Category</h3>
            <CategoryChips
              categories={categoryLabels}
              value={selectedCategoryName}
              onChange={(name) => {
                if (name === "All") {
                  setCategoryId("All");
                } else {
                  const found = cats.find((c) => c.name === name);
                  setCategoryId(found ? found.id : "All");
                }
                setPage(1);
              }}
            />
          </div>

          <div className="panel">
            <h3>Exact price</h3>
            <input
              className="select"
              placeholder="e.g. 100"
              inputMode="numeric"
              value={exactPrice}
              onChange={(e) => {
                setExactPrice(e.target.value.replace(/[^\d]/g, ""));
                setPage(1);
              }}
            />
            {exactPrice ? (
              <p className="muted" style={{ marginTop: 8, fontSize: 12 }}>
                Exact price is active → range disabled
              </p>
            ) : null}
          </div>

          <div className="panel">
            <h3>Price range</h3>
            <PriceRange
              min={0}
              max={200}
              value={priceMax}
              disabled={!!exactPrice}   // ✅ disable slider when exact price is set
              onChange={(v) => {
                setPriceMax(v);
                setPage(1);
              }}
            />
            <p className="muted" style={{ marginTop: 8, fontSize: 12 }}>
              API uses debounced max: <strong>{debouncedPriceMax}</strong>
            </p>
          </div>
        </aside>

        <section className="content">
          <div className="content-top">
            <div>
              <strong>{products.length}</strong> items
            </div>

            <div className="pager">
              <button className="btn btn-ghost" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                Prev
              </button>
              <span className="muted">
                Page <strong>{page}</strong>
              </span>
              <button className="btn btn-ghost" disabled={!hasNext} onClick={() => setPage((p) => p + 1)}>
                Next
              </button>
            </div>
          </div>

          {products.length === 0 ? (
            <EmptyState title="No products found" subtitle="Try changing filters/search." />
          ) : (
            <div className="grid">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} onAdd={addToCart} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}