import React, { useState, useEffect, useCallback } from "react";
import SegmentedCircularGauge from "./SegmentedCircularGauge";
import ScatterPlot from "./scatter-plot";
import { useAuth } from "../../context/auth/AuthContext";
import SelectInput from "../select-input";
import Input from "../input";
import DualRangeSlider from "../dual-range-slider";
import {
  fetchNeighbourhoodBenchmarking,
  addUserAddress,
  fetchAddressesByPostcode,
} from "../../api/serices/api_utils";

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
    size: ["s", "m", "l", "xl", "xxl"], // Include all size codes by default
    type: {
      detachedHouse: true,
      terracedHouse: true,
      parkHouse: true,
      flat: true,
      SemiDetachedHouse: true,
      bungalow: true,
      maisonette: true,
      studioApartment: true,
    },
  });

  const { user, switchAddress, addAddress, currentAddress, setUser } =
    useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({});
  const [postCode, setPostCode] = useState("");
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [addressError, setAddressError] = useState("");

  const [openDropdown, setOpenDropdown] = useState(null); // 'distance', 'size', 'type'
  const [distanceButtonLabel, setDistanceButtonLabel] = useState("Distance");
  const [sizeButtonLabel, setSizeButtonLabel] = useState("0-200 sqm");
  const [typeButtonLabel, setTypeButtonLabel] = useState("All Types");

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
  const [addressNotFound, setAddressNotFound] = useState(false); // NEW: Track address not found

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
    if (t.includes("detached") || t.includes("house")) return "bungalow";
    if (t.includes("terrace") || t.includes("house")) return "bungalow";
    if (t.includes("semi-detached") || t.includes("house")) return "flat";
    if (t.includes("bungalow")) return "bungalow";
    if (t.includes("flat") || t.includes("apartment")) return "flat";
    if (t.includes("maisonette")) return "maisonette";
    if (
      t.includes("park home") ||
      t.includes("parkhouse") ||
      t.includes("park house")
    )
      return "park home";
    if (t.includes("house")) return "house";
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
      setAddressNotFound(false); // Reset on new fetch
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
      }
      // Don't automatically include user's property - only use selected filters
      sizeCategories = [...new Set(sizeCategories)].filter(
        (s) => s && s !== "unknown"
      );
      // Multi-type support
      const selectedTypes = Object.entries(filterToUse.type)
        .filter(([_, v]) => v)
        .map(([k]) => k);
      let typeCategories =
        selectedTypes.length > 0
          ? selectedTypes.map((key) => mapTypeToCategory({ [key]: true }))
          : [];
      // Don't automatically include user's property type - only use selected filters
      typeCategories = [...new Set(typeCategories)].filter(
        (t) => t && t !== "propertyType"
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
      // Remove the check for typeCategories.length === 0
      if (sizeCategories.length === 0) {
        setBenchmarkingError("Please select at least one size category.");
        setBenchmarkingLoading(false);
        setBenchmarkingData([]);
        return;
      }
      try {
        // Only use selected filters, don't include user's property automatically
        const res = await fetchNeighbourhoodBenchmarking({
          postcode,
          "floor-area": sizeCategories,
          "property-type": typeCategories,
        });
        if (res.success) {
          setBenchmarkingData(res.data);
          // Reset error states on successful response
          setAddressNotFound(false);
          setBenchmarkingError(null);
          // If we got a successful response but no data, it's likely a filter issue
          if (!res.data || (Array.isArray(res.data) && res.data.length === 0)) {
            setBenchmarkingError("No data. Please review selected filters");
          }
        } else if (
          res.status === 404 ||
          res.message?.toLowerCase().includes("not found")
        ) {
          setBenchmarkingData([]);
          // Only set addressNotFound if it's clearly an address/postcode issue
          // Be conservative - most 404s for this API are likely filter-related
          setAddressNotFound(false);
          setBenchmarkingError("No data. Please review selected filters");
        } else {
          setBenchmarkingData([]);
          setBenchmarkingError(res.message || "No data found");
        }
      } catch (err) {
        if (
          err?.response?.status === 404 ||
          err?.message?.toLowerCase().includes("not found")
        ) {
          setBenchmarkingData([]);
          // Only set addressNotFound if it's clearly an address/postcode issue
          // Be conservative - most 404s for this API are likely filter-related
          setAddressNotFound(false);
          setBenchmarkingError("No data. Please review selected filters");
        } else {
          setBenchmarkingData([]);
          setBenchmarkingError(err.message || "Error fetching data");
        }
      } finally {
        setBenchmarkingLoading(false);
      }
    },
    [filter, currentAddress, propertyData]
  );

  useEffect(() => {
    fetchDashboardData();
  }, [currentAddress]);

  // Call fetchDashboardData when filters change
  useEffect(() => {
    if (
      propertyData &&
      (filter.size.length > 0 || Object.values(filter.type).some(Boolean))
    ) {
      fetchDashboardData();
    }
  }, [filter, propertyData]);

  // --- Call benchmarking API with propertyData on first load ---
  // NOTE: Removed automatic initial call - now handled through filter changes
  // This ensures that when filters are changed, only matching data is shown (no auto-inclusion of user property)
  /*
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
      // Only one attempt, no retry if 404 or addressNotFound
      let did404 = false;
      const fetchOnce = async () => {
        try {
          setBenchmarkingLoading(true);
          setBenchmarkingError(null);
          setAddressNotFound(false); // Reset on new fetch
          const res = await fetchNeighbourhoodBenchmarking({
            postcode,
            "floor-area": sizeCategory,
            "property-type": typeCategory,
          });
          if (res.success) {
            setBenchmarkingData(res.data);
          } else if (
            res.status === 404 ||
            res.message?.toLowerCase().includes("not found")
          ) {
            setBenchmarkingData([]);
            setAddressNotFound(true);
            setBenchmarkingError(null);
            did404 = true;
          } else {
            setBenchmarkingData([]);
            setBenchmarkingError(res.message || "No data found");
          }
        } catch (err) {
          if (
            err?.response?.status === 404 ||
            err?.message?.toLowerCase().includes("not found")
          ) {
            setBenchmarkingData([]);
            setAddressNotFound(true);
            setBenchmarkingError(null);
            did404 = true;
          } else {
            setBenchmarkingData([]);
            setBenchmarkingError(err.message || "Error fetching data");
          }
        } finally {
          setBenchmarkingLoading(false);
        }
      };
      if (!did404) fetchOnce();
    }
  }, [propertyData]);
  */

  // Handle adding a new address
  // const handleAddAddress = async () => {
  //   if (!newAddress.address || !newAddress.postcode) return;
  //   setIsSubmitting(true);
  //   try {
  //     // Call the backend API to add the address
  //     const response = await addUserAddress({
  //       address: newAddress.address,
  //       postcode: newAddress.postcode,
  //     });
  //     if (response && response.success && response.user) {
  //       // Update user context and localStorage
  //       setUser(response.user);
  //       localStorage.setItem("user", JSON.stringify(response.user));
  //     } else if (response && response.success && response.addresses) {
  //       // Fallback: update addresses array if returned
  //       const updatedUser = { ...user, addresses: response.addresses };
  //       setUser(updatedUser);
  //       localStorage.setItem("user", JSON.stringify(updatedUser));
  //     } else {
  //       // Fallback: manually add to user context and localStorage
  //       const updatedAddresses = [
  //         ...(user.addresses || []),
  //         {
  //           address: newAddress.address,
  //           postcode: newAddress.postcode,
  //           id: `addr-${Date.now()}`,
  //         },
  //       ];
  //       const updatedUser = { ...user, addresses: updatedAddresses };
  //       setUser(updatedUser);
  //       localStorage.setItem("user", JSON.stringify(updatedUser));
  //     }
  //     setNewAddress({});
  //     setSelectedAddress(null);
  //     setAddressSuggestions([]);
  //     setShowAddForm(false);
  //   } catch (error) {
  //     console.error("Error adding address:", error);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  // Address options for Pro users
  const getAddressOptions = () => {
    if (!user || !user.addresses) return [];

    return user.addresses.map((addr) => ({
      value: addr.id,
      label: `${addr.id === "addr1" ? "Primary" : "Secondary"}: ${
        addr.address
      }, ${addr.postcode}`,
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
    // On apply, ensure filter.size matches the current slider range
    const covered = getSizeCategoriesFromRange(sizeRange.min, sizeRange.max);
    setFilter((prev) => ({ ...prev, size: covered }));
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

    // If "House" is selected, check all house-related checkboxes
    if (option.value === "house") {
      setFilter((prevFilter) => ({
        ...prevFilter,
        type: {
          ...Object.fromEntries(
            Object.keys(prevFilter.type).map((k) => [k, false])
          ), // Reset all to false first
          detachedHouse: true,
          terracedHouse: true,
          SemiDetachedHouse: true,
        },
      }));
    } else if (option.value === "parkHome") {
      // Handle Park Home selection - map to parkHouse in filter state
      setFilter((prevFilter) => ({
        ...prevFilter,
        type: Object.fromEntries(
          Object.keys(prevFilter.type).map((k) => [k, k === "parkHouse"])
        ),
      }));
    } else {
      // For other options, set only that specific type
      setFilter((prevFilter) => ({
        ...prevFilter,
        type: Object.fromEntries(
          Object.keys(prevFilter.type).map((k) => [k, k === option.value])
        ),
      }));
    }
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
      case "house":
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

      // Define house-related types
      const houseTypes = [
        "detachedHouse",
        "terracedHouse",
        "SemiDetachedHouse",
      ];
      const selectedHouseTypes = trueTypes.filter((type) =>
        houseTypes.includes(type)
      );

      if (trueTypes.length === 0) {
        setTypeButtonLabel("Any Type");
      } else if (trueTypes.length === 1) {
        // Special handling for parkHouse -> Park Home mapping
        if (trueTypes[0] === "parkHouse") {
          setTypeButtonLabel("Park Home");
        } else {
          const selectedTypeOption = typeOptions.find(
            (opt) => opt.value === trueTypes[0]
          );
          setTypeButtonLabel(
            selectedTypeOption ? selectedTypeOption.label : "Type"
          );
        }
      } else if (
        selectedHouseTypes.length === houseTypes.length &&
        trueTypes.length === houseTypes.length
      ) {
        // All house types are selected and nothing else
        setTypeButtonLabel("House");
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
    setSizeRange({ min, max });
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

  // --- Add Address Handler ---
  const handleAddAddress = async () => {
    const finalAddress = selectedAddress || newAddress.address;
    if (!finalAddress || !newAddress.postcode) return;
    setIsSubmitting(true);
    try {
      // Check for duplicate in current addresses (case-insensitive, trimmed)
      const exists = (user.addresses || []).some(
        (a) =>
          a.address.trim().toLowerCase() ===
            finalAddress.trim().toLowerCase() &&
          a.postcode.trim().toLowerCase() ===
            newAddress.postcode.trim().toLowerCase()
      );
      if (exists) {
        setAddAddressError("This address already exists in your portfolio.");
        setIsSubmitting(false);
        return;
      }
      setAddAddressError("");
      // Call backend API to add address
      const response = await addUserAddress({
        address: finalAddress,
        postcode: newAddress.postcode,
        userId: user.id,
      });
      if (response && response.success && response.addresses) {
        // Update user context and localStorage with new addresses
        const updatedUser = { ...user, addresses: response.addresses };
        console.log(updatedUser);

        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setNewAddress({});
        setSelectedAddress(null);
        setAddressSuggestions([]);
        setShowAddForm(false);
        setAddAddressError("");
      } else if (response && response.status === 409) {
        setAddAddressError(response.message || "Address already exists.");
      } else if (response && response.message) {
        setAddAddressError(response.message);
      } else {
        setAddAddressError("Failed to add address. Please try again.");
      }
    } catch (error) {
      setAddAddressError(
        error?.response?.data?.message ||
          error.message ||
          "Error adding address."
      );
      console.error("Error adding address:", error);
    } finally {
      setIsSubmitting(false);
    }
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
      setAddressSuggestions([]);
      setSelectedAddress(null);
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

  // Handler for address selection from lookup
  const handleAddressSelection = (e) => {
    setSelectedAddress(e.target.value);
    setAddressError("");
    setAddAddressError("");
  };

  // Add state for add address error
  const [addAddressError, setAddAddressError] = useState("");

  // Add state to track the slider's min/max - default to full range
  const [sizeRange, setSizeRange] = useState({ min: 0, max: 200 });

  // Set initial filter to show all property types and all sizes on propertyData load
  useEffect(() => {
    if (propertyData && propertyData.area_sqm) {
      // Set all size categories by default (show all sizes from 0 to 200 sqm)
      const allSizeCodes = SIZE_CATEGORIES.map((cat) => cat.code);

      setFilter((prev) => ({
        ...prev,
        size: allSizeCodes,
        // Set all property types to true by default
        type: {
          detachedHouse: true,
          terracedHouse: true,
          parkHouse: true,
          flat: true,
          SemiDetachedHouse: true,
          bungalow: true,
          maisonette: true,
          studioApartment: true,
        },
      }));

      // Set slider to show the full range (0-200 sqm)
      setSizeRange({ min: 0, max: 200 });
      setSizeButtonLabel("0-200 sqm");

      // Set type button label to show all types are selected
      setTypeButtonLabel("All Types");
    }
  }, [propertyData]);

  return (
    <div className="flex flex-col  md:w-[45vw] px-4 pt-8 pb-5 bg-white  shadow-[0px_10px_20px_0px_rgba(0,0,0,0.20)] rounded-3xl ">
      {/* Property Info */}
      <div className="flex flex-col xl:flex-row justify-between">
        <div className="md:w-[100%] xl:w-[45%] flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-base text-primary font-semibold">
              Your Property
            </h2>
            {/* DEBUG: Show user and plan info for troubleshooting Pro features
            <pre className="text-xs text-gray-400 bg-gray-100 rounded px-2 py-1 max-w-xs overflow-x-auto">
              {JSON.stringify(user)}
            </pre> */}
            {user &&
              user.plan &&
              user.plan.toLowerCase() === "pro" &&
              user.addresses && (
                <button
                  onClick={() => {
                    setShowAddForm(!showAddForm);
                    setNewAddress({});
                    setSelectedAddress(null);
                    setAddressSuggestions([]);
                  }}
                  className="ml-auto text-primary hover:text-green-800 text-sm cursor-pointer"
                  title="Add a new address"
                >
                  <span className="flex">
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
            user.plan &&
            user.plan.toLowerCase() === "pro" &&
            user.addresses &&
            user.addresses.length > 1 && (
              <div className="mb-3">
                <SelectInput
                  label="Select Address"
                  options={user.addresses.map((addr, idx) => ({
                    value: addr.id,
                    label:
                      `${addr.address || addr.street || ""}, ${
                        addr.postcode || addr.zip || ""
                      }` + (idx === 0 ? " (Primary)" : " (Secondary)"),
                  }))}
                  value={currentAddress?.id || ""}
                  onChange={(e) => switchAddress(e.target.value)}
                  name="propertyAddress"
                  className="text-sm"
                  size="small"
                  searchEnabled={false}
                  disabled={false}
                  readOnly={true}
                />
              </div>
            )}

          {/* Inline add address form with search functionality */}
          {showAddForm && (
            <div className="mb-3 p-2 bg-gray-50 rounded-md border border-gray-200">
              <div className="flex flex-col gap-2 mb-2">
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
                  size="small"
                  className="text-sm"
                />

                {/* Address Selection */}
                {newAddress.postcode && (
                  <div className="relative">
                    {isLoadingAddresses ? (
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                        <span className="text-xs text-blue-700">
                          Finding addresses for {newAddress.postcode}...
                        </span>
                      </div>
                    ) : addressSuggestions.length > 0 ? (
                      <SelectInput
                        name="selectedAddress"
                        label="Select Your Address"
                        options={addressSuggestions}
                        value={selectedAddress}
                        onChange={handleAddressSelection}
                        placeholder="Choose your address from the list"
                        searchEnabled={true}
                        required
                        fullWidth
                        helperText={`${addressSuggestions.length} address${
                          addressSuggestions.length === 1 ? "" : "es"
                        } found. Start typing to search.`}
                        size="small"
                        className="text-sm"
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
                          onChange={(e) => {
                            setNewAddress((prev) => ({
                              ...prev,
                              address: e.target.value,
                            }));
                            setAddAddressError("");
                          }}
                          placeholder="Enter your full street address manually"
                          minLength="10"
                          title="Please enter your complete street address"
                          required
                          helperText="Please enter your full address including house number and street name."
                          size="small"
                          className="text-sm"
                        />
                      </div>
                    ) : newAddress.postcode.includes(" ") &&
                      newAddress.postcode.length >= 6 ? (
                      <Input
                        label="Street Address"
                        name="address"
                        value={newAddress.address || ""}
                        onChange={(e) => {
                          setNewAddress((prev) => ({
                            ...prev,
                            address: e.target.value,
                          }));
                          setAddAddressError("");
                        }}
                        placeholder="Enter your full street address"
                        minLength="10"
                        title="Please enter your complete street address"
                        required
                        helperText="Please enter your full address including house number and street name."
                        size="small"
                        className="text-sm"
                      />
                    ) : (
                      <div className="p-2 bg-gray-50 border border-gray-200 rounded-lg">
                        <p className="text-xs text-gray-600">
                          Complete your postcode above to automatically find
                          your address.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {addAddressError && (
                  <div className="text-xs text-red-600 mt-1">
                    {addAddressError}
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewAddress({});
                    setSelectedAddress(null);
                    setAddressSuggestions([]);
                    setAddAddressError("");
                    setAddressError("");
                  }}
                  className="px-2 py-1 text-xs text-gray-600 hover:text-gray-800"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddAddress}
                  className="px-2 py-1 text-xs bg-primary text-white rounded cursor-pointer"
                  disabled={
                    isSubmitting ||
                    (!selectedAddress && !newAddress.address) ||
                    !newAddress.postcode
                  }
                >
                  {isSubmitting ? "Adding..." : "Add"}
                </button>
              </div>
            </div>
          )}

          {/* Show error if propertyData is not found or has a 404 error, OR if addressNotFound is set */}
          {propertyData &&
          !propertyData.notFound &&
          propertyData.status !== 404 &&
          propertyData.error !== "not_found" &&
          !addressNotFound ? (
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
          ) : null}
          {/* Show error only after API response, not before */}
          {((propertyData &&
            (propertyData.notFound ||
              propertyData.status === 404 ||
              propertyData.error === "not_found")) ||
            addressNotFound) && (
            <div className="flex flex-col items-center justify-center min-h-[120px]">
              <div className="text-red-600 text-sm font-semibold text-center mb-2">
                Address not found. Please check the address or select another
                from your portfolio.
              </div>
              {/* Placeholder property info */}
              <div className="flex gap-2 mt-2">
                <div className="flex flex-col gap-10">
                  {user && user.plan === "Pro" ? (
                    ""
                  ) : (
                    <p className="text-neutral-400 text-sm font-semibold">
                      Address:
                    </p>
                  )}
                  <p className="text-neutral-400 text-sm font-semibold">
                    Type:
                  </p>
                  <p className="text-neutral-400 text-sm font-semibold">
                    Area:{" "}
                  </p>
                </div>
                <div className="flex flex-col gap-5 w-48">
                  {user && user.plan === "Pro" ? (
                    ""
                  ) : (
                    <p className="text-neutral-400 text-sm font-semibold h-10">
                      abc street, xyz
                    </p>
                  )}
                  <p className="text-neutral-400 text-sm font-semibold h-10">
                    Unknown
                  </p>
                  <p className="text-neutral-400 text-sm font-semibold h-10">
                    X sqm
                  </p>
                </div>
              </div>
            </div>
          )}
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
          <div className="flex flex-col sm:flex-row gap-8 sm:gap-12 items-center justify-center w-full">
            {/* Distance Filter - COMMENTED OUT */}
            {/* <div className="flex flex-col gap-2 relative w-full max-w-[320px] sm:max-w-[220px] lg:max-w-none">
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
              <div className="w-full sm:w-[220px] lg:w-56 bg-white shadow-xl px-3 py-2 rounded-lg">
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
            </div> */}

            {/* Size Filter */}
            <div className="flex flex-col gap-2 relative w-full max-w-[320px] sm:max-w-[220px] lg:max-w-none">
              <button
                type="button"
                onClick={() => handleDropdownToggle("size")}
                className="w-full sm:w-44 px-3 py-2 outline-2 outline-offset-[-1px] outline-primary bg-primary text-white rounded-[50px] inline-flex justify-center items-center gap-2 overflow-hidden cursor-pointer"
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
                <div className="absolute top-[25%] left-1/2 transform -translate-x-1/2 w-full sm:w-48 bg-white shadow-xl rounded-lg z-20 border border-gray-200 py-1">
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
              <div className="w-full sm:w-[220px] lg:w-56 bg-white shadow-xl px-4 py-3 rounded-lg">
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
                      minValue={sizeRange.min}
                      maxValue={sizeRange.max}
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
                  {/* <div className="flex justify-end mt-2">
                    <button
                      onClick={handleSizeApply}
                      className="text-primary text-xs font-semibold hover:text-green-950 cursor-pointer active:text-green-800"
                    >
                      Apply
                    </button>
                  </div> */}
                </div>
              </div>
            </div>

            {/* Type Filter */}
            <div className="flex flex-col gap-2 relative w-full max-w-[320px] sm:max-w-[220px] lg:max-w-none">
              <button
                type="button"
                onClick={() => handleDropdownToggle("type")}
                className="w-full sm:w-44 px-3 py-2 outline-2 outline-offset-[-1px] outline-primary bg-primary text-white rounded-[50px] inline-flex justify-center items-center gap-2 overflow-hidden cursor-pointer"
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
                <div className="absolute top-[25%] left-1/2 transform -translate-x-1/2 w-full sm:w-48 bg-white shadow-xl rounded-lg z-20 border border-gray-200 py-1">
                  {typeOptions
                    .filter((opt) => opt.value !== "propertyType")
                    .map((opt) => (
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
              <div className="w-full sm:w-[220px] lg:w-56 bg-white shadow-xl px-4 py-3 rounded-lg">
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
                          House
                        </label>
                      </div>
                      {/* <div className="flex gap-1 items-center">
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
                      </div> */}
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
                          Park Home
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
                      {/* <div className="flex gap-1 items-center">
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
                      </div> */}
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
                      {/* <div className="flex gap-1 items-center">
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
                          House
                        </label>
                      </div> */}
                    </div>
                  </div>
                  {/* <div className="flex justify-end mt-2">
                    <button
                      onClick={handleTypeApply}
                      className="text-primary text-xs font-semibold hover:text-green-950 cursor-pointer active:text-green-800"
                    >
                      Apply
                    </button>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
          <div className="my-4">
            {(benchmarkingLoading ||
              benchmarkingError ||
              addressNotFound ||
              (Array.isArray(benchmarkingData) &&
                benchmarkingData.length === 0)) && (
              <div className="text-center text-neutral-400 text-sm py-2">
                {benchmarkingLoading ? (
                  "Loading benchmarking data..."
                ) : addressNotFound ? (
                  <span className="text-red-600 font-semibold block mb-2">
                    Address not found. Please check the address or postcode.
                  </span>
                ) : benchmarkingError ? (
                  benchmarkingError
                ) : (
                  "No data. Please review selected filters"
                )}
                {/* No placeholder recommendations when no data */}
              </div>
            )}
            <ScatterPlot
              data={addressNotFound ? [] : benchmarkingData}
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
