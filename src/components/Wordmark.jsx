import { Hammer } from "lucide-react";

export default function Wordmark({ size = "md" }) {
  const isLarge = size === "lg";
  return (
    <div className="flex flex-col items-start">
      <div className="flex items-center gap-2">
        <div
          style={{ backgroundColor: "#fff3e8", borderRadius: "8px", padding: isLarge ? "8px" : "6px" }}
        >
          <Hammer
            size={isLarge ? 28 : 20}
            style={{ color: "#f97316" }}
          />
        </div>
        <span
          style={{
            fontWeight: 800,
            fontSize: isLarge ? "2rem" : "1.25rem",
            color: "#1a3c6e",
            letterSpacing: "-0.5px",
          }}
        >
          ShramSetu
        </span>
      </div>
      <span
        style={{
          fontSize: isLarge ? "0.9rem" : "0.7rem",
          color: "#94a3b8",
          marginLeft: isLarge ? "52px" : "38px",
          marginTop: "-2px",
          fontStyle: "italic",
        }}
      >
        Har Haath Ko Kaam
      </span>
    </div>
  );
}
