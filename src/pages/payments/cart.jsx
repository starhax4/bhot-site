import React, { useState } from "react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import Modal from "../../components/modal";
import { useNavigate } from "react-router";
import CheckoutStepper from "../../components/payments/checkout-stepper";

const CartPage = () => {
  const [selectedModal, setSelectedModal] = useState(null);

  const handleCloseModal = () => {
    setSelectedModal(null);
  };
  const navigate = useNavigate();

  const steps = ["Cart", "Billing Information", "Payment", "Confirm"];
  const currentStep = 0; // Cart is the 1st step (index 0)

  const handleProceed = () => {
    navigate("/checkout/billing");
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
          <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

          {/* Placeholder for cart items */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <p className="text-gray-500 mb-4">Cart items would go here</p>

            <button
              onClick={handleProceed}
              className="w-full bg-green-500 text-white py-3 rounded-md font-medium hover:bg-green-600 transition-colors"
            >
              Continue to Billing
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
};

export default CartPage;
