import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import { useNavigate, useSearchParams } from "react-router";
import { useAuth } from "../../context/auth/AuthContext";
import { usePlan } from "../../context/plan-context";
import { validateTokenStructure } from "../../utils/payment-verification";

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refreshUser, updatePlan, user } = useAuth();
  const { selectedPlan, clearSelectedPlan } = usePlan();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshMessage, setRefreshMessage] = useState("");
  const [countdown, setCountdown] = useState(3);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationError, setVerificationError] = useState("");

  // Verify payment success token
  const verifyPaymentToken = useCallback(async () => {
    try {
      const token = searchParams.get("token");
      const userId = searchParams.get("user");

      if (!token || !userId) {
        setVerificationError(
          "Invalid payment verification. Missing required parameters."
        );
        return false;
      }

      // Check if the user ID matches the current logged-in user
      if (!user || user.id !== userId) {
        setVerificationError("Payment verification failed. User mismatch.");
        return false;
      }

      // Basic token structure validation
      const isValidStructure = validateTokenStructure(token, userId);
      if (!isValidStructure) {
        setVerificationError("Invalid payment token.");
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error verifying payment token:", error);
      setVerificationError(
        "Payment verification failed. Please contact support."
      );
      return false;
    }
  }, [searchParams, user]);

  // Verify payment on component mount
  useEffect(() => {
    const performVerification = async () => {
      if (user) {
        const verified = await verifyPaymentToken();
        setIsVerified(verified);

        if (!verified) {
          // Stop countdown if verification failed
          setCountdown(0);
        }
      }
    };

    performVerification();
  }, [user, verifyPaymentToken]);

  const handleGoToDashboard = useCallback(async () => {
    if (isRefreshing) return; // Prevent multiple calls

    // Require verification before proceeding
    if (!isVerified) {
      setRefreshMessage("Payment verification required. Redirecting...");
      setTimeout(() => {
        navigate("/pricing");
      }, 2000);
      return;
    }

    setIsRefreshing(true);
    setRefreshMessage("");
    setCountdown(0); // Stop countdown

    try {
      // Since we're on the success page, payment was successful
      // Update the plan based on what the user selected and paid for
      if (selectedPlan && selectedPlan.id) {
        setRefreshMessage(`Updating your plan to ${selectedPlan.name}...`);

        // Normalize the plan ID to match PLANS constants
        let planId = selectedPlan.id.toLowerCase();
        if (planId === "pro" || planId === "premium") {
          planId = "pro";
        } else if (planId === "basic" || planId === "starter") {
          planId = "basic";
        }

        // Update the plan locally first (immediate feedback)
        const updateResult = await updatePlan(planId);

        if (updateResult.success) {
          // Then try to refresh from backend (but don't fail if this doesn't work)
          try {
            const result = await refreshUser();
            if (result.success) {
              setRefreshMessage("Account updated successfully!");
            } else {
              setRefreshMessage(
                `${selectedPlan.name} plan activated successfully!`
              );
            }
          } catch (refreshError) {
            setRefreshMessage(
              `${selectedPlan.name} plan activated successfully!`
            );
          }

          // Short delay to show success message
          setTimeout(() => {
            // Clear the selected plan since payment is complete
            clearSelectedPlan();
            navigate("/dashboard");
          }, 1500);
        } else {
          console.error("Failed to update plan locally:", updateResult.message);
          setRefreshMessage(
            "Payment successful! Your plan will be updated shortly. If it doesn't update, please refresh the page."
          );
          setTimeout(() => {
            clearSelectedPlan();
            navigate("/dashboard");
          }, 2000);
        }
      } else {
        // Fallback: try to refresh user data if no selected plan info
        setRefreshMessage("Updating your account...");

        const result = await refreshUser();
        if (result.success) {
          setRefreshMessage("Account updated successfully!");
        } else {
          setRefreshMessage(
            "Payment successful! If your plan doesn't update, please refresh the page."
          );
        }

        setTimeout(() => {
          clearSelectedPlan();
          navigate("/dashboard");
        }, 2000);
      }
    } catch (error) {
      console.error("Error updating plan:", error);
      setRefreshMessage(
        "Payment successful! Your plan will be updated shortly. If it doesn't appear correctly, please refresh the page."
      );
      setTimeout(() => {
        clearSelectedPlan();
        navigate("/dashboard");
      }, 3000);
    } finally {
      setIsRefreshing(false);
    }
  }, [
    refreshUser,
    updatePlan,
    selectedPlan,
    clearSelectedPlan,
    navigate,
    isRefreshing,
    isVerified,
  ]);

  // Auto-refresh after 3 seconds (only if verified)
  useEffect(() => {
    if (!isVerified && verificationError) {
      // If verification failed, don't start countdown
      return;
    }

    if (countdown > 0 && isVerified) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !isRefreshing && isVerified) {
      // Auto-trigger refresh when countdown reaches 0 and verified
      handleGoToDashboard();
    }
  }, [
    countdown,
    isRefreshing,
    handleGoToDashboard,
    isVerified,
    verificationError,
  ]);

  return (
    <>
      <Navbar />
      <div
        className="container mx-auto px-4 py-16  flex flex-col items-center justify-center"
        style={{ minHeight: "calc(100vh - 152px)" }}
      >
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-lg">
          {verificationError ? (
            <>
              <h1 className="text-3xl font-bold text-red-600 mb-4">
                Verification Failed
              </h1>
              <p className="mb-6 text-gray-700">{verificationError}</p>
              <button
                className="px-6 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                onClick={() => navigate("/pricing")}
              >
                Return to Pricing
              </button>
            </>
          ) : !isVerified ? (
            <>
              <h1 className="text-3xl font-bold text-blue-600 mb-4">
                Verifying Payment...
              </h1>
              <p className="mb-6 text-gray-700">
                Please wait while we verify your payment.
              </p>
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
