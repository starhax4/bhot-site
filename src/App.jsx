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

function App() {
  return (
    <>
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
          element={<Dashboard />}
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
      </Routes>
    </>
  );
}

export default App;
