import React, { useState, useEffect } from "react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import Modal from "../../components/modal";
import { useNavigate } from "react-router";
import CheckoutStepper from "../../components/payments/checkout-stepper";
import { usePlan } from "../../context/plan-context";
import { useAuth } from "../../context/auth/AuthContext";

const CartPage = () => {
  const [selectedModal, setSelectedModal] = useState(null);
  const { selectedPlan } = usePlan();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem("redirectAfterLogin", "/checkout/cart");
      window.dispatchEvent(new CustomEvent("open-login-modal"));
    }
  }, [isAuthenticated]);

  const handleCloseModal = () => {
    setSelectedModal(null);
  };

  const steps = ["Cart", "Billing Information", "Payment", "Confirm"];
  const currentStep = 0; // Cart is the 1st step (index 0)

  const handleProceed = () => {
    navigate("/checkout/billing");
  };

  if (!isAuthenticated) return null;

  return (
    <>
      <Navbar onNavClick={setSelectedModal} />
      <div
        className="container mx-auto px-4 py-8 "
        style={{ minHeight: "calc(100vh - 152px)" }}
      >
        <CheckoutStepper
          steps={steps}
          currentStep={currentStep}
        />

        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            {selectedPlan ? (
              <>
                <div className="mb-4">
                  <div className="font-semibold">Selected Plan:</div>
                  <div>
                    {selectedPlan.name} ({selectedPlan.id})
                  </div>
                </div>
                <div className="mb-4">
                  <div className="font-semibold">User ID:</div>
                  <div>{user?.id || "Not logged in"}</div>
                </div>
              </>
            ) : (
              <p className="text-red-500 mb-4">
                No plan selected. Please go back to pricing.
              </p>
            )}
            <button
              onClick={handleProceed}
              className="w-full bg-green-500 text-white py-3 rounded-md font-medium hover:bg-green-600 transition-colors"
              disabled={!selectedPlan}
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
