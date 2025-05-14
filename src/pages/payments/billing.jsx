import React, { useState } from "react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import Modal from "../../components/modal";
import { useNavigate } from "react-router";
import CheckoutStepper from "../../components/payments/checkout-stepper";

export default function BillingPage() {
  const [selectedModal, setSelectedModal] = useState(null);

  const handleCloseModal = () => {
    setSelectedModal(null);
  };
  const navigate = useNavigate();

  const steps = ["Cart", "Billing Information", "Payment", "Confirm"];
  const currentStep = 1; // Billing is the 2nd step (index 1)

  const handleProceed = () => {
    navigate("/checkout/payment");
  };

  const handleBack = () => {
    navigate("/checkout/cart");
  };

  return (
    <>
      <Navbar onNavClick={setSelectedModal} />
      <div className="container mx-auto px-4 py-8 md:h-[83vh]">
        <CheckoutStepper
          steps={steps}
          currentStep={currentStep}
        />

        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Billing Information</h1>

          {/* Placeholder for billing form */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <p className="text-gray-500 mb-4">Billing form would go here</p>

            <button
              onClick={handleProceed}
              className="w-full bg-green-500 text-white py-3 rounded-md font-medium hover:bg-green-600 transition-colors"
            >
              Continue to Payment
            </button>
          </div>
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
}
