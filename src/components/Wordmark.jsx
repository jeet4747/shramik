import React from "react";

export default function Wordmark({ size = "md" }) {
  const isLarge = size === "lg";
  return (
    <div className="flex items-center">
      <img
        src="/Shramik-Logo.svg"
        alt="Shramik"
        className={isLarge ? "h-16" : "h-10"}
      />
    </div>
  );
}
