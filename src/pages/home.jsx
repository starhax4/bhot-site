import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import Hero from "../components/home/hero";
import Brand from "../components/home/brands";
import Modal from "../components/modal";
import { useAuth } from "../context/auth/AuthContext";

const Home = () => {
  const [selectedModal, setSelectedModal] = useState(null);
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, loading, navigate]);

  const handleCloseModal = () => {
    setSelectedModal(null);
  };

  // Show loading or nothing while checking auth status
  if (loading) {
    return null;
  }

  // Don't render home page content if user is authenticated (will redirect)
  if (isAuthenticated) {
    return null;
  }

  return (
    <>
      <Navbar onNavClick={setSelectedModal} />
      <Hero onCtaClick={setSelectedModal} />
      <Brand />
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

export default Home;
