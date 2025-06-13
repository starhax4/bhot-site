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
  const [error, setError] = useState(null);

  React.useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    Promise.all([adminGetDashboardSummary(), adminGetDashboardAnalytics()])
      .then(([summaryRes, analyticsRes]) => {
        if (!isMounted) return;
        if (!summaryRes.success) {
          setError(summaryRes.message || "Failed to load summary");
        } else if (!analyticsRes.success) {
          setError(analyticsRes.message || "Failed to load analytics");
        } else {
          setSummary(summaryRes.data);
          setAnalytics(analyticsRes.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError("Failed to load dashboard data");
        setLoading(false);
      });
    return () => {
      isMounted = false;
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
          <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl mt-16 animate-pulse">
            {/* CardsGrid skeleton */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 md:gap-14 place-items-center md:px-12 md:py-11">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="w-64 h-40 bg-white rounded-3xl shadow-lg"
                />
              ))}
            </div>
            {/* SalesGraphGrid skeleton */}
            <div className="flex-1 flex flex-col gap-8 px-4 py-4 md:py-11 w-full">
              {[220, 192, 192].map((h, i) => (
                <div
                  key={i}
                  className={`w-full h-[${h}px] bg-white rounded-xl shadow-lg`}
                />
              ))}
            </div>
          </div>
          <div className="w-full max-w-4xl h-32 bg-white rounded-2xl shadow mt-12 animate-pulse" />
          <div className="text-lg font-semibold text-gray-500 mt-8 animate-pulse">
            Loading admin dashboard...
          </div>
        </div>
        <Footer />
      </>
    );
  }
  if (error) {
    return (
      <div className="flex flex-col min-h-screen justify-center items-center">
        <Navbar onNavClick={setSelectedModal} />
        <div className="text-red-600 text-lg font-semibold mt-20">{error}</div>
        <Footer />
      </div>
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
