import React, { useState } from "react";
import { useAuth } from "../context/auth/AuthContext";
import SelectInput from "./select-input";
import Button from "./button";
import Input from "./input";

export default function AddressManager() {
  const { user, switchAddress, addAddress, currentAddress } = useAuth();
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    address: "",
    postcode: "",
  });

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
    if (newAddress.address && newAddress.postcode) {
      addAddress(newAddress);
      setNewAddress({ address: "", postcode: "" });
      setShowAddAddressForm(false);
    } else {
      alert("Please fill in all address fields.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
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
            label="Street Address"
            name="address"
            value={newAddress.address || ""}
            onChange={handleInputChange}
            placeholder="Enter your street address (city will be assumed from postcode)"
            helperText="Only enter your street address. City and country will be inferred from postcode."
            required
          />
          <Input
            label="Postcode"
            name="postcode"
            value={newAddress.postcode || ""}
            onChange={handleInputChange}
            placeholder="Enter postcode (e.g., SW1A 0AA)"
            helperText="City and country will be inferred from postcode."
            required
          />
          <div className="flex justify-end gap-2 mt-6">
            <Button
              onClick={() => setShowAddAddressForm(false)}
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
