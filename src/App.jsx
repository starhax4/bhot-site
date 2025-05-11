import { Routes, Route } from "react-router";
import Home from "./pages/home";
import Terms from "./pages/terms";
import Privacy from "./pages/privacy";

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
      </Routes>
    </>
  );
}

export default App;
