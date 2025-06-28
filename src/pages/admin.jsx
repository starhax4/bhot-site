import React, { useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import DashboardCard from "../components/dashboard/dashboard-overview";
import Modal from "../components/modal";
import RecomendationTable from "../components/dashboard/recomendation-table";
import ValueCard from "../components/dashboard/value-card";
import RecommendationsTable from "../components/dashboard/recomendation-table";
import DetailCard from "../components/admin-dashboard/detail-card";
import CardsGrid from "../components/admin-dashboard/cards-grid";
import SalesGraphGrid from "../components/admin-dashboard/SalesGraphGrid";
import UserAddressManager from "../components/admin-dashboard/user-address-manager";
import {
  adminGetDashboardSummary,
  adminGetDashboardAnalytics,
} from "../api/serices/api_utils";

const Admin = () => {
  const [selectedModal, setSelectedModal] = useState(null);
  const [summary, setSummary] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingStage, setLoadingStage] = useState("Initializing...");
  const [error, setError] = useState(null);

  React.useEffect(() => {
    let isMounted = true;
    let timeoutId;

    setLoading(true);
    setError(null);
    setLoadingStage("Connecting to server...");

    // Set a timeout for heavy calculations (30 seconds)
    timeoutId = setTimeout(() => {
      if (isMounted) {
        setError(
          "Dashboard loading is taking longer than expected. Please refresh the page or try again later."
        );
        setLoading(false);
      }
    }, 30000);

    // Simulate loading stages for better UX
    const stageTimeout1 = setTimeout(() => {
      if (isMounted) setLoadingStage("Loading dashboard summary...");
    }, 1000);

    const stageTimeout2 = setTimeout(() => {
      if (isMounted) setLoadingStage("Processing analytics data...");
    }, 3000);

    const stageTimeout3 = setTimeout(() => {
      if (isMounted) setLoadingStage("Performing calculations...");
    }, 6000);

    Promise.all([adminGetDashboardSummary(), adminGetDashboardAnalytics()])
      .then(([summaryRes, analyticsRes]) => {
        if (!isMounted) return;

        // Clear all timeouts if data loads successfully
        clearTimeout(timeoutId);
        clearTimeout(stageTimeout1);
        clearTimeout(stageTimeout2);
        clearTimeout(stageTimeout3);

        if (!summaryRes.success) {
          setError(summaryRes.message || "Failed to load summary data");
        } else if (!analyticsRes.success) {
          setError(analyticsRes.message || "Failed to load analytics data");
        } else {
          setLoadingStage("Finalizing dashboard...");
          // Small delay to show final stage
          setTimeout(() => {
            if (isMounted) {
              setSummary(summaryRes.data);
              setAnalytics(analyticsRes.data);
              setLoading(false);
            }
          }, 500);
        }
      })
      .catch((err) => {
        if (!isMounted) return;

        // Clear all timeouts on error
        clearTimeout(timeoutId);
        clearTimeout(stageTimeout1);
        clearTimeout(stageTimeout2);
        clearTimeout(stageTimeout3);

        console.error("Dashboard loading error:", err);
        setError(
          "Failed to load dashboard data. Please check your connection and try again."
        );
        setLoading(false);
      });

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      clearTimeout(stageTimeout1);
      clearTimeout(stageTimeout2);
      clearTimeout(stageTimeout3);
    };
  }, []);

  const handleCloseModal = () => {
    setSelectedModal(null);
  };

  if (loading) {
    return (
      <>
        <Navbar onNavClick={setSelectedModal} />
        <div
          className="flex flex-col w-full justify-center items-center bg-gray-50"
          style={{ minHeight: "calc(100vh - 180px)" }}
        >
          <div className="flex flex-col justify-center items-center space-y-8 max-w-md mx-auto px-6">
            {/* Loading Spinner */}
            <div className="relative">
              <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin">
                <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
              </div>
              {/* Inner pulsing dot */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Loading Text */}
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Loading Admin Dashboard
              </h2>
              <div className="space-y-2">
                <p className="text-gray-600">{loadingStage}</p>
                <p className="text-sm text-gray-500">
                  This may take a few moments as we compile your data
                </p>
              </div>

              {/* Progress indicators */}
              <div className="flex justify-center space-x-2 mt-6">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }
  if (error) {
    return (
      <>
        <Navbar onNavClick={setSelectedModal} />
        <div
          className="flex flex-col w-full justify-center items-center bg-gray-50"
          style={{ minHeight: "calc(100vh - 180px)" }}
        >
          <div className="flex flex-col justify-center items-center space-y-8 max-w-lg mx-auto px-6 text-center">
            {/* Error Icon */}
            <div className="relative">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
            </div>

            {/* Error Text */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Dashboard Loading Failed
              </h2>
              <p className="text-gray-600 leading-relaxed">{error}</p>

              {/* Retry Button */}
              <button
                onClick={() => window.location.reload()}
                className="mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Retry Loading
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar onNavClick={setSelectedModal} />
      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <CardsGrid summary={summary} />
          <SalesGraphGrid
            summary={summary}
            analytics={analytics}
          />
        </div>
        <UserAddressManager />
      </div>
      <Footer />
      <Modal
        open={selectedModal !== null}
        contentType={selectedModal}
        onClose={handleCloseModal}
        selectedModal={setSelectedModal}
      />
    </>
  );
};

export default Admin;
