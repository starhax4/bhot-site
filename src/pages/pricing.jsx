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
      <main className="px-4 md:px-14 py-4 md:py- text-gray-700">
        <div className="mb-8  w-[60vw] text-center mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">
            Launch Pricing
          </h2>
          <p className="text-sm font-medium leading-relaxed mb-4">
            We are currently in our launch phase and offering one-off pricing to
            keep things simple as we grow. Prices reflect our early-stage
            product, and your feedback will help shape what comes next.
          </p>
          <p className="text-sm font-medium leading-relaxed mb-4">
            As we add more features (such as ongoing energy tracking, access
            vetted contractors and tradespeople), we will introduce a monthly
            subscription model. But for now, you get full access to the features
            below with a one-off payment.
          </p>
          <p className="text-sm font-medium leading-relaxed">
            We would love to hear your feedback{" "}
            <button
              onClick={() => setSelectedModal("contact")}
              className="text-primary hover:underline font-semibold"
            >
              here!
            </button>
          </p>
        </div>
        <PricingTable />
      </main>
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
