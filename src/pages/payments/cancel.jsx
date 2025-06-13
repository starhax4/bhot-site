import React from "react";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import { useNavigate } from "react-router";

export default function PaymentCancelPage() {
  const navigate = useNavigate();
  return (
    <>
      <Navbar />
      <div
        className="container mx-auto px-4 py-16  flex flex-col items-center justify-center"
        style={{ minHeight: "calc(100vh - 152px)" }}
      >
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-lg">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            Payment Cancelled
          </h1>
          <p className="mb-6 text-gray-700">
            Your payment was cancelled. No changes have been made to your
            account.
          </p>
          <button
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition-colors"
            onClick={() => navigate("/checkout/confirm")}
          >
            Try Again
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}
