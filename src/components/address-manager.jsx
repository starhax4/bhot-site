import React, { useState } from "react";
import { useAuth } from "../context/auth/AuthContext";
import SelectInput from "./select-input";
import Button from "./button";
import Input from "./input";
import { fetchAddressesByPostcode } from "../api/serices/api_utils";

export default function AddressManager() {
  const { user, switchAddress, addAddress, currentAddress } = useAuth();
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    address: "",
    postcode: "",
  });
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [addressError, setAddressError] = useState("");

  // Early return for Basic users - show only current address
  if (user?.plan === "Basic") {
    return (
      <div className="my-4 p-4 border rounded-md shadow-sm bg-white">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">
          Your Address
        </h3>
        <p className="text-gray-600">{currentAddress?.street}</p>
        <p className="text-gray-600">
          {currentAddress?.city}, {currentAddress?.zip}
        </p>
        <p className="text-gray-600">{currentAddress?.country}</p>
        <p className="text-sm text-gray-400 mt-4">
          Upgrade to Pro to manage multiple addresses
        </p>
      </div>
    );
  }

  const handleAddressChange = (e) => {
    switchAddress(e.target.value);
  };

  const handleAddNewAddress = () => {
    const finalAddress = selectedAddress || newAddress.address;
    if (finalAddress && newAddress.postcode) {
      addAddress({
        address: finalAddress,
        postcode: newAddress.postcode,
      });
      setNewAddress({ address: "", postcode: "" });
      setSelectedAddress("");
      setAddresses([]);
      setAddressError("");
      setShowAddAddressForm(false);
    } else {
      alert("Please select an address or enter your address manually.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  // UK Postcode formatter with proper validation and address fetching
  const handlePostcodeChange = async (e) => {
    let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");

    // Format UK postcode with space
    if (value.length > 3) {
      const outward = value.slice(0, -3);
      const inward = value.slice(-3);
      value = outward + " " + inward;
    }

    // Limit to 8 characters maximum (including space)
    if (value.length <= 8) {
      setNewAddress((prev) => ({ ...prev, postcode: value }));

      // Clear previous addresses and selected address when postcode changes
      setAddresses([]);
      setSelectedAddress("");
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
            setAddresses(addressOptions);

            if (addressOptions.length === 0) {
              setAddressError(
                "No addresses found for this postcode. You may need to enter your address manually."
              );
            }
          } else {
            setAddressError(
              result.message || "Unable to fetch addresses for this postcode."
            );
            setAddresses([]);
          }
        } catch (err) {
          console.error("Error fetching addresses:", err);
          setAddressError(
            "Error fetching addresses. Please try again or enter your address manually."
          );
          setAddresses([]);
        } finally {
          setIsLoadingAddresses(false);
        }
      }
    }
  };

  // Handler for address selection from lookup
  const handleAddressSelection = (e) => {
    setSelectedAddress(e.target.value);
    setAddressError("");
  };

  const addressOptions = user.addresses.map((addr) => ({
    value: addr.id,
    label: `${addr.street}, ${addr.city}`,
  }));

  return (
    <div className="my-4 p-4 border rounded-md shadow-sm bg-white">
      <h3 className="text-lg font-semibold mb-2 text-gray-700">
        Manage Address
      </h3>
      <div className="flex items-end gap-4">
        <div className="flex-grow">
          <SelectInput
            label="Current Address"
            options={addressOptions}
            value={currentAddress?.id || ""}
            onChange={handleAddressChange}
            name="currentAddress"
          />
        </div>
        <Button
          onClick={() => setShowAddAddressForm(!showAddAddressForm)}
          variant="secondary"
          className="h-10"
        >
          {showAddAddressForm ? "Cancel" : "Add New Address"}
        </Button>
      </div>

      {showAddAddressForm && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
          <Input
            label="Postcode"
            name="postcode"
            value={newAddress.postcode || ""}
            onChange={handlePostcodeChange}
            placeholder="Enter your UK postcode (e.g., SW1A 0AA)"
            pattern="^[A-Z]{1,2}[0-9R][0-9A-Z]?\s[0-9][A-Z]{2}$"
            title="Please enter a valid UK postcode (e.g., SW1A 0AA, M1 9AB)"
            maxLength="8"
            type="text"
            required
            helperText="Enter your postcode to find your address automatically."
          />

          {/* Address Selection */}
          {newAddress.postcode && (
            <div className="relative">
              {isLoadingAddresses ? (
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                  <span className="text-sm text-blue-700">
                    Finding addresses for {newAddress.postcode}...
                  </span>
                </div>
              ) : addresses.length > 0 ? (
                <SelectInput
                  name="selectedAddress"
                  label="Select Your Address"
                  options={addresses}
                  value={selectedAddress}
                  onChange={handleAddressSelection}
                  placeholder="Choose your address from the list"
                  searchEnabled={true}
                  required
                  fullWidth
                  helperText={`${addresses.length} address${
                    addresses.length === 1 ? "" : "es"
                  } found. Start typing to search or select from the dropdown.`}
                />
              ) : addressError ? (
                <div className="space-y-4">
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-yellow-800">{addressError}</p>
                      <button
                        type="button"
                        onClick={() =>
                          handlePostcodeChange({
                            target: { value: newAddress.postcode },
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
                    name="address"
                    value={newAddress.address || ""}
                    onChange={handleInputChange}
                    placeholder="Enter your full street address manually"
                    minLength="10"
                    title="Please enter your complete street address"
                    required
                    helperText="Please enter your full address including house number and street name."
                  />
                </div>
              ) : newAddress.postcode.includes(" ") &&
                newAddress.postcode.length >= 6 ? (
                <Input
                  label="Street Address"
                  name="address"
                  value={newAddress.address || ""}
                  onChange={handleInputChange}
                  placeholder="Enter your full street address"
                  minLength="10"
                  title="Please enter your complete street address"
                  required
                  helperText="Please enter your full address including house number and street name."
                />
              ) : (
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Complete your postcode above to automatically find your
                    address.
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-2 mt-6">
            <Button
              onClick={() => {
                setShowAddAddressForm(false);
                setNewAddress({ address: "", postcode: "" });
                setSelectedAddress("");
                setAddresses([]);
                setAddressError("");
              }}
              variant="outline"
            >
              Cancel
            </Button>
            <Button onClick={handleAddNewAddress}>Save Address</Button>
          </div>
        </div>
      )}
    </div>
  );
}
