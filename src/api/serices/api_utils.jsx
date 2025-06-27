import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Function to get current auth token
const getAuthToken = () => {
  return localStorage.getItem("authToken");
};

// Function to check if token is expired (basic check)
const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    // If we can't parse the token, assume it's invalid
    return true;
  }
};

// Function to set auth token in axios headers
const setAuthToken = (token) => {
  if (token && !isTokenExpired(token)) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
    if (token && isTokenExpired(token)) {
      localStorage.removeItem("authToken");
    }
  }
};

// Set initial token if available
const initialToken = getAuthToken();
if (initialToken) {
  setAuthToken(initialToken);
}

// Set default headers
axios.defaults.headers.common["Content-Type"] = "application/json";

// Add a request interceptor to ensure fresh token
axios.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token && !isTokenExpired(token)) {
      // Send only the token, no 'Bearer ' prefix
      config.headers.Authorization = token;
    } else if (token && isTokenExpired(token)) {
      // Clean up expired token
      localStorage.removeItem("authToken");
      delete axios.defaults.headers.common["Authorization"];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear invalid token
      localStorage.removeItem("authToken");
      delete axios.defaults.headers.common["Authorization"];

      // Optionally redirect to login or trigger logout
      if (typeof window !== "undefined" && window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

// Add logging for update requests in interceptor
axios.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token && !isTokenExpired(token)) {
      // Send only the token, no 'Bearer ' prefix
      config.headers.Authorization = token;
    } else if (token && isTokenExpired(token)) {
      localStorage.removeItem("authToken");
      delete axios.defaults.headers.common["Authorization"];
    }
    // Debug updateUserData requests
    if (config.url?.endsWith("/api/auth/update")) {
      console.log("DEBUG updateUserData request config:", {
        url: config.url,
        headers: config.headers,
        data: config.data,
      });
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const registerUser = async (userData) => {
  try {
    const registerUrl = `${API_URL}/api/auth/register`;

    const res = await axios.post(registerUrl, userData, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 15000, // 15 second timeout
    });

    // Store token if provided
    if (res.data.token) {
      localStorage.setItem("authToken", res.data.token);
      setAuthToken(res.data.token);
    }

    return { success: true, data: res.data };
  } catch (error) {
    let errorMessage = "Registration failed";
    let errorData = null;

    if (error.response) {
      // Server responded with error status
      errorMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        `Server error (${error.response.status})`;
      errorData = error.response.data;
    } else if (error.request) {
      // Request was made but no response received
      errorMessage =
        "Unable to connect to server. Please check your connection.";
    } else {
      // Something else happened
      errorMessage = error.message || "An unexpected error occurred";
    }

    return {
      success: false,
      message: errorMessage,
      error: errorData || error.message,
      status: error.response?.status,
    };
  }
};

export const loginUser = async (userData) => {
  try {
    const loginUrl = `${API_URL}/api/auth/login`;

    const res = await axios.post(loginUrl, userData, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 15000, // 15 second timeout
    });

    // Store token if provided
    if (res.data.token) {
      localStorage.setItem("authToken", res.data.token);
      setAuthToken(res.data.token);
    }

    return { success: true, data: res.data };
  } catch (error) {
    let errorMessage = "Login failed";
    let errorData = null;

    if (error.response) {
      // Server responded with error status
      errorMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        `Server error (${error.response.status})`;
      errorData = error.response.data;
    } else if (error.request) {
      // Request was made but no response received
      errorMessage =
        "Unable to connect to server. Please check your connection.";
    } else {
      // Something else happened
      errorMessage = error.message || "An unexpected error occurred";
    }

    return {
      success: false,
      message: errorMessage,
      error: errorData || error.message,
      status: error.response?.status,
    };
  }
};

export const submitContactForm = async (contactData) => {
  try {
    const formUrl = `${API_URL}/api/form/submit-form`;

    const res = await axios.post(formUrl, contactData, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 15000, // 15 second timeout
    });

    return { success: true, data: res.data };
  } catch (error) {
    let errorMessage = "Contact form Submit failed";
    let errorData = null;

    if (error.response) {
      // Server responded with error status
      errorMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        `Server error (${error.response.status})`;
      errorData = error.response.data;
    } else if (error.request) {
      // Request was made but no response received
      errorMessage =
        "Unable to connect to server. Please check your connection.";
    } else {
      // Something else happened
      errorMessage = error.message || "An unexpected error occurred";
    }

    return {
      success: false,
      message: errorMessage,
      error: errorData || error.message,
      status: error.response?.status,
    };
  }
};

