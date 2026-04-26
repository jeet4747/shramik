import React from "react";

export default function Wordmark({ size = "md" }) {
  const isLarge = size === "lg";
  return (
    <div className="flex items-center select-none cursor-pointer hover:opacity-90 transition-opacity">
      <img
        src="/Shramik-Logo.png"
        alt="Shramik"
        className={isLarge ? "h-10 w-auto transform scale-[5] origin-center md:origin-left" : "h-10 w-auto transform scale-[5] md:scale-[4.5] origin-center md:origin-left"}
      />
    </div>
  );
}