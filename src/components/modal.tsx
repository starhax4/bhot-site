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
        <div className="flex justify-center">
          <div className="absolute mx-auto top-36 overflow-x-hidden">
            {/* Overlay */}
            <motion.div
              onClick={onClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-white/75"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className={`relative z-50 w-[90vw] mx-auto md:w-[65vw] h-[90vh] bg-white rounded-3xl border-2 border-neutral-400 ${
                className || ""
              }`}
            >
              {getContent()}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
