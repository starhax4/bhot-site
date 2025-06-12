import { Routes, Route } from "react-router";
import Home from "./pages/home";
import Terms from "./pages/terms";
import Privacy from "./pages/privacy";
import Dashboard from "./pages/dashboard";
import Pricing from "./pages/pricing";
import Admin from "./pages/admin";

import BillingPage from "./pages/payments/billing";
import PaymentPage from "./pages/payments/payment";
import ConfirmPage from "./pages/payments/confirm";
import CartPage from "./pages/payments/cart";
import ResetPasswordPage from "./pages/reset-password";
import { useAuth } from "./context/auth/AuthContext";
import { useState } from "react";
import Modal from "./components/modal";
import { PlanProvider } from "./context/plan-context";
import PaymentSuccessPage from "./pages/payments/success";
import PaymentCancelPage from "./pages/payments/cancel";

function App() {
  const [modalType, setModalType] = useState(null);
  const { isAuthenticated, loading } = useAuth();

  function PrivateRoute({ children }) {
    if (loading) return null;
    if (!isAuthenticated) {
      if (modalType !== "login") setModalType("login");
      // Always keep modal open until successful login
      return null;
    }
    return children;
  }

  return (
    <PlanProvider>
      <Routes>
        <Route
          path="/"
          element={<Home />}
        />
        <Route
          path="/terms"
          element={<Terms />}
        />
        <Route
          path="/privacy-policy"
          element={<Privacy />}
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={<Admin />}
        />
        <Route
          path="/pricing"
          element={<Pricing />}
        />

        <Route
          path="/checkout/cart"
          element={<CartPage />}
        />
        <Route
          path="/checkout/billing"
          element={<BillingPage />}
        />
        <Route
          path="/checkout/payment"
          element={<PaymentPage />}
        />
        <Route
          path="/checkout/confirm"
          element={<ConfirmPage />}
        />
        <Route
          path="/reset-password/:token"
          element={<ResetPasswordPage />}
        />
        <Route
          path="/payments/success"
          element={<PaymentSuccessPage />}
        />
        <Route
          path="/payments/cancel"
          element={<PaymentCancelPage />}
        />
      </Routes>
      <Modal
        open={!!modalType}
        contentType={modalType}
        onClose={() => setModalType(null)}
        selectedModal={setModalType}
      />
    </PlanProvider>
  );
}

export default App;
