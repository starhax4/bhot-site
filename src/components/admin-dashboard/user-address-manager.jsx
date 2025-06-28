import React, { useState } from "react";
import Input from "../input";
import SelectInput from "../select-input";
import { useAuth } from "../../context/auth/AuthContext";
import {
  adminGetUserAddresses,
  adminReplaceUserAddresses,
  fetchAddressesByPostcode,
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
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [addressError, setAddressError] = useState("");

  // Handle selection of an address from the suggestions
  const handleAddressSelect = (event) => {
    const selectedValue = event.target.value;
    const selected = addressSuggestions.find((s) => s.value === selectedValue);

    if (selected) {
      setSelectedAddress(selected);
      setNewAddress(selected.label);
      setAddressError("");
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
        const finalAddress = selectedAddress || newAddress;
        if (!finalAddress && !newAddress) {
          throw new Error("Please select or enter an address");
        }
        let addressData;
        if (selectedAddress) {
          // Use the selected address value
          addressData = {
            id: Date.now().toString(),
            address: selectedAddress.value,
            postcode: postCode,
          };
        } else {
          // Use manually entered address
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
          setAddressError("");
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

  // UK Postcode formatter with proper validation and address fetching
  const handlePostCodeChange = async (e) => {
    let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");

    // Format UK postcode with space
    if (value.length > 3) {
      const outward = value.slice(0, -3);
      const inward = value.slice(-3);
      value = outward + " " + inward;
    }

    // Limit to 8 characters maximum (including space)
    if (value.length <= 8) {
      setPostCode(value);

      // Reset address fields when postcode changes
      setNewAddress("");
      setSelectedAddress(null);
      setAddressSuggestions([]);
      setAddressError("");

      // Fetch addresses when postcode is complete (has space and correct length)
      if (value.includes(" ") && value.length >= 6 && value.length <= 8) {
        setIsLoadingAddresses(true);
        setAddressError("");

        try {
          const result = await fetchAddressesByPostcode(value);

          if (result.success && result.data.addresses) {
            const addressOptions = result.data.addresses.map((addr) => ({
              label: addr.label,
              value: addr.value,
            }));
            setAddressSuggestions(addressOptions);

            if (addressOptions.length === 0) {
              setAddressError(
                "No addresses found for this postcode. You may need to enter your address manually."
              );
            }
          } else {
            setAddressError(
              result.message || "Unable to fetch addresses for this postcode."
            );
            setAddressSuggestions([]);
          }
        } catch (err) {
          console.error("Error fetching addresses:", err);
          setAddressError(
            "Error fetching addresses. Please try again or enter your address manually."
          );
          setAddressSuggestions([]);
        } finally {
          setIsLoadingAddresses(false);
        }
      }
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
              label="Postcode"
              value={postCode}
              onChange={handlePostCodeChange}
              placeholder="Enter your UK postcode (e.g., SW1A 0AA)"
              pattern="^[A-Z]{1,2}[0-9R][0-9A-Z]?\s[0-9][A-Z]{2}$"
              title="Please enter a valid UK postcode (e.g., SW1A 0AA, M1 9AB)"
              maxLength="8"
              type="text"
              required
              helperText="Enter your postcode to find your address automatically."
              className="text-sm"
              size="small"
            />

            {/* Address Selection */}
            {postCode && (
              <div className="relative">
                {isLoadingAddresses ? (
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    <span className="text-xs text-blue-700">
                      Finding addresses for {postCode}...
                    </span>
                  </div>
                ) : addressSuggestions.length > 0 ? (
                  <SelectInput
                    name="selectedAddress"
                    label="Select Address"
                    options={addressSuggestions}
                    value={selectedAddress?.value || ""}
                    onChange={handleAddressSelect}
                    placeholder="Choose address from the list"
                    searchEnabled={true}
                    required
                    fullWidth
                    helperText={`${addressSuggestions.length} address${
                      addressSuggestions.length === 1 ? "" : "es"
                    } found. Start typing to search.`}
                    className="text-sm"
                    size="small"
                  />
                ) : addressError ? (
                  <div className="space-y-3">
                    <div className="p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-yellow-800">
                          {addressError}
                        </p>
                        <button
                          type="button"
                          onClick={() =>
                            handlePostCodeChange({
                              target: { value: postCode },
                            })
                          }
                          className="text-xs text-yellow-700 hover:text-yellow-900 underline"
                          disabled={isLoadingAddresses}
                        >
                          Retry
                        </button>
                      </div>
                    </div>
                    <Input
                      label="Street Address"
                      placeholder="Enter your full street address manually"
                      helperText="Please enter your full address including house number and street name."
                      value={newAddress}
                      onChange={(e) => setNewAddress(e.target.value)}
                      className="text-sm"
                      size="small"
                      required
                    />
                  </div>
                ) : postCode.includes(" ") && postCode.length >= 6 ? (
                  <Input
                    label="Street Address"
                    placeholder="Enter your full street address"
                    helperText="Please enter your full address including house number and street name."
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    className="text-sm"
                    size="small"
                    required
                  />
                ) : (
                  <div className="p-2 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-xs text-gray-600">
                      Complete your postcode above to automatically find your
                      address.
                    </p>
                  </div>
                )}
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
                setAddressError("");
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
