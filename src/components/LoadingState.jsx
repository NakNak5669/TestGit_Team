import React from "react";

export default function LoadingState({ label = "Loading..." }) {
  return (
    <div className="container" style={{ padding: "18px 0" }}>
      <p className="muted">{label}</p>
    </div>
  );
}