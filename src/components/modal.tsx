import React from "react";
import ContactForm from "./contact-form";
import RegisterForm from "./register-form";
import RegisterForm2 from "./register-form-2";
import LoginForm from "./login-form";
import AccountDetails from "./account-details";
const Modal = ({ open, onClose, contentType, className, selectedModal }) => {
  if (!open) return null;

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
    <div>
      <dialog
        open={open}
        onClose={onClose}
        className="absolute mx-auto top-36 overflow-x-hidden"
      >
        <div
          onClick={onClose}
          className="w-[100vw] h-[100vh] fixed  inset-0 bg-white/75 duration-75 transition-opacity ease-in"
        ></div>
        <div
          className={`relative w-[90vw] md:w-[65vw] min-h-[95vh] bg-white rounded-3xl border-2 border-neutral-400 z-50 ${
            className && className
          }`}
        >
          {getContent()}
        </div>
      </dialog>
    </div>
  );
};

export default Modal;
