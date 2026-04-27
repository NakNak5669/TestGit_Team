import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/Auth.css";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const { login, error: authError } = useAuth();

  const [email, setEmail] = useState("john@mail.com");
  const [password, setPassword] = useState("changeme");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email.trim()) return setError("Email is required.");
    if (!password) return setError("Password is required.");

    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (e2) {
      setError(e2?.message || "Login failed");
    }
  }

  return (
    <div className="container auth">
      <div className="auth-card">
        <div className="auth-head">
          <h1>Welcome back</h1>
          <p className="muted">Login with Platzi Auth JWT</p>
        </div>

        {error ? <div className="alert">{error}</div> : null}
        {authError ? <div className="alert">{authError}</div> : null}

        <form className="auth-form" onSubmit={onSubmit}>
          <label className="field">
            <span className="muted">Email</span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </label>

          <label className="field">
            <span className="muted">Password</span>
            <div className="input-row">
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button type="button" className="btn btn-ghost" onClick={() => setShow((s) => !s)}>
                {show ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          <button className="btn btn-primary full" type="submit">
            Login
          </button>
        </form>

        <p className="muted auth-foot">
          New here? <Link to="/register" className="link">Create an account</Link>
        </p>
      </div>
    </div>
  );
}