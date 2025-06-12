import React, { useState, useEffect } from "react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import Modal from "../../components/modal";
import { useNavigate } from "react-router";
import CheckoutStepper from "../../components/payments/checkout-stepper";
import PaymentSection from "../../components/payments/payment-section";
import { useAuth } from "../../context/auth/AuthContext";

export default function PaymentPage() {
  const [selectedModal, setSelectedModal] = useState(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const steps = ["Cart", "Billing Information", "Payment", "Confirm"];
  const currentStep = 2; // Payment is the 3rd step (index 2)

  const handleProceed = () => {
    navigate("/checkout/confirm");
  };

  const handleBack = () => {
    navigate("/checkout/billing");
  };

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem("redirectAfterLogin", "/checkout/payment");
      window.dispatchEvent(new CustomEvent("open-login-modal"));
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  const handleCloseModal = () => {
    setSelectedModal(null);
  };

  return (
    <>
      <Navbar onNavClick={setSelectedModal} />
      <div className="container mx-auto px-4 py-8 md:mb-30">
        <CheckoutStepper
          steps={steps}
          currentStep={currentStep}
        />

        <PaymentSection
          onProceed={handleProceed}
          onBack={handleBack}
        />
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
