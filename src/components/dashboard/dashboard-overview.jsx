import React, { useState, useEffect, useCallback } from "react";
import SegmentedCircularGauge from "./SegmentedCircularGauge";
import ScatterPlot from "./scatter-plot";
import { useAuth } from "../../context/auth/AuthContext";
import SelectInput from "../select-input";
import Input from "../input";
import DualRangeSlider from "../dual-range-slider";
import { fetchNeighbourhoodBenchmarking } from "../../api/serices/api_utils";

// Dummy data for scatter plot
const scatterData = Array.from({ length: 50 }, () => ({
  x: Math.random() * 20,
  y: Math.random() * 250,
}));

// --- SIZE CATEGORY MAPPING ---
const SIZE_CATEGORIES = [
  { label: "1-55m²", code: "s", min: 1, max: 55 },
  { label: "55-70m²", code: "m", min: 56, max: 70 },
  { label: "70-85m²", code: "l", min: 71, max: 85 },
  { label: "85-110m²", code: "xl", min: 86, max: 110 },
  { label: "110m²+", code: "xxl", min: 111, max: 200 },
];

function getSizeCategoriesFromRange(min, max) {
  // Return all size codes that overlap with the selected range
  return SIZE_CATEGORIES.filter((cat) => max >= cat.min && min <= cat.max).map(
    (cat) => cat.code
  );
}

