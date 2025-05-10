import React from "react";
import ContactForm from "./contact-form";
const Modal = ({ open, onClose, contentType, className }) => {
  if (!open) return null;

  const getContent = () => {
    switch (contentType) {
      case "contact":
        return <ContactForm />;
      case "account":
        return <p>Account</p>;
      case "cta":
        return <p>Our Services CTA</p>;
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
          onClick={() => {
            onClose({
              contact: false,
              register: false,
              login: false,
              account: false,
            });
          }}
          className="w-[100vw] h-[100vh] fixed  inset-0 bg-white/75 duration-75 transition-opacity ease-in"
        ></div>
        <div
          className={`relative w-[65vw] h-[95vh] bg-white rounded-3xl border-2 border-neutral-400 z-50 ${
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
