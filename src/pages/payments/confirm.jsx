import React, { useState } from "react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import Modal from "../../components/modal";
import { useNavigate } from "react-router";
import CheckoutStepper from "../../components/payments/checkout-stepper";

export default function ConfirmPage() {
  const [selectedModal, setSelectedModal] = useState(null);

  const handleCloseModal = () => {
    setSelectedModal(null);
  };
  const navigate = useNavigate();

  const steps = ["Cart", "Billing Information", "Payment", "Confirm"];
  const currentStep = 3; // Confirm is the 4th step (index 3)

  const handleBack = () => {
    navigate("/checkout/payment");
  };

  const handlePlaceOrder = () => {
    // Handle order placement
    alert("Order placed successfully!");
    navigate("/dashboard");
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
          <h1 className="text-2xl font-bold mb-6">Confirm Your Order</h1>

          {/* Placeholder for order summary */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <p className="text-gray-500 mb-4">Order summary would go here</p>

            <button
              onClick={handlePlaceOrder}
              className="w-full bg-green-500 text-white py-3 rounded-md font-medium hover:bg-green-600 transition-colors"
            >
              Place Order
            </button>
          </div>

          <button
            onClick={handleBack}
            className="text-gray-700 font-medium"
          >
            Back to Payment
          </button>
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
