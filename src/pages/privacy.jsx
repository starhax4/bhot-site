import React, { useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import Modal from "../components/modal";
import PrivacyText from "../components/privacy-text";

const Privacy = () => {
  const [selectedModal, setSelectedModal] = useState(null);

  const handleCloseModal = () => {
    setSelectedModal(null);
  };

  return (
    <>
      <Navbar onNavClick={setSelectedModal} />
      <PrivacyText />
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

export default Privacy;
