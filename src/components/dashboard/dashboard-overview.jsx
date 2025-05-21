import React, { useState, useEffect, useCallback } from "react";
import SegmentedCircularGauge from "./SegmentedCircularGauge";
import ScatterPlot from "./scatter-plot";
import { useAuth } from "../../context/auth/AuthContext";
import SelectInput from "../select-input";
import Input from "../input";
import DualRangeSlider from "../dual-range-slider";

// Dummy data for scatter plot
const scatterData = Array.from({ length: 50 }, () => ({
  x: Math.random() * 20,
  y: Math.random() * 250,
}));

const DashboardCard = () => {
  const [filter, setFilter] = useState({
    distance: "2", // Initial value for distance
    size: {
      min: 201,
      max: 300,
    }, // Initial range 0-50 sqm
    type: {
      detachedHouse: false,
      terracedHouse: false,
      parkHouse: false,
      flat: false,
    },
  });

  const { user, switchAddress, addAddress, currentAddress } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const [openDropdown, setOpenDropdown] = useState(null); // 'distance', 'size', 'type'
  const [distanceButtonLabel, setDistanceButtonLabel] = useState("Distance");
  const [sizeButtonLabel, setSizeButtonLabel] = useState("Size");
  const [typeButtonLabel, setTypeButtonLabel] = useState("Type");

  const sampleData = [
    { id: "proj1", frequency: 3, projectSuccess: 50 },
    { id: "proj2", frequency: 4, projectSuccess: 75 },
    { id: "proj3", frequency: 5, projectSuccess: 60 },
    { id: "proj4", frequency: 6, projectSuccess: 80 },
    { id: "proj5", frequency: 7, projectSuccess: 95 },
    { id: "proj6", frequency: 8, projectSuccess: 105 },
    { id: "proj7", frequency: 9, projectSuccess: 120 },
    { id: "proj8", frequency: 10, projectSuccess: 135 },
    { id: "proj9", frequency: 11, projectSuccess: 150 },
    { id: "proj10", frequency: 12, projectSuccess: 145 },
    { id: "proj11", frequency: 13, projectSuccess: 180 },
    { id: "proj12", frequency: 14, projectSuccess: 190 },
    { id: "proj13", frequency: 15, projectSuccess: 175 },
    { id: "proj14", frequency: 16, projectSuccess: 192 },
    { id: "proj15", frequency: 17, projectSuccess: 200 },
    { id: "proj16", frequency: 18, projectSuccess: 195 },
    { id: "proj17", frequency: 19, projectSuccess: 205 },
    { id: "proj18", frequency: 20, projectSuccess: 198 },
    { id: "proj19", frequency: 21, projectSuccess: 208 },
    { id: "proj20", frequency: 22, projectSuccess: 210 },
  ];

  // Sample data - replace with your actual data source
  const sampleChartData = [
    { category: "5k", value: 22 },
    { category: "10k", value: 30 },
    { category: "15k", value: 48 },
    { category: "20k", value: 40 },
    { category: "21k", value: 85.36 },
    { category: "22k", value: 52 },
    { category: "25k", value: 32 },
    { category: "30k", value: 40 },
    { category: "35k", value: 55 },
    { category: "40k", value: 48 },
    { category: "45k", value: 75 },
    { category: "50k", value: 68 },
    { category: "55k", value: 60 },
    { category: "60k", value: 55 },
  ];

  const periodOptions = [
    { label: "October", value: "october" },
    { label: "November", value: "november" },
    { label: "December", value: "december" },
  ];

  const [currentPeriod, setCurrentPeriod] = useState("october");

  const [propertyOverview, setPropertyOverview] = useState({
    address: "1 Street Name, City, Post Code",
    type: "e.g. Mid-terrace House",
    area: "x sqm",
  });

  // Update property overview when currentAddress changes
  useEffect(() => {
    if (currentAddress) {
      setPropertyOverview({
        address: `${currentAddress.street}, ${currentAddress.city}, ${currentAddress.zip}`,
        type: "e.g. Mid-terrace House", // We would fetch this from API in a real app
        area: "x sqm", // We would fetch this from API in a real app
      });
    }
  }, [currentAddress]);

  // Handle adding a new address
  const handleAddAddress1 = () => {
    if (!newAddress || newAddress.trim() === "") {
      return;
    }

    setIsSubmitting(true);

    // Parse the address - assuming format: "Street, City, Zip"
    const parts = newAddress.split(",").map((part) => part.trim());
    const addressData = {
      street: parts[0] || "New Address",
      city: parts[1] || "City",
      zip: parts[2] || "Zip",
      country: "United Kingdom",
    };

    // Simulate API call delay
    setTimeout(() => {
      addAddress(addressData);
      setNewAddress("");
      setShowAddForm(false);
      setIsSubmitting(false);
    }, 800);
  };

  // Address options for Pro users
  const getAddressOptions = () => {
    if (!user || !user.addresses) return [];

    return user.addresses.map((addr) => ({
      value: addr.id,
      label: `${addr.street}, ${addr.city}${
        addr.id === "addr1" ? " (Primary)" : " (Secondary)"
      }`,
    }));
  };

  const distanceOptions = [
    { label: "Distance", value: "default_distance", miles: filter.distance },
    { label: "Within 1 mile", value: "1", miles: "1" },
    { label: "Within 2 miles", value: "2", miles: "2" },
    { label: "Within 5 miles", value: "5", miles: "5" },
    { label: "Within 10 miles", value: "10", miles: "10" },
  ];

  const sizeOptions = [
    { label: "Size", value: "default_size" },
    { label: "0-50 sqm", value: "0-50", min: 0, max: 50 },
    { label: "51-100 sqm", value: "51-100", min: 51, max: 100 },
    { label: "101-150 sqm", value: "101-150", min: 101, max: 150 },
    { label: "151-200 sqm", value: "151-200", min: 151, max: 200 },
    { label: "201-300 sqm", value: "201-300", min: 201, max: 300 },
    { label: "301+ sqm", value: "301+", min: 301, max: 5000 },
  ];

  const typeOptions = [
    { label: "Type", value: "default_type" },
    { label: "Any Type", value: "any_type" },
    { label: "Detached House", value: "detachedHouse" },
    { label: "Terraced House", value: "terracedHouse" },
    { label: "Park House", value: "parkHouse" },
    { label: "Flat", value: "flat" },
  ];

  const handleDropdownToggle = (dropdownId) => {
    setOpenDropdown(openDropdown === dropdownId ? null : dropdownId);
  };

  const handleDistanceOptionSelect = (option) => {
    setDistanceButtonLabel(
      option.label === "Distance" ? "Distance" : option.label
    );
    if (option.value !== "default_distance") {
      setFilter((prevFilter) => ({
        ...prevFilter,
        distance: option.miles,
      }));
    }
    setOpenDropdown(null);
  };

  const handleSizeOptionSelect = (option) => {
    setSizeButtonLabel(option.label === "Size" ? "Size" : option.label);
    if (option.value !== "default_size") {
      setFilter((prevFilter) => ({
        ...prevFilter,
        size: {
          min: option.min,
          max: option.max,
        },
      }));
    }
    setOpenDropdown(null);
  };

  const handleTypeOptionSelect = (option) => {
    setTypeButtonLabel(option.label);
    const newTypeFilterState = {
      detachedHouse: false,
      terracedHouse: false,
      parkHouse: false,
      flat: false,
    };
    if (option.value !== "default_type" && option.value !== "any_type") {
      newTypeFilterState[option.value] = true;
    }
    // For "any_type", all remain false. For "default_type", no change to filter.type from here.
    if (option.value !== "default_type") {
      setFilter((prevFilter) => ({
        ...prevFilter,
        type: newTypeFilterState,
      }));
    }
    setOpenDropdown(null);
  };

  const handleCheckboxChange = (typeName) => {
    setFilter((prevFilter) => {
      const updatedType = {
        ...prevFilter.type,
        [typeName]: !prevFilter.type[typeName],
      };

      const trueTypes = Object.entries(updatedType)
        .filter(([_, value]) => value)
        .map(([key]) => key);

      if (trueTypes.length === 0) {
        setTypeButtonLabel("Any Type");
      } else if (trueTypes.length === 1) {
        const selectedTypeOption = typeOptions.find(
          (opt) => opt.value === trueTypes[0]
        );
        setTypeButtonLabel(
          selectedTypeOption ? selectedTypeOption.label : "Type"
        );
      } else {
        setTypeButtonLabel("Multiple Types");
      }

      return {
        ...prevFilter,
        type: updatedType,
      };
    });
  };

  const handleSizeRangeChange = useCallback(([min, max]) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      size: {
        min,
        max,
      },
    }));
    setSizeButtonLabel(`${min}-${max === 5000 ? "+" : max} sqm`);
  }, []);

  const handleRangeChange = (e) => {
    const { id, value } = e.target;
    setFilter((prevFilter) => ({
      ...prevFilter,
      [id]: value,
    }));
  };

  const handleAddAddress = async () => {
    if (!newAddress) return;

    setIsSubmitting(true);
    try {
      // Parse the address - assuming format: "Street, City, Zip"
      const parts = newAddress.split(",").map((part) => part.trim());
      const addressData = {
        street: parts[0] || "New Address",
        city: parts[1] || "City",
        zip: parts[2] || "Zip",
        country: "United Kingdom",
      };

      // Call addAddress from context
      await addAddress(addressData);
      setNewAddress("");
      setSelectedAddress(null);
      setAddressSuggestions([]);
      setShowAddForm(false);
    } catch (error) {
      console.error("Error adding address:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
    { label: "150 Oxford Street, London, W1D 1DF", value: "150-oxford-st" },
    {
      label: "31 Notting Hill Gate, London, W11 3JQ",
      value: "31-notting-hill",
    },
    {
      label: "25 Hampstead High Street, London, NW3 1RL",
      value: "25-hampstead",
    },
  ];

  // Enhanced Mock function to search addresses with loading state
  const searchAddresses = useCallback(
    (searchTerm) => {
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
    },
    [dummyAddressSuggestions]
  );

  // Handle selection of an address from the suggestions
  const handleAddressSelect = (event) => {
    const selectedValue = event.target.value;
    const selected = addressSuggestions.find((s) => s.value === selectedValue);

    if (selected) {
      setSelectedAddress(selected);
      setNewAddress(selected.label);
    }
  };

  return (
    <div className="flex flex-col  md:w-[45vw] px-4 pt-8 pb-5 bg-white  shadow-[0px_10px_20px_0px_rgba(0,0,0,0.20)] rounded-3xl ">
      {/* Property Info */}
      <div className="flex flex-col lg:flex-row justify-between">
        <div className="md:w-[100%] lg:w-[45%] flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-base text-primary font-semibold">
              Your Property
            </h2>
            {currentAddress && currentAddress.id && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {currentAddress.id === "addr1" ? "Primary" : "Secondary"}
              </span>
            )}
            {user &&
              user.plan === "Pro" &&
              user.addresses &&
              user.addresses.length < 5 && (
                <button
                  onClick={() => {
                    setShowAddForm(!showAddForm);
                    setNewAddress("");
                    setSelectedAddress(null);
                    setAddressSuggestions([]);
                  }}
                  className="ml-auto text-primary hover:text-blue-800 text-sm"
                  title="Add a new address"
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

          {/* Pro user address selector */}
          {user &&
            user.plan === "Pro" &&
            user.addresses &&
            user.addresses.length > 1 && (
              <div className="mb-3">
                <SelectInput
                  label="Select Address"
                  options={user.addresses.map((addr) => ({
                    value: addr.id,
                    label: `${addr.street}, ${addr.city}${
                      addr.id === "addr1" ? " (Primary)" : " (Secondary)"
                    }`,
                  }))}
                  value={currentAddress?.id || ""}
                  onChange={(e) => switchAddress(e.target.value)}
                  name="propertyAddress"
                  className="text-sm"
                  size="small"
                />
              </div>
            )}

          {/* Inline add address form with search functionality */}
          {showAddForm && (
            <div className="mb-3 p-2 bg-gray-50 rounded-md border border-gray-200">
              <div className="mb-2">
                <SelectInput
                  label="Address"
                  placeholder="Type to search for an address"
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
                    // Reset selected address when user types
                    if (selectedAddress && value !== selectedAddress.label) {
                      setSelectedAddress(null);
                    }
                    // Start search when the user has typed at least 2 characters
                    if (value && value.length >= 2) {
                      searchAddresses(value);
                    }
                  }}
                />
                {isSearching && (
                  <div className="text-xs text-gray-500 mt-1">Searching...</div>
                )}
                {!isSearching &&
                  newAddress &&
                  newAddress.length >= 2 &&
                  addressSuggestions.length === 0 && (
                    <div className="text-xs text-gray-500 mt-1">
                      No addresses found. Type a complete address (Street, City,
                      Postcode).
                    </div>
                  )}
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewAddress("");
                    setSelectedAddress(null);
                    setAddressSuggestions([]);
                  }}
                  className="px-2 py-1 text-xs text-gray-600 hover:text-gray-800"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddAddress}
                  className="px-2 py-1 text-xs bg-primary text-white rounded hover:bg-blue-700"
                  disabled={isSubmitting || newAddress.trim() === ""}
                >
                  {isSubmitting ? "Adding..." : "Add"}
                </button>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <div className="flex flex-col gap-10">
              <p className="text-neutral-400 text-sm font-semibold">Address:</p>
              <p className="text-neutral-400 text-sm font-semibold">Type:</p>
              <p className="text-neutral-400 text-sm font-semibold">Area: </p>
            </div>

            <div className="flex flex-col gap-5 w-48">
              <p className="text-neutral-400 text-sm font-semibold h-10">
                {propertyOverview.address}
              </p>
              <p className="text-neutral-400 text-sm font-semibold h-10">
                {propertyOverview.type}
              </p>
              <p className="text-neutral-400 text-sm font-semibold h-10">
                {propertyOverview.area}
              </p>
            </div>
          </div>
        </div>

        {/* Circular Progress Indicators */}
        <div className="flex flex-col items-center flex-wrap lg:flex-row lg:gap-10 md:justify-end">
          <div className="w-36">
            <p className="text-center mt-2 font-medium">Current</p>
            <SegmentedCircularGauge
              value={71}
              size={142}
            />
          </div>
          <div className=" w-36">
            <p className="text-center mt-2 font-medium">Potential</p>
            <SegmentedCircularGauge
              value={82}
              size={142}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col mt-4">
        <h2 className="flex text-center justify-center md:justify-start text-base  text-primary font-semibold">
          Neighbourhood benchmarking
        </h2>
        <div className="flex flex-col my-4">
          <div className="flex flex-col items-center md:items-start gap-4 md:flex-row justify-between w-full flex-wrap">
            {/* Distance Filter */}
            <div className="flex flex-col gap-2 relative">
              <button
                type="button"
                onClick={() => handleDropdownToggle("distance")}
                className={`w-32 px-2 py-2 outline-2 outline-offset-[-1px] outline-primary bg-primary text-white rounded-[50px] inline-flex justify-center items-center gap-2 overflow-hidden cursor-pointer `}
              >
                <p className="text-nowrap text-xs">{distanceButtonLabel}</p>
                <div className="flex my-auto items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-chevron-down-icon lucide-chevron-down"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
              </button>
              {openDropdown === "distance" && (
                <div className="absolute top-[20%] mt-1 w-40 bg-white shadow-xl rounded-lg z-20 border border-gray-200 py-1">
                  {distanceOptions.map((opt) => (
                    <div
                      key={opt.value}
                      onClick={() => handleDistanceOptionSelect(opt)}
                      className="px-3 py-1.5 hover:bg-gray-100 cursor-pointer text-xs text-gray-700"
                    >
                      {opt.label}
                    </div>
                  ))}
                </div>
              )}
              {/* Gray button removed */}
              <div className="w-62 bg-white shadow-xl md:w-36 px-2 py-2 rounded-lg">
                <div className="flex justify-between">
                  <p className="text-neutral-400 text-xs font-semibold">
                    0 miles
                  </p>
                  <p className="text-neutral-400 text-xs font-semibold">
                    10 miles
                  </p>
                </div>
                <div>
                  <div className="">
                    <input
                      type="range"
                      id="distance"
                      className="w-full accent-primary"
                      min="0"
                      max="10"
                      value={filter.distance}
                      onChange={handleRangeChange}
                    />
                    <span className="text-neutral-400 text-xs">
                      within <strong>{filter.distance} miles</strong>
                    </span>
                    <div className="flex justify-end">
                      <button
                        onClick={() => {
                          console.log(
                            "Distance apply clicked for range:",
                            filter.distance
                          );
                        }}
                        className="text-primary text-xs font-semibold hover:text-green-950 cursor-pointer active:text-green-800"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Size Filter */}
            <div className="flex flex-col gap-2 relative">
              <button
                type="button"
                onClick={() => handleDropdownToggle("size")}
                className={`w-32 px-2 py-2 outline-2 outline-offset-[-1px] outline-primary bg-primary text-white rounded-[50px] inline-flex justify-center items-center gap-2 overflow-hidden cursor-pointer `}
              >
                <p className="text-nowrap text-xs">{sizeButtonLabel}</p>
                <div className="flex my-auto items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-chevron-down-icon lucide-chevron-down"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
              </button>
              {openDropdown === "size" && (
                <div className="absolute top-[20%] mt-1 w-40 bg-white shadow-xl rounded-lg z-20 border border-gray-200 py-1">
                  {sizeOptions.map((opt) => (
                    <div
                      key={opt.value}
                      onClick={() => handleSizeOptionSelect(opt)}
                      className="px-3 py-1.5 hover:bg-gray-100 cursor-pointer text-xs text-gray-700"
                    >
                      {opt.label}
                    </div>
                  ))}
                </div>
              )}
              {/* Size Range Slider */}
              <div className="bg-white shadow-xl w-62 md:w-36 px-2 py-2 rounded-lg">
                <DualRangeSlider
                  min={0}
                  max={5000}
                  step={10}
                  minValue={filter.size.min}
                  maxValue={filter.size.max}
                  onChange={handleSizeRangeChange}
                  formatLabel={(value) =>
                    `${value}${value === 5000 ? "+" : ""} sqm`
                  }
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => {
                      console.log("Size range apply clicked:", filter.size);
                    }}
                    className="text-primary text-xs font-semibold hover:text-green-950 cursor-pointer active:text-green-800"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>

            {/* Type Filter */}
            <div className="flex flex-col gap-2 relative">
              <button
                type="button"
                onClick={() => handleDropdownToggle("type")}
                className={`w-32 px-2 py-2 outline-2 outline-offset-[-1px] outline-primary bg-primary text-white rounded-[50px] inline-flex justify-center items-center gap-2 overflow-hidden cursor-pointer `}
              >
                <p className="text-nowrap text-xs">{typeButtonLabel}</p>
                <div className="flex my-auto items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-chevron-down-icon lucide-chevron-down"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
              </button>
              {openDropdown === "type" && (
                <div className="absolute top-[20%] mt-1 w-40 bg-white shadow-xl rounded-lg z-20 border border-gray-200 py-1">
                  {typeOptions.map((opt) => (
                    <div
                      key={opt.value}
                      onClick={() => handleTypeOptionSelect(opt)}
                      className="px-3 py-1.5 hover:bg-gray-100 cursor-pointer text-xs text-gray-700"
                    >
                      {opt.label}
                    </div>
                  ))}
                </div>
              )}
              {/* Gray button removed */}
              <div className="bg-white shadow-xl w-62 md:w-36 px-2 py-2 rounded-lg">
                <div>
                  <div className="">
                    {" "}
                    {/* Ensure className is used, was class previously */}
                    <div className="flex gap-1 font-semibold ">
                      <input
                        type="checkbox"
                        name="detachedHouse"
                        id="detachedHouse"
                        className="accent-primary"
                        checked={filter.type.detachedHouse}
                        onChange={() => handleCheckboxChange("detachedHouse")}
                      />
                      <label
                        htmlFor="detachedHouse"
                        className="text-sm text-neutral-400"
                      >
                        Detached House
                      </label>
                    </div>
                    <div className="flex gap-1 font-semibold">
                      <input
                        type="checkbox"
                        name="terracedHouse"
                        id="terracedHouse"
                        className="accent-primary"
                        checked={filter.type.terracedHouse}
                        onChange={() => handleCheckboxChange("terracedHouse")}
                      />
                      <label
                        htmlFor="terracedHouse"
                        className="text-sm text-neutral-400"
                      >
                        Terraced House
                      </label>
                    </div>
                    <div className="flex gap-1 font-semibold">
                      <input
                        type="checkbox"
                        name="parkHouse"
                        id="parkHouse"
                        className="accent-primary"
                        checked={filter.type.parkHouse}
                        onChange={() => handleCheckboxChange("parkHouse")}
                      />
                      <label
                        htmlFor="parkHouse"
                        className="text-sm text-neutral-400"
                      >
                        Park House
                      </label>
                    </div>
                    <div className="flex gap-1 font-semibold">
                      <input
                        type="checkbox"
                        name="flat"
                        id="flat"
                        className="accent-primary"
                        checked={filter.type.flat}
                        onChange={() => handleCheckboxChange("flat")}
                      />
                      <label
                        htmlFor="flat"
                        className="text-sm text-neutral-400"
                      >
                        Flat
                      </label>
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={() => {
                          console.log(
                            "Type apply clicked. Current types:",
                            filter.type
                          );
                        }}
                        className="text-primary text-xs font-semibold hover:text-green-950 cursor-pointer active:text-green-800"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="my-4">
            <ScatterPlot
              data={sampleData} // Ensure sampleData is correctly formatted for ScatterPlot
              highlightedPointId={"proj4"} // Example, adjust as needed
              yAxisLabel="Project Success"
              xAxisLabel="Frequency"
              // width="w-full" // ScatterPlot should handle its own width/height or accept props
              // height={256}  // ScatterPlot should handle its own width/height or accept props
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
