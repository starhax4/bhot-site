import React, { useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import Modal from "../components/modal";
import PricingTable from "../components/payments/pricing-table";

const Pricing = () => {
  const [selectedModal, setSelectedModal] = useState(null);

  const handleCloseModal = () => {
    setSelectedModal(null);
  };

  return (
    <>
      <Navbar onNavClick={setSelectedModal} />
      <div className="mb-23">
        <PricingTable />
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

export default Pricing;
