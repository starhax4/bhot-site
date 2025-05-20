import React, { useState } from "react";
import { useAuth } from "../context/auth/AuthContext";

/**
 * Component for handling errors related to address management
 */
export default function AddressError({ error, onRetry }) {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = () => {
    setIsRetrying(true);
    // Simulate a retry operation
    setTimeout(() => {
      onRetry();
      setIsRetrying(false);
    }, 1000);
  };

  return (
    <div className="p-4 bg-red-50 border border-red-100 rounded-lg mb-4">
      <h3 className="text-red-700 font-medium">Address Error</h3>
      <p className="text-sm text-red-600 mt-1">{error}</p>
      <button
        onClick={handleRetry}
        disabled={isRetrying}
        className="mt-2 px-4 py-1 bg-red-600 text-white rounded-md text-sm disabled:opacity-50"
      >
        {isRetrying ? "Retrying..." : "Retry"}
      </button>
    </div>
  );
}
