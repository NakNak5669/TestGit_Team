import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "../styles/Header.css";

export default function Header() {
  const { cartCount } = useCart();
  const { isAuthed, user, logout } = useAuth();
  const navigate = useNavigate();

  function onSearchSubmit(e) {
    e.preventDefault();
    const q = new FormData(e.currentTarget).get("q")?.toString().trim() || "";
    navigate(q ? `/?q=${encodeURIComponent(q)}` : "/");
  }

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="brand" aria-label="NakShop Home">
          <span className="brand-mark">◼</span>
          <span className="brand-text">NakShop</span>
        </Link>

        <form className="search" onSubmit={onSearchSubmit} role="search">
          <input name="q" placeholder="Search products…" aria-label="Search products" />
          <button className="btn btn-primary" type="submit">Search</button>
        </form>

        <nav className="nav" aria-label="Primary navigation">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "navlink active" : "navlink")}>
            Home
          </NavLink>

          <NavLink to="/cart" className={({ isActive }) => (isActive ? "navlink active" : "navlink")}>
            Cart <span className="badge">{cartCount}</span>
          </NavLink>

          {/* ✅ Auth menu */}
          {isAuthed ? (
            <>
              <NavLink
                to="/profile"
                className={({ isActive }) => (isActive ? "navlink active" : "navlink")}
              >
                {user?.name ? user.name.split(" ")[0] : "Profile"}
              </NavLink>

              <button
                type="button"
                className="navlink"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={({ isActive }) => (isActive ? "navlink active" : "navlink")}>
                Login
              </NavLink>
              <NavLink to="/register" className={({ isActive }) => (isActive ? "navlink active" : "navlink")}>
                Register
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}