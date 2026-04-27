import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../styles/ProductDetails.css";

import RatingStars from "../components/RatingStars";
import LoadingState from "../components/LoadingState";
import EmptyState from "../components/EmptyState";

import { getProductById } from "../api/products";
import { normalizeProduct } from "../lib/normalizeProduct";
import { useCart } from "../context/CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();

  // ✅ standard data states (original hooks)
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ fetch by id
  useEffect(() => {
    let alive = true;

    async function run() {
      setLoading(true);
      setError("");
      setProduct(null);
      setActiveImage(0);

      try {
        const raw = await getProductById(id);
        const normalized = normalizeProduct(raw);
        if (!alive) return;
        setProduct(normalized);
      } catch (e) {
        if (!alive) return;
        setError(e?.message || "Failed to load product");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    if (id) run();
    return () => {
      alive = false;
    };
  }, [id]);

  const images = useMemo(() => product?.images || [], [product]);
  const mainImage = images.length ? images[Math.min(activeImage, images.length - 1)] : "";

  if (loading) return <LoadingState label="Loading product..." />;

  if (error) {
    return (
      <div className="container details">
        <Link to="/" className="back">← Back</Link>
        <EmptyState
          title="Failed to load product"
          subtitle={error}
          action={
            <Link className="btn btn-primary" to="/">
              Go home
            </Link>
          }
        />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container details">
        <Link to="/" className="back">← Back</Link>
        <EmptyState title="Product not found" subtitle="Try another item." />
      </div>
    );
  }

  return (
    <div className="container details">
      <Link to="/" className="back">← Back</Link>

      <div className="details-card">
        <div className="gallery">
          <img className="main-img" src={mainImage} alt={product.title} />

          <div className="thumbs">
            {images.map((src, idx) => (
              <button
                key={src + idx}
                className={idx === activeImage ? "thumb active" : "thumb"}
                onClick={() => setActiveImage(idx)}
                type="button"
                aria-label={`View image ${idx + 1}`}
              >
                <img src={src} alt="" />
              </button>
            ))}
          </div>
        </div>

        <div className="info">
          <span className="pill">{product.category}</span>
          <h1>{product.title}</h1>

          <div className="rating-row">
            <RatingStars value={product.rating} />
            <span className="muted">{product.rating.toFixed(1)}/5</span>
          </div>

          <p className="muted">{product.description}</p>

          <div className="buy">
            <div className="price big">${product.price.toFixed(2)}</div>
            <button className="btn btn-primary" onClick={() => addToCart(product)}>
              Add to cart
            </button>
          </div>

          <div className="note">
            <strong>API:</strong> Loaded from <code>/products/{id}</code>
          </div>
        </div>
      </div>
    </div>
  );
}