export const updateUserData = async (userData) => {
  try {
    const userUrl = `${API_URL}/api/auth/update`;

    const res = await axios.put(userUrl, userData, { timeout: 15000 });

    return { success: true, data: res.data };
  } catch (error) {
    // Handle errors
    let errorMessage = "User Data Update failed";
    let errorData = null;

    if (error.response) {
      // Server responded with error status
      const status = error.response.status;

      if (status === 401) {
        errorMessage = "Session expired or invalid token. Please log in again.";
      } else if (status === 403) {
        errorMessage = "You don't have permission to perform this action.";
      } else if (status === 422) {
        errorMessage = error.response.data?.message || "Invalid data provided.";
      } else {
        errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          `Server error (${status})`;
      }
      errorData = error.response.data;
    } else if (error.request) {
      errorMessage =
        "Unable to connect to server. Please check your connection.";
    } else {
      errorMessage = error.message || "An unexpected error occurred";
    }

    return {
      success: false,
      message: errorMessage,
      error: errorData || error.message,
      status: error.response?.status,
    };
  }
};

export const getUserProfile = async () => {
  try {
    // Get user ID from localStorage
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      return {
        success: false,
        message: "No user data found in local storage",
        error: null,
        status: 400,
      };
    }

    const user = JSON.parse(storedUser);
    const userId = user?.id || user?._id || user?.userId;

    if (!userId) {
      return {
        success: false,
        message: "User ID not found in stored user data",
        error: null,
        status: 400,
      };
    }

    // Try multiple possible endpoints for getting user by ID
    const possibleEndpoints = [
      `${API_URL}/api/auth/user/${userId}`,
      `${API_URL}/api/user/${userId}`,
      `${API_URL}/api/users/${userId}`,
      `${API_URL}/api/auth/profile/${userId}`,
    ];

    let lastError = null;

    for (const endpoint of possibleEndpoints) {
      try {
        const res = await axios.get(endpoint, { timeout: 15000 });
        return { success: true, data: res.data };
      } catch (error) {
        lastError = error;
        // If it's not a 404, break the loop (might be auth issue, server error, etc.)
        if (error.response?.status !== 404) {
          break;
        }
        // Continue to next endpoint if 404
        continue;
      }
    }

    // If we get here, all endpoints failed
    throw lastError;
  } catch (error) {
    // Handle errors
    let errorMessage = "Failed to fetch user profile";
    let errorData = null;

    if (error.response) {
      // Server responded with error status
      const status = error.response.status;

      if (status === 401) {
        errorMessage = "Session expired or invalid token. Please log in again.";
      } else if (status === 403) {
        errorMessage = "You don't have permission to access this profile.";
      } else if (status === 404) {
        errorMessage =
          "User profile endpoint not found. The backend may not support user profile fetching.";
      } else {
        errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          `Server error (${status})`;
      }
      errorData = error.response.data;
    } else if (error.request) {
      errorMessage =
        "Unable to connect to server. Please check your connection.";
    } else {
      errorMessage = error.message || "An unexpected error occurred";
    }

    return {
      success: false,
      message: errorMessage,
      error: errorData || error.message,
      status: error.response?.status,
    };
  }
};

export const forgetPassword = async (email) => {
  try {
    const url = `${API_URL}/api/auth/forgot-password`;
    const data = { email: email };

    const res = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 15000, // 15 second timeout
    });
    return { success: true, data: data };
  } catch (error) {
    let errorMessage = "Forget password failed";
    let errorData = null;

    if (error.response) {
      // Server responded with error status
      errorMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        `Server error (${error.response.status})`;
      errorData = error.response.data;
    } else if (error.request) {
      // Request was made but no response received
      errorMessage =
        "Unable to connect to server. Please check your connection.";
    } else {
      // Something else happened
      errorMessage = error.message || "An unexpected error occurred";
    }

    return {
      success: false,
      message: errorMessage,
      error: errorData || error.message,
      status: error.response?.status,
    };
  }
};

