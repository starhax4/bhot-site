import React, { useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import Hero from "../components/home/hero";
import Brand from "../components/home/brands";
import Modal from "../components/modal";

const Home = () => {
  const [selectedModal, setSelectedModal] = useState(null);

  const handleCloseModal = () => {
    setSelectedModal(null);
  };

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
      />
    </>
  );
};

export default Home;
