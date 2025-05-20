import React, { useState } from "react";
import { useAuth } from "../context/auth/AuthContext";

/**
 * A simplified address selection component for mobile views
 * This component provides a dropdown menu to select addresses for Pro users
 */
export default function AddressSelector() {
  const { user, switchAddress, addAddress, deleteAddress, currentAddress } =
    useAuth();
  const [showAddModal, setShowAddModal] = useState(false);

  if (
    !user ||
    user.plan !== "Pro" ||
    !user.addresses ||
    user.addresses.length <= 1
  ) {
    return null;
  }

  const handleAddressChange = (e) => {
    switchAddress(e.target.value);
  };

  return (
    <div className="w-full mb-2 flex items-center">
      <div className="flex-grow">
        <div className="flex items-center">
          <span className="text-xs text-gray-600 mr-2">Address:</span>
          <select
            value={currentAddress?.id || ""}
            onChange={handleAddressChange}
            className="flex-grow py-1 px-2 text-xs border border-gray-300 rounded bg-white text-gray-700"
          >
            {user.addresses.map((addr) => (
              <option
                key={addr.id}
                value={addr.id}
              >
                {addr.street}, {addr.city}
                {addr.id === "addr1" ? " (Primary)" : " (Secondary)"}
              </option>
            ))}
          </select>
        </div>
      </div>
      {user.addresses.length < 5 && (
        <button
          onClick={() => setShowAddModal(true)}
          className="ml-2 p-1 text-blue-600 text-xs"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
