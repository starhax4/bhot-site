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
  const [value, setValue] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    let retryCount = 0;
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 2000; // 2 seconds
    let did404 = false;

    const fetchData = () => {
      if (did404) return; // Prevent further retries if 404 encountered
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
              setValue(res.data.value || {});
            } else if (
              res.status === 404 ||
              res.message?.toLowerCase().includes("not found")
            ) {
              // Stop retrying on 404
              did404 = true;
              setError(
                "Address not found. Please check the address or select another from your portfolio."
              );
              setProperty({ notFound: true });
              setEnergy({});
              setRecommendations([]);
              setValue({});
            } else {
              if (retryCount < MAX_RETRIES) {
                retryCount++;
                setTimeout(fetchData, RETRY_DELAY);
              } else {
                setError(res.message || "Failed to load property data.");
                setProperty({});
                setEnergy({});
                setRecommendations([]);
                setValue({});
              }
            }
          })
          .catch((err) => {
            if (
              err?.response?.status === 404 ||
              err?.message?.toLowerCase().includes("not found")
            ) {
              did404 = true;
              setError(
                "Address not found. Please check the address or select another from your portfolio."
              );
              setProperty({ notFound: true });
              setEnergy({});
              setRecommendations([]);
              setValue({});
            } else if (retryCount < MAX_RETRIES) {
              retryCount++;
              setTimeout(fetchData, RETRY_DELAY);
            } else {
              setError(err?.message || "Failed to load property data.");
              setProperty({});
              setEnergy({});
              setRecommendations([]);
              setValue({});
            }
          })
          .finally(() => setLoading(false));
      } else {
        setProperty(null);
        setEnergy(null);
        setRecommendations([]);
        setValue({});
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
            setValue(res.data.value || {});
          } else {
            setError(res.message || "Failed to load property data.");
            setProperty({});
            setEnergy({});
            setRecommendations([]);
            setValue({});
          }
        })
        .catch((err) => {
          setError(err?.message || "Failed to load property data.");
          setProperty({});
          setEnergy({});
          setRecommendations([]);
          setValue({});
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
            {/* <ValueCard
              title="Current Estimate Value"
              lowValue={value.current_estimate_value.low}
              estimate={value.current_estimate_value.estimate}
              highValue={value.current_estimate_value.low}
            /> */}
            <ValueCard
              title="Potential Value Uplift"
              lowValue={
                value && value.potential_value_uplift
                  ? value.potential_value_uplift.low
                  : "000000"
              }
              estimate={
                value && value.potential_value_uplift
                  ? value.potential_value_uplift.estimate
                  : "000000"
              }
              highValue={
                value && value.potential_value_uplift
                  ? value.potential_value_uplift.high
                  : "000000"
              }
              desc
            />
          </div>
          {(!recommendations || recommendations.length === 0) &&
          !loading &&
          !error &&
          property &&
          !property.notFound ? (
            <div className="p-6 bg-white rounded-lg shadow text-center">
              <div className="mb-3">
                <svg
                  className="w-12 h-12 mx-auto text-green-500 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Great News!
              </h3>
              <p className="text-gray-600 mb-4">
                Your property is already performing well in terms of energy
                efficiency. No immediate recommendations are needed at this
                time.
              </p>
              <p className="text-sm text-gray-500">
                We'll continue to monitor for future improvement opportunities.
              </p>
            </div>
          ) : (!recommendations || recommendations.length === 0) &&
            !loading &&
            !error ? (
            <div className="p-4 bg-white rounded-lg shadow text-center text-gray-500">
              No recommendations available for this address.
            </div>
          ) : null}
          {recommendations && recommendations.length > 0 && (
            <RecommendationsTable
              data={recommendations}
              addressId={currentAddress?.id}
            />
          )}
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
