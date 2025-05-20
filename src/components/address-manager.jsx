import React, { useState } from "react";
import { useAuth } from "../context/auth/AuthContext";
import SelectInput from "./select-input";
import Button from "./button";
import Input from "./input";

export default function AddressManager() {
  const { user, switchAddress, addAddress, currentAddress } = useAuth();
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    zip: "",
    country: "",
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
    if (
      newAddress.street &&
      newAddress.city &&
      newAddress.zip &&
      newAddress.country
    ) {
      addAddress(newAddress);
      setNewAddress({ street: "", city: "", zip: "", country: "" });
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

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          showAddAddressForm
            ? "max-h-[500px] opacity-100 mt-4"
            : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
          <Input
            label="Street Address"
            name="street"
            value={newAddress.street}
            onChange={handleInputChange}
            placeholder="123 Main St"
          />
          <Input
            label="City"
            name="city"
            value={newAddress.city}
            onChange={handleInputChange}
            placeholder="Anytown"
          />
          <Input
            label="ZIP / Postal Code"
            name="zip"
            value={newAddress.zip}
            onChange={handleInputChange}
            placeholder="12345"
          />
          <Input
            label="Country"
            name="country"
            value={newAddress.country}
            onChange={handleInputChange}
            placeholder="USA"
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
      </div>
    </div>
  );
}
