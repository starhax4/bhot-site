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

const dummyData = [
  {
    id: "1",
    measure: "Internal Wall Insulation",
    cost: "£4,000 - £14,000",
    yearlySaving: "£271",
    epcImpact: "+ 8 pts",
    estimatedValueImpact: "£20,000 - £40,000",
    totalPaybackPeriod: "0.5 years",
  },
  {
    id: "2",
    measure: "Solar Water Heating",
    cost: "£4,000 - £6,000",
    yearlySaving: "£55",
    epcImpact: "+ 2 pts",
    estimatedValueImpact: "Upgrade to unlock",
    locked: true,
  },
  {
    id: "3",
    measure: "Solar Electricity System",
    cost: "£6,000 - £8,000",
    yearlySaving: "£100",
    epcImpact: "+ 3 pts",
    estimatedValueImpact: "Upgrade to unlock",
    locked: true,
  },
  // Add more dummy data rows here if needed
];

const Dashboard = () => {
  const [selectedModal, setSelectedModal] = useState(null);
  const { user, currentAddress } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [valueData, setValueData] = useState({
    current: {
      lowValue: "xxx,xxx",
      estimate: "xxx,xxx",
      highValue: "xxx,xxx",
    },
    potential: {
      lowValue: "yyy,yyy",
      estimate: "yyy,yyy",
      highValue: "yyy,yyy",
    },
  });

  // Update value data when currentAddress changes
  useEffect(() => {
    if (currentAddress) {
      setLoading(true);
      setError(null);

      // Simulate API call with a small delay
      setTimeout(() => {
        try {
          // In a real app, this would fetch data from API based on current address
          // For now, we'll just generate some random values to simulate
          const generateValue = () => {
            const base = 200000 + Math.floor(Math.random() * 50000);
            return {
              lowValue: (base - 20000).toLocaleString(),
              estimate: base.toLocaleString(),
              highValue: (base + 20000).toLocaleString(),
            };
          };

          setValueData({
            current: generateValue(),
            potential: {
              lowValue: (
                parseInt(generateValue().estimate.replace(/,/g, "")) + 40000
              ).toLocaleString(),
              estimate: (
                parseInt(generateValue().estimate.replace(/,/g, "")) + 60000
              ).toLocaleString(),
              highValue: (
                parseInt(generateValue().estimate.replace(/,/g, "")) + 80000
              ).toLocaleString(),
            },
          });
          setLoading(false);
        } catch (err) {
          // Simulate error handling - In a real app, this would handle API errors
          // We'll introduce a "fake" error sometimes for testing
          if (Math.random() < 0.1) {
            // 10% chance of error for testing
            setError("Failed to load property data. Please try again.");
          }
          setLoading(false);
        }
      }, 500); // Simulate a short API delay
    }
  }, [currentAddress]);

  const handleRetry = () => {
    // Clear error and force a refresh of the data
    setError(null);
    // This will retrigger the useEffect if we had an error with the current address
    if (currentAddress) {
      const tempAddress = { ...currentAddress };
      setLoading(true);
      setTimeout(() => {
        // Reset loading to trigger effect
        setLoading(false);
      }, 10);
    }
  };

  const handleCloseModal = () => {
    setSelectedModal(null);
  };
  return (
    <>
      <Navbar onNavClick={setSelectedModal} />
      <div className="flex flex-col md:flex-row py-10 px-4 md:px-14 justify-between gap-8 md:gap-0">
        <DashboardCard />
        <div className="flex flex-col gap-12">
          {user && user.plan === "Pro" ? (
            <></>
          ) : user ? (
            <div className="bg-[#F8FAFC] border border-gray-100 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-gray-700 font-bold mr-2">
                    Basic Plan
                  </span>
                  <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                    Active
                  </span>
                </div>
                <div>
                  <a
                    href="/pricing"
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Upgrade to Pro
                  </a>
                </div>
              </div>
            </div>
          ) : null}

          {/* Mobile address selector for pro users */}
          {/* <div className="md:hidden">
            {user && user.plan === "Pro" && <AddressSelector />}
          </div> */}

          {/* Display error message if there's an error */}
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

          <div className="flex flex-col md:flex-row gap-9">
            <ValueCard
              title="Current Value Estimate"
              lowValue={valueData.current.lowValue}
              estimate={valueData.current.estimate}
              highValue={valueData.current.highValue}
            />
            <ValueCard
              title="Potential Value Estimate"
              lowValue={valueData.potential.lowValue}
              estimate={valueData.potential.estimate}
              highValue={valueData.potential.highValue}
              desc
            />
          </div>
          <RecommendationsTable
            data={dummyData}
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
