import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import PropTypes from "prop-types";

// Constants
export const PLANS = {
  BASIC: "Basic",
  PRO: "Pro",
};

const AuthContext = createContext();

const MAX_PRO_ADDRESSES = 5;
const DEFAULT_ADDRESS = {
  id: "default",
  street: "1",
  city: "City",
  zip: "12345",
  country: "UK",
  isCurrent: true,
};

// Mock Pro User Data
const MOCK_PRO_USER = {
  id: "pro-user-123",
  name: "John Pro",
  email: "john.pro@example.com",
  plan: PLANS.PRO,
  addresses: [
    {
      id: "addr1",
      street: "123 Main Street",
      city: "London",
      zip: "SW1A 1AA",
      country: "UK",
      isCurrent: true,
    },
    {
      id: "addr2",
      street: "456 High Street",
      city: "Manchester",
      zip: "M1 1BB",
      country: "UK",
      isCurrent: false,
    },
    {
      id: "addr3",
      street: "789 Market Square",
      city: "Birmingham",
      zip: "B1 1CC",
      country: "UK",
      isCurrent: false,
    },
  ],
  currentAddressId: "addr1",
};

export const AuthProvider = ({ children }) => {
  const [currentAddress, setCurrentAddress] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Validate and clean user data
  const validateAndCleanUserData = useCallback((userData) => {
    if (!userData) return null;

    try {
      // Ensure required fields exist
      const cleanedData = {
        id: userData.id || crypto.randomUUID(),
        name: userData.name || "",
        email: userData.email || "",
        plan: Object.values(PLANS).includes(userData.plan)
          ? userData.plan
          : PLANS.BASIC,
        addresses: [],
        currentAddressId: null,
      };

      // Validate and clean addresses
      if (Array.isArray(userData.addresses)) {
        cleanedData.addresses = userData.addresses
          .filter(
            (addr) =>
              addr &&
              typeof addr === "object" &&
              addr.id &&
              addr.street &&
              addr.city &&
              addr.zip &&
              addr.country
          )
          .map((addr) => ({
            id: addr.id,
            street: addr.street.trim(),
            city: addr.city.trim(),
            zip: addr.zip.trim(),
            country: addr.country.trim(),
            isCurrent: false,
          }));

        // Enforce plan limitations
        if (cleanedData.plan === PLANS.BASIC) {
          cleanedData.addresses = cleanedData.addresses.slice(0, 1);
        } else {
          cleanedData.addresses = cleanedData.addresses.slice(
            0,
            MAX_PRO_ADDRESSES
          );
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

  // Always initialize with Pro user for testing
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      if (!stored) {
        // Initialize with mock Pro user if no stored data
        localStorage.setItem("user", JSON.stringify(MOCK_PRO_USER));
        return MOCK_PRO_USER;
      }

      const parsedUser = JSON.parse(stored);
      return validateAndCleanUserData(parsedUser);
    } catch (error) {
      console.error("Error loading user data:", error);
      // Return mock Pro user as fallback
      return MOCK_PRO_USER;
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
    (userData) => {
      try {
        const validatedData = validateAndCleanUserData(userData);
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
    [validateAndCleanUserData, handleApiError]
  );

  // Auth actions
  const login = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay
      persistUserData(MOCK_PRO_USER);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      // Replace with actual API call
      // await authApi.logout();

      localStorage.removeItem("user");
      setUser(null);
      setCurrentAddress(null);
      setError(null);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  }, [handleApiError]);

  // Address management
  const switchAddress = useCallback(
    async (addressId) => {
      if (!user) {
        setError("User not authenticated");
        return;
      }

      if (user.plan === PLANS.BASIC) {
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

  const contextValue = {
    user,
    currentAddress,
    error,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    switchAddress,
    addAddress,
    deleteAddress,
    updatePlan,
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
