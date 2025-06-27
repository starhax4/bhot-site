import React from "react";

export default function UserIcon({ className = "", size = 24 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle
        cx="12"
        cy="8"
        r="4"
      />
      <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
    </svg>
  );
}