const DashboardCard = ({ propertyData, energyData }) => {
  const [filter, setFilter] = useState({
    distance: "2",
    size: [], // Now an array of selected size codes
    type: {
      detachedHouse: false,
      terracedHouse: false,
      parkHouse: false,
      flat: false,
      SemiDetachedHouse: false,
      bungalow: false,
      maisonette: false,
      studioApartment: false,
    },
  });

  const { user, switchAddress, addAddress, currentAddress } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  const [postCode, setPostCode] = useState("");
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
    if (currentAddress && propertyData) {
      setPropertyOverview({
        address: propertyData.address || "",
        type: propertyData.type || "", // We would fetch this from API in a real app
        area: propertyData.area_sqm || "", // We would fetch this from API in a real app
      });
    }
  }, [currentAddress, propertyData]);

  // Save lmkKey to localStorage when propertyData changes
  useEffect(() => {
    if (propertyData && propertyData.lmkKey) {
      localStorage.setItem("lmkKey", propertyData.lmkKey);
    }
  }, [propertyData]);

  // --- Neighbourhood Benchmarking Data State ---
  const [benchmarkingData, setBenchmarkingData] = useState([]);
  const [benchmarkingLoading, setBenchmarkingLoading] = useState(false);
  const [benchmarkingError, setBenchmarkingError] = useState(null);

  // --- SIZE CATEGORY MAPPING ---
  function mapSizeToCategory(min, max) {
    // Use only the max value for mapping
    if (max === 0) return "unknown";
    if (max <= 55) return "s";
    if (max <= 70) return "m";
    if (max <= 85) return "l";
    if (max <= 110) return "xl";
    if (max > 110) return "xxl";
    return "unknown";
  }

  // Helper to map a single area value to category
  function mapAreaToCategory(area) {
    if (!area || isNaN(area)) return "unknown";
    if (area >= 1 && area <= 55) return "s";
    if (area > 55 && area <= 70) return "m";
    if (area > 70 && area <= 85) return "l";
    if (area > 85 && area <= 110) return "xl";
    if (area > 110) return "xxl";
    return "unknown";
  }

  // --- Property Type Normalization ---
  function normalizePropertyType(type) {
    if (!type || typeof type !== "string") return "";
    const t = type.toLowerCase();
    if (t.includes("bungalow")) return "bungalow";
    if (t.includes("flat") || t.includes("apartment")) return "flat";
    if (t.includes("maisonette")) return "maisonette";
    if (
      t.includes("park home") ||
      t.includes("parkhouse") ||
      t.includes("park house")
    )
      return "parkHouse";
    if (t.includes("detached")) return "detachedHouse";
    if (t.includes("terrace")) return "terracedHouse";
    if (t.includes("semi-detached")) return "SemiDetachedHouse";
    if (t.includes("house")) return "detachedHouse";
    return "";
  }

  // --- Helper to extract postcode from address string ---
  function extractPostcode(address) {
    if (!address || typeof address !== "string") return "";
    // UK postcode regex (simple version)
    const postcodeRegex = /([A-Z]{1,2}\d{1,2}[A-Z]? ?\d[A-Z]{2})$/i;
    const match = address.match(postcodeRegex);
    return match ? match[1].toUpperCase() : "";
  }

  // --- Fetch Neighbourhood Benchmarking Data ---
  const fetchDashboardData = useCallback(
    async (customFilter) => {
      setBenchmarkingLoading(true);
      setBenchmarkingError(null);
      const filterToUse = customFilter || filter;
      // If size is an object (from range), calculate covered categories
      let sizeCategories = [];
      if (
        typeof filterToUse.size === "object" &&
        filterToUse.size.min !== undefined &&
        filterToUse.size.max !== undefined
      ) {
        sizeCategories = getSizeCategoriesFromRange(
          filterToUse.size.min,
          filterToUse.size.max
        );
      } else if (
        Array.isArray(filterToUse.size) &&
        filterToUse.size.length > 0
      ) {
        sizeCategories = filterToUse.size;
      } else if (propertyData && propertyData.area_sqm) {
        sizeCategories = [mapAreaToCategory(Number(propertyData.area_sqm))];
      }
      // Multi-type support
      const selectedTypes = Object.entries(filterToUse.type)
        .filter(([_, v]) => v)
        .map(([k]) => k);
      let typeCategories =
        selectedTypes.length > 0
          ? selectedTypes.map((key) => mapTypeToCategory({ [key]: true }))
          : propertyData && propertyData.type
          ? [normalizePropertyType(propertyData.type)]
          : [];
      // Remove duplicates and 'propertyType'
      typeCategories = [...new Set(typeCategories)].filter(
        (t) => t && t !== "propertyType"
      );
      sizeCategories = [...new Set(sizeCategories)].filter(
        (s) => s && s !== "unknown"
      );
      let postcode =
        currentAddress?.zip ||
        propertyData?.zip ||
        propertyData?.postcode ||
        extractPostcode(propertyData?.address) ||
        "";
      if (!postcode) {
        setBenchmarkingError("Postcode is required");
        setBenchmarkingLoading(false);
        setBenchmarkingData([]);
        return;
      }
      if (typeCategories.length === 0) {
        setBenchmarkingError("Please select at least one property type.");
        setBenchmarkingLoading(false);
        setBenchmarkingData([]);
        return;
      }
      if (sizeCategories.length === 0) {
        setBenchmarkingError("Please select at least one size category.");
        setBenchmarkingLoading(false);
        setBenchmarkingData([]);
        return;
      }
      try {
        // Always include user's property size/type in the API request
        const res = await fetchNeighbourhoodBenchmarking({
          postcode,
          "floor-area": sizeCategories,
          "property-type": typeCategories,
          userFloorArea:
            propertyData && propertyData.area_sqm
              ? mapAreaToCategory(Number(propertyData.area_sqm))
              : undefined,
          userPropertyType:
            propertyData && propertyData.type
              ? normalizePropertyType(propertyData.type)
              : undefined,
        });
        if (res.success) {
          setBenchmarkingData(res.data);
        } else {
          setBenchmarkingData([]);
          setBenchmarkingError(res.message || "No data found");
        }
      } catch (err) {
        setBenchmarkingData([]);
        setBenchmarkingError(err.message || "Error fetching data");
      } finally {
        setBenchmarkingLoading(false);
      }
    },
    [filter, currentAddress, propertyData]
  );

  useEffect(() => {
    fetchDashboardData();
  }, [currentAddress]);

  // --- Call benchmarking API with propertyData on first load ---
  useEffect(() => {
    // Only run if propertyData is available and has type and area_sqm (allow area_sqm = 0)
    if (
      propertyData &&
      typeof propertyData.type === "string" &&
      propertyData.type.trim() !== "" &&
      propertyData.area_sqm !== undefined &&
      propertyData.area_sqm !== null &&
      propertyData.area_sqm !== "" &&
      (propertyData.zip ||
        propertyData.postcode ||
        extractPostcode(propertyData.address))
    ) {
      const postcode =
        propertyData.zip ||
        propertyData.postcode ||
        extractPostcode(propertyData.address);
      const sizeCategory = mapAreaToCategory(Number(propertyData.area_sqm));
      const normalizedType = normalizePropertyType(propertyData.type);
      const typeCategory = normalizedType
        ? mapTypeToCategory({ [normalizedType]: true })
        : "propertyType";

      if (sizeCategory === "unknown" || typeCategory === "propertyType") {
        console.warn(
          "[Neighbourhood Benchmarking] Skipping API call due to unmapped size/type",
          { sizeCategory, typeCategory }
        );
        return;
      }
      let attempts = 0;
      const maxAttempts = 3;
      const fetchWithRetry = async () => {
        try {
          setBenchmarkingLoading(true);
          setBenchmarkingError(null);
          const res = await fetchNeighbourhoodBenchmarking({
            postcode,
            "floor-area": sizeCategory,
            "property-type": typeCategory,
          });
          if (res.success) {
            setBenchmarkingData(res.data);
          } else {
            setBenchmarkingData([]);
            setBenchmarkingError(res.message || "No data found");
          }
        } catch (err) {
          if (attempts < maxAttempts - 1) {
            attempts++;
            setTimeout(fetchWithRetry, 1000);
          } else {
            setBenchmarkingData([]);
            setBenchmarkingError(err.message || "Error fetching data");
          }
        } finally {
          setBenchmarkingLoading(false);
        }
      };
      fetchWithRetry();
    }
  }, [propertyData]);

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

  // --- SIZE FILTER LOGIC ---
  const handleSizeCheckboxChange = (sizeCode) => {
    setFilter((prev) => {
      const sizeArr = prev.size.includes(sizeCode)
        ? prev.size.filter((c) => c !== sizeCode)
        : [...prev.size, sizeCode];
      return { ...prev, size: sizeArr };
    });
  };

  const handleSizeApply = () => {
    fetchDashboardData();
  };

  // --- TYPE FILTER LOGIC ---
  const typeOptions = [
    { label: "Property Type", value: "propertyType" },
    { label: "Bungalow", value: "bungalow" },
    { label: "Flat", value: "flat" },
    { label: "House", value: "house" },
    { label: "Maisonette", value: "maisonette" },
    { label: "Park Home", value: "parkHome" },
  ];

  const handleTypeOptionSelect = (option) => {
    setTypeButtonLabel(option.label);
    setFilter((prevFilter) => ({
      ...prevFilter,
      type: option.value,
    }));
    setOpenDropdown(null);
  };

  // --- TYPE CATEGORY MAPPING ---
  function mapTypeToCategory(typeObj) {
    // If all false or all true, return "propertyType"
    const selected = Object.entries(typeObj).filter(([_, v]) => v);
    if (selected.length === 0) return "propertyType";
    if (selected.length > 1) return "propertyType"; // or handle as needed
    const key = selected[0][0];
    switch (key) {
      case "bungalow":
        return "bungalow";
      case "flat":
        return "flat";
      case "maisonette":
        return "maisonette";
      case "parkHouse":
        return "park home";
      case "detachedHouse":
      case "terracedHouse":
      case "SemiDetachedHouse":
        return "house";
      default:
        return "propertyType";
    }
  }

  const handleTypeApply = () => {
    fetchDashboardData();
  };

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
    // Calculate all covered size categories
    const covered = getSizeCategoriesFromRange(min, max);
    setFilter((prevFilter) => ({
      ...prevFilter,
      size: covered,
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
      // also , handle zip code logic postCode
      await addAddress(addressData);
      setNewAddress("");
      setPostCode("");

      setSelectedAddress(null);
      setAddressSuggestions([]);
      setShowAddForm(false);
    } catch (error) {
      console.error("Error adding address:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePostCodeChange = (e) => {
    setPostCode(e.target.value);
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
      <div className="flex flex-col xl:flex-row justify-between">
        <div className="md:w-[100%] xl:w-[45%] flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-base text-primary font-semibold">
              Your Property
            </h2>
            {/* {currentAddress && currentAddress.id && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {currentAddress.id === "addr1" ? "Primary" : "Secondary"}
              </span>
            )} */}
            {user && user.plan === "Pro" && user.addresses && (
              <button
                onClick={() => {
                  setShowAddForm(!showAddForm);
                  setNewAddress("");
                  setSelectedAddress(null);
                  setAddressSuggestions([]);
                }}
                className="ml-auto text-primary hover:text-green-800 text-sm"
                title="Add a new address"
              >
                <span className="flex ">
                  <p className="text-xs text-nowrap">Add to your portfolio</p>

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
                </span>
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
              <div className="flex flex-col gap-2 mb-2">
                <Input
                  label="Postcode"
                  onChange={handlePostCodeChange}
                  value={postCode}
                  size="small"
                  className="text-sm"
                />
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
                    setPostCode("");
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
              {user && user.plan === "Pro" ? (
                ""
              ) : (
                <p className="text-neutral-400 text-sm font-semibold">
                  Address:
                </p>
              )}
              <p className="text-neutral-400 text-sm font-semibold">Type:</p>
              <p className="text-neutral-400 text-sm font-semibold">Area: </p>
            </div>

            <div className="flex flex-col gap-5 w-48">
              {user && user.plan === "Pro" ? (
                ""
              ) : (
                <p className="text-neutral-400 text-sm font-semibold h-10">
                  {(propertyData && propertyData.address) ||
                    propertyOverview.address}
                </p>
              )}
              <p className="text-neutral-400 text-sm font-semibold h-10">
                {(propertyData && propertyData.type) || propertyOverview.type}
              </p>
              <p className="text-neutral-400 text-sm font-semibold h-10">
                {(propertyData && propertyData.area_sqm) ||
                  propertyOverview.area}{" "}
                sqm
              </p>
            </div>
          </div>
        </div>

        {/* Circular Progress Indicators */}
        <div className="flex flex-col sm:flex-row sm:items-start md:justify-around md:items-start sm:flex-wrap xl:flex-nowrap items-center gap-6 xl:gap-6 sm:justify-center xl:justify-end mt-6 md:mt-0 xl:mt-0">
          <div className="w-36 sm:mb-4 xl:mb-0">
            <p className="text-center mt-2  md:mt-0 font-medium">Current</p>
            <SegmentedCircularGauge
              value={energyData?.current_rating?.score || 75}
              grade={energyData?.current_rating?.band || "B"}
              size={142}
            />
          </div>
          <div className="w-36 sm:mb-4 xl:mb-0">
            <p className="text-center mt-2 md:mt-0 font-medium">Potential</p>
            <SegmentedCircularGauge
              value={energyData?.potential_rating?.score || 82}
              grade={energyData?.potential_rating?.band || "A"}
              size={142}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col mt-4">
        <h2 className="flex text-center justify-center md:justify-start text-base text-primary font-semibold">
          Neighbourhood benchmarking
        </h2>
        <div className="flex flex-col my-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 place-items-center sm:place-items-start w-full">
            {/* Distance Filter */}
            <div className="flex flex-col gap-2 relative w-full max-w-[280px] sm:max-w-[160px] lg:max-w-none">
              <button
                type="button"
                onClick={() => handleDropdownToggle("distance")}
                className="w-full sm:w-32 px-2 py-2 outline-2 outline-offset-[-1px] outline-primary bg-primary text-white rounded-[50px] inline-flex justify-center items-center gap-2 overflow-hidden cursor-pointer"
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
                <div className="absolute top-[25%] left-0 sm:left-auto w-full sm:w-40 bg-white shadow-xl rounded-lg z-20 border border-gray-200 py-1">
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
              <div className="w-full sm:w-[160px] lg:w-36 bg-white shadow-xl px-3 py-2 rounded-lg">
                <div className="flex justify-between">
                  <p className="text-neutral-400 text-xs font-semibold">
                    0 miles
                  </p>
                  <p className="text-neutral-400 text-xs font-semibold">
                    10 miles
                  </p>
                </div>
                <div className="flex-1 flex flex-col justify-between min-h-[80px]">
                  <div>
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
                  </div>
                  <div className="flex justify-end mt-2">
                    <button className="text-primary text-xs font-semibold hover:text-green-950 cursor-pointer active:text-green-800">
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Size Filter */}
            <div className="flex flex-col gap-2 relative w-full max-w-[280px] sm:max-w-[160px] lg:max-w-none">
              <button
                type="button"
                onClick={() => handleDropdownToggle("size")}
                className="w-full sm:w-32 px-2 py-2 outline-2 outline-offset-[-1px] outline-primary bg-primary text-white rounded-[50px] inline-flex justify-center items-center gap-2 overflow-hidden cursor-pointer"
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
                <div className="absolute top-[25%] left-0 sm:left-auto w-full sm:w-40 bg-white shadow-xl rounded-lg z-20 border border-gray-200 py-1">
                  {SIZE_CATEGORIES.map((opt) => (
                    <div
                      key={opt.code}
                      onClick={() => {
                        setFilter((prev) => ({
                          ...prev,
                          size: prev.size.includes(opt.code)
                            ? prev.size.filter((c) => c !== opt.code)
                            : [...prev.size, opt.code],
                        }));
                        setSizeButtonLabel(opt.label);
                        setOpenDropdown(null);
                      }}
                      className="px-3 py-1.5 hover:bg-gray-100 cursor-pointer text-xs text-gray-700"
                    >
                      {opt.label}
                    </div>
                  ))}
                </div>
              )}
              <div className="w-full sm:w-[160px] lg:w-36 bg-white shadow-xl px-3 py-2 rounded-lg">
                <div className="flex justify-between">
                  <p className="text-neutral-400 text-xs font-semibold">
                    0 sqm
                  </p>
                  <p className="text-neutral-400 text-xs font-semibold">
                    200 sqm
                  </p>
                </div>
                <div className="flex-1 flex flex-col justify-between min-h-[80px]">
                  <div>
                    <DualRangeSlider
                      min={0}
                      max={200}
                      step={1}
                      minValue={
                        typeof filter.size === "object" &&
                        filter.size.min !== undefined
                          ? filter.size.min
                          : 0
                      }
                      maxValue={
                        typeof filter.size === "object" &&
                        filter.size.max !== undefined
                          ? filter.size.max
                          : 200
                      }
                      onChange={handleSizeRangeChange}
                      formatLabel={(value) => {
                        if (value === 0) return "Unknown";
                        if (value >= 1 && value <= 55) return "1-55m²";
                        if (value > 55 && value <= 70) return "55-70m²";
                        if (value > 70 && value <= 85) return "70-85m²";
                        if (value > 85 && value <= 110) return "85-110m²";
                        if (value > 110) return "110m²+";
                        return `${value}m²`;
                      }}
                    />
                  </div>
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={handleSizeApply}
                      className="text-primary text-xs font-semibold hover:text-green-950 cursor-pointer active:text-green-800"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Type Filter */}
            <div className="flex flex-col gap-2 relative w-full max-w-[280px] sm:max-w-[160px] lg:max-w-none">
              <button
                type="button"
                onClick={() => handleDropdownToggle("type")}
                className="w-full sm:w-32 px-2 py-2 outline-2 outline-offset-[-1px] outline-primary bg-primary text-white rounded-[50px] inline-flex justify-center items-center gap-2 overflow-hidden cursor-pointer"
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
                <div className="absolute top-[25%] left-0 sm:left-auto w-full sm:w-40 bg-white shadow-xl rounded-lg z-20 border border-gray-200 py-1">
                  {typeOptions
                    .filter((opt) => opt.value !== "propertyType")
                    .map((opt) => (
                      <div
                        key={opt.value}
                        onClick={() => {
                          setFilter((prev) => ({
                            ...prev,
                            type: Object.fromEntries(
                              Object.keys(prev.type).map((k) => [
                                k,
                                k === opt.value,
                              ])
                            ),
                          }));
                          setTypeButtonLabel(opt.label);
                          setOpenDropdown(null);
                        }}
                        className="px-3 py-1.5 hover:bg-gray-100 cursor-pointer text-xs text-gray-700"
                      >
                        {opt.label}
                      </div>
                    ))}
                </div>
              )}
              <div className="w-full sm:w-[160px] lg:w-36 bg-white shadow-xl px-3 py-2 rounded-lg">
                <div className="flex-1 flex flex-col min-h-[80px]">
                  <div className="h-[70px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                    {/* Type checkboxes */}
                    <div className="space-y-2">
                      <div className="flex gap-1 items-center">
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
                          className="text-xs text-neutral-400"
                        >
                          Detached House
                        </label>
                      </div>
                      <div className="flex gap-1 items-center">
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
                          className="text-xs text-neutral-400"
                        >
                          Terraced House
                        </label>
                      </div>
                      <div className="flex gap-1 items-center">
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
                          className="text-xs text-neutral-400"
                        >
                          Park House
                        </label>
                      </div>
                      <div className="flex gap-1 items-center">
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
                          className="text-xs text-neutral-400"
                        >
                          Flat
                        </label>
                      </div>
                      <div className="flex gap-1 items-center">
                        <input
                          type="checkbox"
                          name="SemiDetachedHouse"
                          id="SemiDetachedHouse"
                          className="accent-primary"
                          checked={filter.type.SemiDetachedHouse}
                          onChange={() =>
                            handleCheckboxChange("SemiDetachedHouse")
                          }
                        />
                        <label
                          htmlFor="SemiDetachedHouse"
                          className="text-xs text-neutral-400"
                        >
                          Semi-Detached House
                        </label>
                      </div>
                      <div className="flex gap-1 items-center">
                        <input
                          type="checkbox"
                          name="bungalow"
                          id="bungalow"
                          className="accent-primary"
                          checked={filter.type.bungalow}
                          onChange={() => handleCheckboxChange("bungalow")}
                        />
                        <label
                          htmlFor="bungalow"
                          className="text-xs text-neutral-400"
                        >
                          Bungalow
                        </label>
                      </div>
                      <div className="flex gap-1 items-center">
                        <input
                          type="checkbox"
                          name="maisonette"
                          id="maisonette"
                          className="accent-primary"
                          checked={filter.type.maisonette}
                          onChange={() => handleCheckboxChange("maisonette")}
                        />
                        <label
                          htmlFor="maisonette"
                          className="text-xs text-neutral-400"
                        >
                          Maisonette
                        </label>
                      </div>
                      <div className="flex gap-1 items-center">
                        <input
                          type="checkbox"
                          name="studioApartment"
                          id="studioApartment"
                          className="accent-primary"
                          checked={filter.type.studioApartment}
                          onChange={() =>
                            handleCheckboxChange("studioApartment")
                          }
                        />
                        <label
                          htmlFor="studioApartment"
                          className="text-xs text-neutral-400"
                        >
                          Studio Apartment
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={handleTypeApply}
                      className="text-primary text-xs font-semibold hover:text-green-950 cursor-pointer active:text-green-800"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="my-4">
            {(benchmarkingLoading ||
              benchmarkingError ||
              (Array.isArray(benchmarkingData) &&
                benchmarkingData.length === 0)) && (
              <div className="text-center text-neutral-400 text-sm py-2">
                {benchmarkingLoading
                  ? "Loading benchmarking data..."
                  : benchmarkingError ||
                    "No data found with the current filters."}
              </div>
            )}
            <ScatterPlot
              data={benchmarkingData}
              yAxisLabel="Score"
              xAxisLabel="Area (sqm)"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
