import React from "react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import { useNavigate } from "react-router";

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-16 min-h-[60vh] flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-lg">
          <h1 className="text-3xl font-bold text-green-600 mb-4">
            Payment Successful!
          </h1>
          <p className="mb-6 text-gray-700">
            Thank you for your purchase. Your subscription is now active.
          </p>
          <button
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition-colors"
            onClick={() => navigate("/dashboard")}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}
