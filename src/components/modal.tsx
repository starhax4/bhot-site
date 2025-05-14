import React from "react";
import { motion, AnimatePresence } from "motion/react";
import ContactForm from "./contact-form";
import RegisterForm from "./register-form";
import RegisterForm2 from "./register-form-2";
import LoginForm from "./login-form";
import AccountDetails from "./account-details";

const Modal = ({ open, onClose, contentType, className, selectedModal }) => {
  const getContent = () => {
    switch (contentType) {
      case "contact":
        return <ContactForm closeModal={onClose} />;
      case "account":
        return <AccountDetails closeModal={onClose} />;
      case "cta":
        return (
          <RegisterForm
            closeModal={onClose}
            nextModal={selectedModal}
          />
        );
      case "register-2":
        return <RegisterForm2 closeModal={onClose} />;
      case "login":
        return (
          <LoginForm
            closeModal={onClose}
            nextModal={selectedModal}
          />
        );
      default:
        return <p>Default Content</p>;
    }
  };

  return (
    <AnimatePresence>
      {open && (
        // Root Fixed Container: Covers viewport, centers content, handles overall modal visibility animation.
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4" // High z-index, flex centering, padding
        >
          {/* Overlay: Sibling to Modal Box, covers the entire Root Fixed Container. */}
          <div
            onClick={onClose}
            className="absolute inset-0 bg-white/70" // Covers parent, darkens background
          />

          {/* Modal Box: Actual modal content, animated, scrollable if content overflows. */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`relative z-[10] bg-white rounded-3xl border-2 border-neutral-400 w-[90vw] md:w-[65vw] max-h-[90vh] overflow-y-hidden shadow-xl ${
              className || ""
            }`}
          >
            {getContent()}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
