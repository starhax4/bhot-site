import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/auth/AuthContext";

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshMessage, setRefreshMessage] = useState("");
  const [countdown, setCountdown] = useState(3);

  const handleGoToDashboard = useCallback(async () => {
    if (isRefreshing) return; // Prevent multiple calls

    setIsRefreshing(true);
    setRefreshMessage("");
    setCountdown(0); // Stop countdown

    try {
      const result = await refreshUser();
      if (result.success) {
        if (result.fallback) {
          setRefreshMessage("Payment successful! Account updated.");
        } else {
          setRefreshMessage("Account updated successfully!");
        }
        // Short delay to show success message
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        // If refresh fails, show a user-friendly message and still proceed
        console.error("Failed to refresh user data:", result.message);
        setRefreshMessage("Payment successful! Redirecting to dashboard...");
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      }
    } catch (error) {
      console.error("Error refreshing user:", error);
      // Still navigate to dashboard even if refresh fails
      setRefreshMessage("Payment successful! Redirecting to dashboard...");
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshUser, navigate, isRefreshing]);

  // Auto-refresh after 3 seconds
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !isRefreshing) {
      // Auto-trigger refresh when countdown reaches 0
      handleGoToDashboard();
    }
  }, [countdown, isRefreshing, handleGoToDashboard]);

  return (
    <>
      <Navbar />
      <div
        className="container mx-auto px-4 py-16  flex flex-col items-center justify-center"
        style={{ minHeight: "calc(100vh - 152px)" }}
      >
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-lg">
          <h1 className="text-3xl font-bold text-green-600 mb-4">
            Payment Successful!
          </h1>
          <p className="mb-6 text-gray-700">
            Thank you for your purchase. Your subscription is now active.
          </p>

          {refreshMessage && (
            <p className="mb-4 text-sm text-blue-600 font-medium">
              {refreshMessage}
            </p>
          )}

          {countdown > 0 && !isRefreshing && (
            <p className="mb-4 text-sm text-gray-500">
              Automatically updating your account in {countdown} seconds...
            </p>
          )}

          <button
            className={`px-6 py-2 rounded transition-colors ${
              isRefreshing
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-green-500 text-white hover:bg-green-600"
            }`}
            onClick={handleGoToDashboard}
            disabled={isRefreshing}
          >
            {isRefreshing
              ? "Updating account..."
              : countdown > 0
              ? `Go to Dashboard (${countdown})`
              : "Go to Dashboard"}
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}
