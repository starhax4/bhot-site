import { Routes, Route } from "react-router";
import Home from "./pages/home";
import Terms from "./pages/terms";
import Privacy from "./pages/privacy";
import Dashboard from "./pages/dashboard";
import Pricing from "./pages/pricing";
import Admin from "./pages/admin";

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
      </Routes>
    </>
  );
}

export default App;