export const resetPassword = async (token, password, confirmPassword) => {
  try {
    const url = `${API_URL}/api/auth/reset-password/${token}`;
    const data = { password, confirmPassword };
    const res = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 15000,
    });
    return { success: true, data: res.data };
  } catch (error) {
    let errorMessage = "Password reset failed";
    let errorData = null;
    if (error.response) {
      errorMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        `Server error (${error.response.status})`;
      errorData = error.response.data;
    } else if (error.request) {
      errorMessage =
        "Unable to connect to server. Please check your connection.";
    } else {
      errorMessage = error.message || "An unexpected error occurred";
    }
    return {
      success: false,
      message: errorMessage,
      error: errorData || error.message,
      status: error.response?.status,
    };
  }
};

export const fetchDashboardEpcData = async (postcode, address) => {
  const token = getAuthToken();
  if (!token || isTokenExpired(token)) {
    localStorage.removeItem("authToken");
    delete axios.defaults.headers.common["Authorization"];
    return {
      success: false,
      message: "Session expired or invalid token. Please log in again.",
      error: null,
      status: 401,
    };
  }
  if (!postcode || !address) {
    return {
      success: false,
      message: "Postcode and address are required",
      error: null,
      status: 400,
    };
  }
  try {
    const url = `${API_URL}/api/user-data?postcode=${encodeURIComponent(
      postcode
    )}&address=${encodeURIComponent(address)}`;
    const res = await axios.get(url, { timeout: 15000 });
    if (!res.data || !res.data.data) {
      return {
        success: false,
        message: "No data found for given address/postcode.",
        error: null,
        status: 404,
      };
    }
    return { success: true, data: res.data.data };
  } catch (error) {
    let errorMessage = "Failed to fetch EPC data";
    let errorData = null;
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem("authToken");
        delete axios.defaults.headers.common["Authorization"];
        errorMessage = "Session expired or invalid token. Please log in again.";
      } else {
        errorMessage =
          error.response.data?.error ||
          error.response.data?.message ||
          `Server error (${error.response.status})`;
      }
      errorData = error.response.data;
    } else if (error.request) {
      errorMessage =
        "Unable to connect to server. Please check your connection.";
    } else {
      errorMessage = error.message || "An unexpected error occurred";
    }
    return {
      success: false,
      message: errorMessage,
      error: errorData || error.message,
      status: error.response?.status,
    };
  }
};

// API: Neighbourhood Benchmarking
export const fetchNeighbourhoodBenchmarking = async (filters) => {
  // filters: { postcode, floor-area, property-type, userFloorArea?, userPropertyType? }
  const token = getAuthToken();
  if (!token || isTokenExpired(token)) {
    localStorage.removeItem("authToken");
    delete axios.defaults.headers.common["Authorization"];
    return {
      success: false,
      message: "Session expired or invalid token. Please log in again.",
      error: null,
      status: 401,
    };
  }
  // Validate and sanitize filters
  const {
    postcode,
    "floor-area": floorArea,
    "property-type": propertyType,
    userFloorArea,
    userPropertyType,
  } = filters || {};
  if (!postcode || !floorArea || !propertyType) {
    return {
      success: false,
      message: "All of postcode, floor-area , property-type are required",
      error: null,
      status: 400,
    };
  }
  try {
    // Ensure user's property values are always included in the arrays
    let floorAreaArr = Array.isArray(floorArea) ? [...floorArea] : [floorArea];
    let propertyTypeArr = Array.isArray(propertyType)
      ? [...propertyType]
      : [propertyType];
    if (userFloorArea && !floorAreaArr.includes(userFloorArea)) {
      floorAreaArr.push(userFloorArea);
    }
    if (userPropertyType && !propertyTypeArr.includes(userPropertyType)) {
      propertyTypeArr.push(userPropertyType);
    }
    // Serialize arrays as repeated query params (not comma-separated)
    const params = [];
    params.push(`postcode=${encodeURIComponent(postcode)}`);
    floorAreaArr.forEach((fa) => {
      params.push(`floorArea=${encodeURIComponent(fa)}`);
    });
    propertyTypeArr.forEach((pt) => {
      params.push(`propertyType=${encodeURIComponent(pt)}`);
    });
    const url = `${API_URL}/api/user-plot?${params.join("&")}`;
    const res = await axios.get(url, { timeout: 15000 });
    if (!res.data || !res.data.data) {
      return {
        success: false,
        message: "No benchmarking data found for given filters.",
        error: null,
        status: 404,
      };
    }
    return { success: true, data: res.data.data };
  } catch (error) {
    let errorMessage = "Failed to fetch neighbourhood benchmarking data";
    let errorData = null;
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem("authToken");
        delete axios.defaults.headers.common["Authorization"];
        errorMessage = "Session expired or invalid token. Please log in again.";
      } else {
        errorMessage =
          error.response.data?.error ||
          error.response.data?.message ||
          `Server error (${error.response.status})`;
      }
      errorData = error.response.data;
    } else if (error.request) {
      errorMessage =
        "Unable to connect to server. Please check your connection.";
      errorData = null;
    } else {
      errorMessage = error.message || "An unexpected error occurred";
      errorData = null;
    }
    return {
      success: false,
      message: errorMessage,
      error: errorData || error.message,
      status: error.response?.status,
    };
  }
};

