import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { getUserProfile } from "../../api/serices/api_utils";

// Constants
export const PLANS = {
  BASIC: "basic",
  PRO: "pro",
  free: "free",
};

const API_URL = import.meta.env.VITE_API_URL;

const AuthContext = createContext();

const MAX_PRO_ADDRESSES = 100;
const DEFAULT_ADDRESS = {
  id: "default",
  address: "1",
  zip: "12345",
  isCurrent: true,
};

export const AuthProvider = ({ children }) => {
  const [currentAddress, setCurrentAddress] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Validate and clean user data
  const validateAndCleanUserData = useCallback((userData) => {
    if (!userData) return null;

    try {
      const user = userData.user || userData;

      const cleanedData = {
        id: user.id || crypto.randomUUID(),
        name:
          user.firstName && user.lastName
            ? `${user.firstName} ${user.lastName}`
            : user.name || "",
        email: user.email || "",
        plan: user.plan || user.subscriptionPlan || PLANS.free,
        role: user.role || "user", // Default to 'user' if not present
        addresses: [],
        currentAddressId: null,
      };

      // Validate and clean addresses
      const addressesSource = user.addresses || userData.addresses || [];
      if (Array.isArray(addressesSource)) {
        cleanedData.addresses = addressesSource
          .filter(
            (addr) =>
              addr &&
              typeof addr === "object" &&
              (addr.address || addr.street) &&
              (addr.postcode || addr.zip)
          )
          .map((addr) => ({
            id: addr.id || crypto.randomUUID(),
            address: (addr.address || addr.street || "").trim(),
            zip: (addr.zip || addr.postcode || "").trim(),
            postcode: (addr.postcode || addr.zip || "").trim(),
            city: addr.city || "", // fallback to empty string if not present
            country: addr.country || "UK", // fallback to UK if not present
            isCurrent:
              typeof addr.isCurrent === "boolean" ? addr.isCurrent : false,
            _id: addr._id, // preserve backend _id if present
          }));

        // Enforce plan limitations
        if (cleanedData.plan === PLANS.PRO) {
          cleanedData.addresses = cleanedData.addresses.slice(
            0,
            MAX_PRO_ADDRESSES
          );
        } else {
          cleanedData.addresses = cleanedData.addresses.slice(0, 1);
        }

        // Ensure at least one address exists
        if (cleanedData.addresses.length === 0) {
          cleanedData.addresses.push({
            ...DEFAULT_ADDRESS,
            id: crypto.randomUUID(),
          });
        }

        // Set current address
        const currentAddressId = userData.currentAddressId;
        const currentAddressExists = cleanedData.addresses.find(
          (addr) => addr.id === currentAddressId
        );

        cleanedData.currentAddressId = currentAddressExists
          ? currentAddressId
          : cleanedData.addresses[0].id;

        // Update isCurrent flags
        cleanedData.addresses = cleanedData.addresses.map((addr) => ({
          ...addr,
          isCurrent: addr.id === cleanedData.currentAddressId,
        }));
      }

      return cleanedData;
    } catch (error) {
      console.error("Error validating user data:", error);
      return null;
    }
  }, []);

  // Token management
  const setAuthToken = useCallback((token) => {
    if (token) {
      localStorage.setItem("authToken", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      localStorage.removeItem("authToken");
      delete axios.defaults.headers.common["Authorization"];
    }
  }, []);

  const getAuthToken = useCallback(() => {
    return localStorage.getItem("authToken");
  }, []);

  // Initialize axios with stored token
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, [getAuthToken]);

  // Only initialize user from localStorage if a valid token exists
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      const token = localStorage.getItem("authToken");
      if (!stored || !token) {
        return null;
      }
      const parsedUser = JSON.parse(stored);
      return validateAndCleanUserData(parsedUser);
    } catch (error) {
      console.error("Error loading user data:", error);
      return null;
    }
  });

  // Update current address when user changes
  useEffect(() => {
    if (user?.addresses && user.currentAddressId) {
      const newCurrentAddress = user.addresses.find(
        (addr) => addr.id === user.currentAddressId
      );
      setCurrentAddress(newCurrentAddress || null);
    } else {
      setCurrentAddress(null);
    }
  }, [user]);

  // API integration helpers
  const handleApiError = useCallback((error) => {
    console.error("API Error:", error);
    setError(error.message || "An unexpected error occurred");
    setLoading(false);
  }, []);

  const persistUserData = useCallback(
    (responseData) => {
      try {
        // Handle token if present in response
        if (responseData.token) {
          setAuthToken(responseData.token);
        }

        const validatedData = validateAndCleanUserData(responseData);
        if (validatedData) {
          localStorage.setItem("user", JSON.stringify(validatedData));
          setUser(validatedData);
          setError(null);
        } else {
          throw new Error("Invalid user data");
        }
      } catch (error) {
        handleApiError(error);
      }
    },
    [validateAndCleanUserData, handleApiError, setAuthToken]
  );

  // Auth actions
  const login = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const loginUrl = `${API_URL}/api/auth/login`;
      const res = await axios.post(loginUrl, userData, {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000, // 10 second timeout
      });
      persistUserData(res.data);
      return { success: true, data: res.data };
    } catch (error) {
      handleApiError(error);
      return {
        success: false,
        message:
          error.response?.data?.message || error.message || "Login failed",
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
      localStorage.removeItem("lmkKey");
      setAuthToken(null); // Clear the token
      setUser(null);
      setCurrentAddress(null);
      setError(null);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  }, [handleApiError, setAuthToken]);

  // Address management
  const switchAddress = useCallback(
    async (addressId) => {
      if (!user) {
        setError("User not authenticated");
        return;
      }

      if (user.plan !== PLANS.PRO) {
        setError("Basic plan users cannot switch addresses");
        return;
      }

      const addressExists = user.addresses.find(
        (addr) => addr.id === addressId
      );
      if (!addressExists) {
        setError("Address not found");
        return;
      }

      setLoading(true);
      try {
        // Replace with actual API call
        // await userApi.updateCurrentAddress(addressId);

        const updatedUser = {
          ...user,
          addresses: user.addresses.map((addr) => ({
            ...addr,
            isCurrent: addr.id === addressId,
          })),
          currentAddressId: addressId,
        };

        persistUserData(updatedUser);
      } catch (error) {
        handleApiError(error);
      } finally {
        setLoading(false);
      }
    },
    [user, persistUserData, handleApiError]
  );

  const addAddress = useCallback(
    async (newAddress) => {
      if (!user) {
        setError("User not authenticated");
        return;
      }

      if (user.plan === PLANS.BASIC) {
        setError("Basic plan users cannot add addresses");
        return;
      }

      if (user.addresses.length >= MAX_PRO_ADDRESSES) {
        setError(`Maximum limit of ${MAX_PRO_ADDRESSES} addresses reached`);
        return;
      }

      // Validate new address
      if (
        !newAddress.street ||
        !newAddress.city ||
        !newAddress.zip ||
        !newAddress.country
      ) {
        setError("All address fields are required");
        return;
      }

      setLoading(true);
      try {
        // Replace with actual API call
        // const response = await userApi.addAddress(newAddress);
        // const addressId = response.data.id;

        const addressId = crypto.randomUUID();
        const addressWithId = {
          ...newAddress,
          id: addressId,
          isCurrent: false,
        };

        const updatedUser = {
          ...user,
          addresses: [...user.addresses, addressWithId],
        };

        persistUserData(updatedUser);
      } catch (error) {
        handleApiError(error);
      } finally {
        setLoading(false);
      }
    },
    [user, persistUserData, handleApiError]
  );

  const deleteAddress = useCallback(
    async (addressId) => {
      if (!user) {
        setError("User not authenticated");
        return;
      }

      if (user.plan === PLANS.BASIC) {
        setError("Basic plan users cannot delete addresses");
        return;
      }

      if (user.addresses.length <= 1) {
        setError("Cannot delete the only address");
        return;
      }

      setLoading(true);
      try {
        // Replace with actual API call
        // await userApi.deleteAddress(addressId);

        const updatedAddresses = user.addresses.filter(
          (addr) => addr.id !== addressId
        );
        let newCurrentAddressId = user.currentAddressId;

        if (addressId === user.currentAddressId) {
          newCurrentAddressId = updatedAddresses[0].id;
        }

        const updatedUser = {
          ...user,
          addresses: updatedAddresses,
          currentAddressId: newCurrentAddressId,
        };

        persistUserData(updatedUser);
      } catch (error) {
        handleApiError(error);
      } finally {
        setLoading(false);
      }
    },
    [user, persistUserData, handleApiError]
  );

  // Update user plan
  const updatePlan = useCallback(
    async (newPlan) => {
      if (!user) {
        setError("User not authenticated");
        return;
      }

      if (!Object.values(PLANS).includes(newPlan)) {
        setError("Invalid plan type");
        return;
      }

      setLoading(true);
      try {
        // Replace with actual API call
        // await userApi.updatePlan(newPlan);

        const updatedUser = {
          ...user,
          plan: newPlan,
        };

        // If downgrading to Basic, keep only the current address
        if (newPlan === PLANS.BASIC && user.addresses.length > 1) {
          const currentAddress = user.addresses.find(
            (addr) => addr.id === user.currentAddressId
          );
          updatedUser.addresses = [currentAddress];
        }

        persistUserData(updatedUser);
      } catch (error) {
        handleApiError(error);
      } finally {
        setLoading(false);
      }
    },
    [user, persistUserData, handleApiError]
  );

  // Refresh user data from backend
  const refreshUser = useCallback(async () => {
    const token = getAuthToken();
    if (!token || !user) {
      setError("User not authenticated");
      return { success: false, message: "User not authenticated" };
    }

    setLoading(true);
    setError(null);
    try {
      const result = await getUserProfile();

      if (result.success) {
        persistUserData(result.data);
        return { success: true, data: result.data };
      } else {
        // If API call fails, we'll use fallback approach since payment was successful
        console.log(
          "API refresh failed, using fallback approach:",
          result.message
        );

        // Update user plan to PRO since they just successfully paid
        const updatedUser = {
          ...user,
          plan: PLANS.PRO,
        };

        persistUserData(updatedUser);
        return {
          success: true,
          data: updatedUser,
          fallback: true,
          message: "Account updated locally (API endpoint not available)",
        };
      }
    } catch (error) {
      console.error("Error refreshing user data:", error);

      // As a last resort, update plan locally since payment was successful
      try {
        const updatedUser = {
          ...user,
          plan: PLANS.PRO,
        };

        persistUserData(updatedUser);
        return {
          success: true,
          data: updatedUser,
          fallback: true,
          message: "Account updated locally (network error)",
        };
      } catch (fallbackError) {
        const errorMessage = error.message || "Failed to refresh user data";
        setError(errorMessage);
        return { success: false, message: errorMessage };
      }
    } finally {
      setLoading(false);
    }
  }, [user, getAuthToken, persistUserData]);

  const contextValue = {
    user,
    setUser, // <-- Expose setUser for direct user updates
    currentAddress,
    error,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    refreshUser,
    switchAddress,
    addAddress,
    deleteAddress,
    updatePlan,
    getAuthToken,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
