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
      <div className="flex flex-col min-h-screen w-full justify-center items-center bg-gray-50">
        <Navbar onNavClick={setSelectedModal} />
        <div className="flex-1 flex flex-col w-full items-center justify-center">
          <div className="w-full flex flex-col items-center justify-center py-24">
            <div className="w-full max-w-2xl h-40 bg-white rounded-2xl shadow animate-pulse mb-8" />
            <div className="w-full max-w-2xl h-80 bg-white rounded-2xl shadow animate-pulse mb-8" />
            <div className="w-full max-w-2xl h-24 bg-white rounded-2xl shadow animate-pulse" />
          </div>
          <div className="text-lg font-semibold text-gray-500 mt-4">
            Loading admin dashboard...
          </div>
        </div>
        <Footer />
      </div>
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
