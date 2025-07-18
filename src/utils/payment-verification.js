import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Basic token structure validation (client-side)
 * @param {string} token - The token to validate
 * @param {string} expectedUserId - The expected user ID
 * @returns {boolean} Whether the token structure is valid
 */
export const validateTokenStructure = (token, expectedUserId) => {
  try {
    if (!token || !expectedUserId) return false;

    // Decode token
    const decodedToken = atob(token);
    const tokenData = JSON.parse(decodedToken);

    // Check required fields
    if (!tokenData.userId || !tokenData.timestamp || !tokenData.signature) {
      return false;
    }

    // Verify user ID matches
    if (tokenData.userId !== expectedUserId) {
      return false;
    }

    // Check if token is not too old (1 hour)
    const tokenAge = Date.now() - tokenData.timestamp;
    const maxAge = 60 * 60 * 1000; // 1 hour in milliseconds

    if (tokenAge > maxAge) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Token validation error:", error);
    return false;
  }
};
