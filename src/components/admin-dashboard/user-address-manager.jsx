import React, { useState } from "react";
import Input from "../input";
import SelectInput from "../select-input";
import { useAuth } from "../../context/auth/AuthContext";
import {
  adminGetUserAddresses,
  adminReplaceUserAddresses,
} from "../../api/serices/api_utils";

const UserAddressManager = () => {
  const { user } = useAuth();
  const [userEmail, setUserEmail] = useState("");
  const [userAddresses, setUserAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [postCode, setPostCode] = useState("");
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);

  // Dummy address suggestions data
  const dummyAddressSuggestions = [
    { label: "10 Downing Street, London, SW1A 2AA", value: "10-downing-st" },
    { label: "221B Baker Street, London, NW1 6XE", value: "221b-baker-st" },
    {
      label: "48 Leicester Square, London, WC2H 7LU",
      value: "48-leicester-sq",
    },
    {
      label: "1 London Bridge Street, London, SE1 9GF",
      value: "1-london-bridge",
    },
    {
      label: "20 Fenchurch Street, London, EC3M 8AF",
      value: "20-fenchurch-st",
    },
    { label: "1 Canada Square, London, E14 5AB", value: "1-canada-sq" },
    { label: "Westminster, London, SW1A 0AA", value: "westminster" },
  ];

  // Enhanced Mock function to search addresses with loading state
  const searchAddresses = React.useCallback((searchTerm) => {
    if (!searchTerm || searchTerm.length < 2) {
      setAddressSuggestions([]);
      return;
    }

    setIsSearching(true);

    // Clear any existing search timeout
    if (window.addressSearchTimeout) {
      clearTimeout(window.addressSearchTimeout);
    }

    // Simulated API call with debounce
    window.addressSearchTimeout = setTimeout(() => {
      // Simulated server delay
      const filteredSuggestions = dummyAddressSuggestions.filter((addr) =>
        addr.label.toLowerCase().includes(searchTerm.toLowerCase())
      );

      // Add the current input as a custom option if it's not in the results
      // and has comma-separated format (street, city, zip)
      const parts = searchTerm.split(",");
      if (
        parts.length >= 2 &&
        !filteredSuggestions.some(
          (s) => s.label.toLowerCase() === searchTerm.toLowerCase()
        )
      ) {
        filteredSuggestions.push({
          label: searchTerm,
          value: `custom-${Date.now()}`, // Generate a unique value
        });
      }

      setAddressSuggestions(filteredSuggestions);
      setIsSearching(false);
    }, 300);
  }, []);

  // Handle selection of an address from the suggestions
  const handleAddressSelect = (event) => {
    const selectedValue = event.target.value;
    const selected = addressSuggestions.find((s) => s.value === selectedValue);

    if (selected) {
      setSelectedAddress(selected);
      setNewAddress(selected.label);
    }
  };

  const handleEmailSearch = async () => {
    if (!userEmail) {
      setError("Please enter an email address");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Call admin API to get addresses by email
      const res = await adminGetUserAddresses(userEmail);
      if (res.success && Array.isArray(res.addresses)) {
        // Map backend addresses to UI format (address, postcode, id)
        setUserAddresses(
          res.addresses.map((a, idx) => ({
            id: a.id || idx.toString(),
            address: a.address || "", // Only use address
            postcode: a.postcode || "", // Only use postcode
          }))
        );
        setShowAddressForm(false);
      } else {
        setUserAddresses([]);
        setError(res.message || "No addresses found for this user.");
      }
    } catch (err) {
      setError(
        err.message || "Error fetching user addresses. Please try again."
      );
      setUserAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddressUpdate = async (addressId, isDelete = false) => {
    // Confirm before add or delete
    if (isDelete) {
      if (!window.confirm("Are you sure you want to delete this address?"))
        return;
    } else {
      if (!window.confirm("Are you sure you want to add this address?")) return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      if (isDelete) {
        const updatedAddresses = userAddresses.filter(
          (addr) => addr.id !== addressId
        );
        const res = await adminReplaceUserAddresses({
          email: userEmail,
          addresses: updatedAddresses.map((a) => ({
            id: a.id,
            address: a.address, // FIX: use correct property
            postcode: a.postcode, // FIX: use correct property
          })),
        });
        if (res.success) {
          setUserAddresses(updatedAddresses);
          setSuccess("Address deleted successfully");
        } else {
          setError(res.message || "Failed to update addresses");
        }
      } else {
        if (!newAddress && !selectedAddress) {
          throw new Error("Please select or enter an address");
        }
        let addressData;
        if (selectedAddress) {
          // Only use address and zip (postcode)
          const parts = selectedAddress.label.split(",");
          addressData = {
            id: Date.now().toString(),
            address: parts[0]?.trim() || selectedAddress.label,
            postcode: postCode || parts[1]?.trim() || "",
          };
        } else {
          // Only use address and zip (postcode), no validation
          addressData = {
            id: Date.now().toString(),
            address: newAddress,
            postcode: postCode,
          };
        }
        // Add to END of list and update backend
        const updatedAddresses = [...userAddresses, addressData];
        const res = await adminReplaceUserAddresses({
          email: userEmail,
          addresses: updatedAddresses.map((a) => ({
            id: a.id,
            address: a.address,
            postcode: a.postcode,
          })),
        });
        if (res.success) {
          setUserAddresses(updatedAddresses);
          setSuccess("Address added successfully");
          setShowAddressForm(false);
          setNewAddress("");
          setPostCode("");
          setSelectedAddress(null);
          setAddressSuggestions([]);
        } else {
          setError(res.message || "Failed to update addresses");
        }
      }
    } catch (err) {
      setError(err.message || "Error updating address. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePostCodeChange = (e) => {
    setPostCode(e.target.value);
    // Reset address fields when postcode changes
    setNewAddress("");
    setSelectedAddress(null);
    setAddressSuggestions([]);

    // If postcode is long enough, trigger address search
    if (e.target.value.length >= 5) {
      searchAddresses(e.target.value);
    }
  };

  return (
    <div className="bg-white px-16 py-6 rounded-3xl shadow-[0px_10px_20px_0px_rgba(0,0,0,0.20)] md:w-[93vw] mx-auto">
      <h2 className="text-lg font-semibold text-primary mb-4">
        User Address Management
      </h2>

      {/* Email Search Section */}
      <div className="flex flex-col md:flex-row  gap-4 mb-6 items-center">
        <Input
          label="User Email"
          name="userEmail"
          type="email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          placeholder="Enter user email"
          className="flex-grow"
        />
        <button
          onClick={handleEmailSearch}
          disabled={loading}
          className="px-4 py-2 bg-primary text-white rounded-md h-11  hover:bg-green-700 transition-colors disabled:bg-gray-300"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-100 text-green-700 rounded-md text-sm">
          {success}
        </div>
      )}

      {/* Add New Address Form */}
      {showAddressForm && (
        <div className="p-4 bg-gray-50 rounded-md border border-gray-200 mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Add New Address
          </h4>
          <div className="flex flex-col gap-2 mb-2">
            <Input
              label="Street Address"
              placeholder="Enter your street address (city will be assumed from postcode)"
              helperText="Only enter your street address. City and country will be inferred from postcode."
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              className="text-sm"
              size="small"
              required
            />
            <Input
              label="Postcode"
              value={postCode}
              onChange={handlePostCodeChange}
              placeholder="Enter postcode (e.g., SW1A 0AA)"
              helperText="City and country will be inferred from postcode."
              className="text-sm"
              size="small"
              required
            />
            <SelectInput
              label="Address (optional search)"
              placeholder="Type to search for a street address"
              value={selectedAddress?.value || ""}
              onChange={handleAddressSelect}
              options={addressSuggestions}
              searchEnabled={true}
              onSearch={searchAddresses}
              className="text-sm"
              size="small"
              inputText={newAddress}
              onInputChange={(e) => {
                const value = e.target.value;
                setNewAddress(value);
                if (selectedAddress && value !== selectedAddress.label) {
                  setSelectedAddress(null);
                }
                if (value && value.length >= 2) {
                  searchAddresses(value);
                }
              }}
              helperText="Search for a street address or enter manually. City/country will be inferred from postcode."
            />
            {isSearching && (
              <div className="text-xs text-gray-500 mt-1">Searching...</div>
            )}
            {!isSearching &&
              newAddress &&
              newAddress.length >= 2 &&
              addressSuggestions.length === 0 && (
                <div className="text-xs text-gray-500 mt-1">
                  No addresses found. Enter your street address (city/country
                  will be inferred from postcode).
                </div>
              )}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => {
                setShowAddressForm(false);
                setNewAddress("");
                setPostCode("");
                setSelectedAddress(null);
                setAddressSuggestions([]);
              }}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={() => handleAddressUpdate()}
              disabled={loading || (!selectedAddress && !newAddress)}
              className="px-3 py-1.5 text-sm bg-primary text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-300"
            >
              {loading ? "Adding..." : "Add Address"}
            </button>
          </div>
        </div>
      )}

      {/* Addresses List */}
      {userAddresses.length > 0 && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium text-gray-700">
              Current Addresses
            </h3>
            <button
              onClick={() => setShowAddressForm(true)}
              className="text-primary hover:text-blue-700 text-sm flex items-center gap-1"
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
              Add Address
            </button>
          </div>
          <div className="space-y-3">
            {userAddresses.map((address) => (
              <div
                key={address.id}
                className="p-3 bg-gray-50 rounded-md border border-gray-200 flex justify-between items-start"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {address.address}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {address.postcode}
                  </div>
                </div>
                <button
                  onClick={() => handleAddressUpdate(address.id, true)}
                  className="text-red-600 hover:text-red-800 p-1"
                  title="Delete address"
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAddressManager;
