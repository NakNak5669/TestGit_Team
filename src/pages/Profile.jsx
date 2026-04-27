import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import EmptyState from "../components/EmptyState";
import "../styles/Auth.css"; // reuse auth card style (optional)

export default function Profile() {
  const navigate = useNavigate();
  const { user, isAuthed, loading, logout } = useAuth();

  // ✅ While restoring session / fetching profile
  if (loading) {
    return (
      <div className="container auth" style={{ paddingTop: 30 }}>
        <div className="auth-card">
          <h2>Loading profile...</h2>
          <p className="muted">Please wait</p>
        </div>
      </div>
    );
  }

  // ✅ Not logged in
  if (!isAuthed) {
    return (
      <div className="container" style={{ padding: "18px 0" }}>
        <EmptyState
          title="You are not logged in"
          subtitle="Please login to view your profile."
          action={
            <Link to="/login" className="btn btn-primary">
              Go to Login
            </Link>
          }
        />
      </div>
    );
  }

  // ✅ Logged in but profile not loaded (rare)
  if (!user) {
    return (
      <div className="container" style={{ padding: "18px 0" }}>
        <EmptyState title="Profile not available" subtitle="Try logout and login again." />
      </div>
    );
  }

  return (
    <div className="container auth" style={{ paddingTop: 30 }}>
      <div className="auth-card">
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
          <img
            src={user.avatar || "https://i.pravatar.cc/120"}
            alt={user.name || "User"}
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              objectFit: "cover",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          />

          <div>
            <h2 style={{ margin: 0 }}>{user.name || "User"}</h2>
            <div className="muted" style={{ marginTop: 4 }}>
              {user.email}
            </div>
          </div>
        </div>

        <div
          style={{
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 16,
            padding: 14,
            background: "rgba(255,255,255,0.04)",
          }}
        >
          <div className="muted" style={{ fontSize: 13, lineHeight: 1.8 }}>
            <div>
              <span className="muted">ID:</span> <strong>{user.id}</strong>
            </div>
            <div>
              <span className="muted">Role:</span> <strong>{user.role || "customer"}</strong>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <button
            className="btn btn-primary"
            type="button"
            onClick={() => navigate("/")}
          >
            Go Home
          </button>

          <button
            className="btn btn-ghost"
            type="button"
            onClick={() => {
              logout();
              navigate("/");
            }}
          >
            Logout
          </button>
        </div>

        <p className="muted" style={{ marginTop: 12 }}>
          <strong>API:</strong> this data is from <code>/auth/profile</code>
        </p>
      </div>
    </div>
  );
}