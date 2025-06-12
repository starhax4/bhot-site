import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import DashboardCard from "../components/dashboard/dashboard-overview";
import Modal from "../components/modal";
import ValueCard from "../components/dashboard/value-card";
import RecommendationsTable from "../components/dashboard/recomendation-table";
import AddressSelector from "../components/address-selector";
import AddressError from "../components/address-error";
import { useAuth } from "../context/auth/AuthContext";
import { fetchDashboardEpcData } from "../api/serices/api_utils";

const Dashboard = () => {
  const [selectedModal, setSelectedModal] = useState(null);
  const { user, currentAddress } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [property, setProperty] = useState(null);
  const [energy, setEnergy] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    let retryCount = 0;
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 2000; // 2 seconds

    const fetchData = () => {
      const postcode = currentAddress?.postcode || currentAddress?.zip;
      if (currentAddress && postcode && currentAddress.address) {
        setLoading(true);
        setError(null);
        fetchDashboardEpcData(postcode, currentAddress.address)
          .then((res) => {
            if (res.success && res.data) {
              setProperty(res.data.property || {});
              setEnergy(res.data.energy || {});
              setRecommendations(
                Array.isArray(res.data.recommendations)
                  ? res.data.recommendations
                  : []
              );
            } else {
              if (retryCount < MAX_RETRIES) {
                retryCount++;
                setTimeout(fetchData, RETRY_DELAY);
              } else {
                setError(res.message || "Failed to load property data.");
                setProperty({});
                setEnergy({});
                setRecommendations([]);
              }
            }
          })
          .catch((err) => {
            if (retryCount < MAX_RETRIES) {
              retryCount++;
              setTimeout(fetchData, RETRY_DELAY);
            } else {
              setError(err?.message || "Failed to load property data.");
              setProperty({});
              setEnergy({});
              setRecommendations([]);
            }
          })
          .finally(() => setLoading(false));
      } else {
        setProperty(null);
        setEnergy(null);
        setRecommendations([]);
      }
    };

    fetchData();
  }, [currentAddress]);

  const handleRetry = () => {
    setError(null);
    const postcode = currentAddress?.postcode || currentAddress?.zip;
    if (currentAddress && postcode && currentAddress.address) {
      setLoading(true);
      fetchDashboardEpcData(postcode, currentAddress.address)
        .then((res) => {
          if (res.success && res.data) {
            setProperty(res.data.property || {});
            setEnergy(res.data.energy || {});
            setRecommendations(
              Array.isArray(res.data.recommendations)
                ? res.data.recommendations
                : []
            );
          } else {
            setError(res.message || "Failed to load property data.");
            setProperty({});
            setEnergy({});
            setRecommendations([]);
          }
        })
        .catch((err) => {
          setError(err?.message || "Failed to load property data.");
          setProperty({});
          setEnergy({});
          setRecommendations([]);
        })
        .finally(() => setLoading(false));
    }
  };

  const handleCloseModal = () => {
    setSelectedModal(null);
  };
  return (
    <>
      <Navbar onNavClick={setSelectedModal} />
      <div className="flex flex-col md:flex-row py-10 px-4 md:px-6 xl:px-16 justify-between gap-8 md:gap-4">
        <DashboardCard
          propertyData={property}
          energyData={energy}
        />
        <div className="flex flex-col gap-8">
          {/* Error message */}
          {error && (
            <AddressError
              error={error}
              onRetry={handleRetry}
            />
          )}
          {/* Loading indicator */}
          {loading && (
            <div className="flex justify-center items-center p-4 bg-white rounded-lg shadow mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2 text-gray-600">
                Loading property data...
              </span>
            </div>
          )}
          <div className="flex flex-col md:flex-row md:justify-between gap-9">
            <ValueCard
              title="Current Estimate Value"
              lowValue={"000000"}
              estimate={"000000"}
              highValue={"000000"}
            />
            <ValueCard
              title="Potential Estimate Value"
              lowValue={"000000"}
              estimate={"000000"}
              highValue={"000000"}
              desc
            />
          </div>
          {(!recommendations || recommendations.length === 0) &&
          !loading &&
          !error ? (
            <div className="p-4 bg-white rounded-lg shadow text-center text-gray-500">
              No recommendations available for this address.
            </div>
          ) : null}
          <RecommendationsTable
            data={recommendations}
            addressId={currentAddress?.id}
          />
        </div>
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

export default Dashboard;
