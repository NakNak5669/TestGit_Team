import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthed, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; // or <LoadingState />

  if (!isAuthed) {
    // ✅ redirect to login and remember where user wanted to go
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}