// API: Create Stripe Subscription and get Checkout URL
export const createStripeSubscription = async (plan, userId) => {
  try {
    if (!plan || !userId) {
      return {
        success: false,
        message: "Plan and userId are required.",
        error: null,
        status: 400,
      };
    }
    const url = `${API_URL}/api/subscription/subscribe`;
    const res = await axios.post(
      url,
      { plan, userId },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 15000,
      }
    );
    if (res.data && res.data.url) {
      return { success: true, url: res.data.url };
    } else {
      return {
        success: false,
        message: "No checkout URL returned from server.",
        error: null,
        status: 500,
      };
    }
  } catch (error) {
    let errorMessage = "Failed to create subscription";
    let errorData = null;
    if (error.response) {
      errorMessage =
        error.response.data?.error ||
        error.response.data?.message ||
        `Server error (${error.response.status})`;
      errorData = error.response.data;
    } else if (error.request) {
      errorMessage =
        "Unable to connect to server. Please check your connection.";
    } else {
      errorMessage = error.message || "An unexpected error occurred";
    }
    return {
      success: false,
      message: errorMessage,
      error: errorData || error.message,
      status: error.response?.status,
    };
  }
};

// Add user address via POST /api/user/address
export const addUserAddress = async ({ address, postcode, userId }) => {
  try {
    // Try to get userId from argument, or from localStorage user object
    let finalUserId = userId;
    if (!finalUserId) {
      const user = JSON.parse(localStorage.getItem("user"));
      finalUserId = user?.id || user?._id || user?.userId;
    }
    if (!finalUserId) {
      return { success: false, message: "User ID not found in client" };
    }
    const url = `${API_URL}/api/user/address`;
    const res = await axios.post(
      url,
      { address, postcode, userId: finalUserId },
      { headers: { "Content-Type": "application/json" }, timeout: 15000 }
    );
    return { success: true, ...res.data };
  } catch (error) {
    let errorMessage = "Failed to add address";
    let errorData = null;
    if (error.response) {
      errorMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        `Server error (${error.response.status})`;
      errorData = error.response.data;
    } else if (error.request) {
      errorMessage =
        "Unable to connect to server. Please check your connection.";
    } else {
      errorMessage = error.message || "An unexpected error occurred";
    }
    return {
      success: false,
      message: errorMessage,
      error: errorData || error.message,
      status: error.response?.status,
    };
  }
};

// Admin: Get all addresses for a user by email
export const adminGetUserAddresses = async (email) => {
  const token = getAuthToken();
  if (!token || isTokenExpired(token)) {
    localStorage.removeItem("authToken");
    delete axios.defaults.headers.common["Authorization"];
    return {
      success: false,
      message: "Session expired or invalid token. Please log in again.",
      error: null,
      status: 401,
    };
  }
  if (!email) {
    return {
      success: false,
      message: "Email is required",
      error: null,
      status: 400,
    };
  }
  try {
    const url = `${API_URL}/api/admin/user/${encodeURIComponent(
      email
    )}/addresses`;
    const res = await axios.get(url, { timeout: 15000 });
    return { success: true, addresses: res.data.addresses };
  } catch (error) {
    let errorMessage = "Failed to fetch user addresses";
    let errorData = null;
    if (error.response) {
      errorMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        `Server error (${error.response.status})`;
      errorData = error.response.data;
    } else if (error.request) {
      errorMessage =
        "Unable to connect to server. Please check your connection.";
    } else {
      errorMessage = error.message || "An unexpected error occurred";
    }
    return {
      success: false,
      message: errorMessage,
      error: errorData || error.message,
      status: error.response?.status,
    };
  }
};

