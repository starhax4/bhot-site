import React, { useState } from "react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import Modal from "../../components/modal";
import { useNavigate } from "react-router";
import CheckoutStepper from "../../components/payments/checkout-stepper";
import { usePlan } from "../../context/plan-context";
import { useAuth } from "../../context/auth/AuthContext";
import { createStripeSubscription } from "../../api/serices/api_utils";

export default function ConfirmPage() {
  const [selectedModal, setSelectedModal] = useState(null);
  const { selectedPlan } = usePlan();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const steps = ["Cart", "Billing Information", "Payment", "Confirm"];
  const currentStep = 3; // Confirm is the 4th step (index 3)

  const handleCloseModal = () => {
    setSelectedModal(null);
  };

  const handleBack = () => {
    navigate("/checkout/payment");
  };

  const handlePlaceOrder = async () => {
    setError("");
    setLoading(true);
    if (!selectedPlan || !user?.id) {
      setError("Missing plan or user information.");
      setLoading(false);
      return;
    }
    const res = await createStripeSubscription(selectedPlan.id, user.id);
    setLoading(false);
    if (res.success && res.url) {
      window.location.href = res.url;
    } else {
      setError(res.message || "Failed to initiate payment. Please try again.");
    }
  };

  // Handle Stripe redirect success/cancel
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success")) {
      navigate("/payments/success");
    } else if (params.get("cancel")) {
      navigate("/payments/cancel");
    }
  }, [navigate]);

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
            <p className="text-gray-500 mb-4">Order summary would go here</p>
            {error && (
              <div className="text-red-600 mb-4 text-center">{error}</div>
            )}
            <button
              onClick={handlePlaceOrder}
              className="w-full bg-green-500 text-white py-3 rounded-md font-medium hover:bg-green-600 transition-colors"
              disabled={!selectedPlan || loading}
            >
              {loading ? "Redirecting to Payment..." : "Place Order"}
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
