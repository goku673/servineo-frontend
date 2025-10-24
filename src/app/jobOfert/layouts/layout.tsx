import React from "react";

export default function JobOffersLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: "Roboto, sans-serif" }}>
      {children}
    </div>
  );
}