// Admin: Replace all addresses for a user by email
export const adminReplaceUserAddresses = async ({ email, addresses }) => {
  const token = getAuthToken();
  if (!token || isTokenExpired(token)) {
    localStorage.removeItem("authToken");
    delete axios.defaults.headers.common["Authorization"];
    return {
      success: false,
      message: "Session expired or invalid token. Please log in again.",
      error: null,
      status: 401,
    };
  }
  if (!email || !Array.isArray(addresses)) {
    return {
      success: false,
      message: "Email and addresses array are required",
      error: null,
      status: 400,
    };
  }
  try {
    const url = `${API_URL}/api/admin/user/addresses/replace`;
    const res = await axios.post(
      url,
      { email, addresses },
      { headers: { "Content-Type": "application/json" }, timeout: 15000 }
    );
    return {
      success: true,
      addresses: res.data.addresses,
      message: res.data.message,
    };
  } catch (error) {
    let errorMessage = "Failed to replace user addresses";
    let errorData = null;
    if (error.response) {
      errorMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        `Server error (${error.response.status})`;
      errorData = error.response.data;
    } else if (error.request) {
      errorMessage =
        "Unable to connect to server. Please check your connection.";
    } else {
      errorMessage = error.message || "An unexpected error occurred";
    }
    return {
      success: false,
      message: errorMessage,
      error: errorData || error.message,
      status: error.response?.status,
    };
  }
};

// Admin: Get dashboard summary (users, sales, etc)
export const adminGetDashboardSummary = async () => {
  const token = getAuthToken();
  if (!token || isTokenExpired(token)) {
    localStorage.removeItem("authToken");
    delete axios.defaults.headers.common["Authorization"];
    return {
      success: false,
      message: "Session expired or invalid token. Please log in again.",
      error: null,
      status: 401,
      data: null,
    };
  }
  try {
    const url = `${API_URL}/api/admin/dashboard/summary`;
    const res = await axios.get(url, { timeout: 30000 }); // 30s timeout for heavy calculation
    return {
      success: true,
      data: res.data,
      message: "Dashboard summary fetched successfully.",
      error: null,
      status: 200,
    };
  } catch (error) {
    let errorMessage = "Failed to fetch dashboard summary";
    let errorData = null;
    if (error.response) {
      errorMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        `Server error (${error.response.status})`;
      errorData = error.response.data;
    } else if (error.request) {
      errorMessage =
        "Unable to connect to server. Please check your connection.";
    } else {
      errorMessage = error.message || "An unexpected error occurred";
    }
    return {
      success: false,
      data: null,
      message: errorMessage,
      error: errorData || error.message,
      status: error.response?.status,
    };
  }
};

// Admin: Get dashboard analytics (visits, conversions, etc)
export const adminGetDashboardAnalytics = async () => {
  const token = getAuthToken();
  if (!token || isTokenExpired(token)) {
    localStorage.removeItem("authToken");
    delete axios.defaults.headers.common["Authorization"];
    return {
      success: false,
      message: "Session expired or invalid token. Please log in again.",
      error: null,
      status: 401,
      data: null,
    };
  }
  try {
    const url = `${API_URL}/api/admin/dashboard/analytics`;
    const res = await axios.get(url, { timeout: 30000 }); // 30s timeout for heavy calculation
    return {
      success: true,
      data: res.data,
      message: "Dashboard analytics fetched successfully.",
      error: null,
      status: 200,
    };
  } catch (error) {
    let errorMessage = "Failed to fetch dashboard analytics";
    let errorData = null;
    if (error.response) {
      errorMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        `Server error (${error.response.status})`;
      errorData = error.response.data;
    } else if (error.request) {
      errorMessage =
        "Unable to connect to server. Please check your connection.";
    } else {
      errorMessage = error.message || "An unexpected error occurred";
    }
    return {
      success: false,
      data: null,
      message: errorMessage,
      error: errorData || error.message,
      status: error.response?.status,
    };
  }
};
