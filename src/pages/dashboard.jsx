import React, { useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import DashboardCard from "../components/dashboard/dashboard-overview";
import Modal from "../components/modal";
import RecomendationTable from "../components/dashboard/recomendation-table";
import ValueCard from "../components/dashboard/value-card";
import RecommendationsTable from "../components/dashboard/recomendation-table";

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
  // Add more dummy data rows here if needed
];

const Dashboard = () => {
  const [selectedModal, setSelectedModal] = useState(null);

  const handleCloseModal = () => {
    setSelectedModal(null);
  };
  return (
    <>
      <Navbar onNavClick={setSelectedModal} />
      <div className="flex flex-col md:flex-row py-14 px-4 md:px-14 justify-between gap-8 md:gap-0">
        <DashboardCard />
        <div className="flex flex-col  gap-16">
          <div className="flex flex-col md:flex-row gap-9">
            <ValueCard title="Current Value Estimate" />
            <ValueCard
              title="Potential Value Estimate"
              desc
            />
          </div>
          <RecommendationsTable data={dummyData} />
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
