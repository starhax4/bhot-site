import React, { useState } from "react";
import Input from "./input";
import ButtonCTA from "./button";
import { submitContactForm } from "../api/serices/api_utils";

const ContactForm = ({ closeModal }) => {
  const [selectedOptions, setSelectedOptions] = useState("data-sources");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());

      //form Submition logic
      const contactData = { option: selectedOptions, ...data };
      const res = await submitContactForm(contactData);
      if (res && res.success) {
        setSuccess(true);
        console.log("Form Submited Successfully");
        // Reset form
        e.target.reset();
        // Close modal after a short delay to show success message
        setTimeout(() => {
          closeModal();
        }, 2000);
      } else {
        setError(res?.message || "Form Submittion Failed. Please try again.");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Contact Form Submittion error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="px-4 md:px-6 py-5 flex justify-between">
      {" "}
      {/* Reduced padding */}
      <div className="hidden md:flex flex-col gap-12 md:justify-between md:w-[30%]">
        {" "}
        {/* Adjusted gap for potentially large spacing */}
        <div>
          <h2 className="text-primary text-2xl md:text-3xl font-semibold">
            Contact Us
          </h2>{" "}
          {/* Reduced heading size */}
        </div>
        <div className="flex flex-col gap-6 mb-20">
          {" "}
          {/* Reduced gap */}
          <div className="flex gap-3 items-center w-[80%]">
            {" "}
            {/* Reduced gap */}
            <img
              src="/email.svg"
              alt="email_icon"
            />
            <p>contact@bhots.co.uk</p>
          </div>
          <div className="flex gap-3 items-center">
            {" "}
            {/* Reduced gap */}
            <img
              src="/location.svg"
              alt="location_pin_icon"
            />
            <p className="text-sm">
              86-90 Paul Street, London, England, United Kingdom, EC2A 4NE
            </p>{" "}
            {/* Ensure text size */}
          </div>
        </div>
      </div>
      <form
        onSubmit={handleContactSubmit}
        className="flex flex-col md:w-[60%] w-full" // Allow form to take more width if left panel is there
      >
        <div className="flex flex-col gap-3">
          {" "}
          {/* Reduced gap */}
          <div className="md:hidden">
            <h2 className="text-primary text-2xl font-semibold">Contact Us</h2>{" "}
            {/* Reduced heading size for mobile */}
          </div>
          <p className="text-primary font-semibold text-sm">
            I’m interested in:
          </p>{" "}
          {/* Reduced text size */}
          <div className="flex gap-2 md:gap-3 flex-wrap mx-auto md:mx-0">
            {" "}
            {/* Reduced gap, align left on md */}
            <button
              type="button"
              onClick={() => {
                setSelectedOptions("data-sources");
              }}
              className={`px-3 py-2 text-xs md:text-base text-primary outline-1 outline-offset-[-1px] outline-primary active:bg-primary active:text-white rounded-[50px] inline-flex justify-center items-center gap-2 overflow-hidden cursor-pointer  ${
                // Reduced padding & text
                selectedOptions === "data-sources"
                  ? "bg-primary text-white"
                  : ""
              }`}
            >
              <p className="text-nowrap">Data Sources</p>
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedOptions("issue-reporting");
              }}
              className={`px-3 py-2 text-xs md:text-base text-primary outline-1 outline-offset-[-1px] outline-primary active:bg-primary active:text-white rounded-[50px] inline-flex justify-center items-center gap-2 overflow-hidden cursor-pointer  ${
                // Reduced padding & text
                selectedOptions === "issue-reporting"
                  ? "bg-primary text-white"
                  : ""
              }`}
            >
              <p className="text-nowrap">Reporting an Issue</p>
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedOptions("finding-contractor");
              }}
              className={`px-3 py-2 text-xs md:text-base text-primary outline-1 outline-offset-[-1px] outline-primary active:bg-primary active:text-white rounded-[50px] inline-flex justify-center items-center gap-2 overflow-hidden cursor-pointer  ${
                // Reduced padding & text
                selectedOptions === "finding-contractor"
                  ? "bg-primary text-white"
                  : ""
              }`}
            >
              <p className="text-nowrap">Finding a Contractor</p>
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedOptions("careers");
              }}
              className={`px-3 py-2 text-xs md:text-base text-primary outline-1 outline-offset-[-1px] outline-primary active:bg-primary active:text-white rounded-[50px] inline-flex justify-center items-center gap-2 overflow-hidden cursor-pointer  ${
                // Reduced padding & text
                selectedOptions === "careers" ? "bg-primary text-white" : ""
              }`}
            >
              <p className="text-nowrap">Careers</p>
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedOptions("other");
              }}
              className={`px-3 py-2 text-xs md:text-base text-primary outline-1 outline-offset-[-1px] outline-primary active:bg-primary active:text-white rounded-[50px] inline-flex justify-center items-center gap-2 overflow-hidden cursor-pointer  ${
                // Reduced padding & text
                selectedOptions === "other" ? "bg-primary text-white" : ""
              }`}
            >
              <p className="text-nowrap">Other</p>
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-4 mt-5">
          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-medium">
                Message sent successfully! We'll get back to you soon.
              </span>
            </div>
          )}
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}{" "}
          {/* Reduced gap and margin */}
          <Input
            label="Your Name"
            name="name"
            required
          />
          <Input
            label="Your Email"
            name="email"
            required
          />
          <div className="flex flex-col gap-2">
            {/* <Input
              label="Your Message"
              name="message"
              
            />
             */}
            <label
              htmlFor="message"
              className="text-gray-500 text-sm" // Added text-sm
            >
              Your Message
            </label>
            <textarea
              name="message"
              id="message"
              required
              className="outline-[1.5px] rounded px-4 py-2 outline-gray-500 h-28 text-sm focus:ring-1 focus:ring-primary" // Reduced height, added text-sm
            ></textarea>
          </div>
          <div>
            <ButtonCTA
              label={success ? "Message Sent!" : "Send message"}
              fullWidth
              submit
              className="rounded-full"
              isLoading={isLoading}
              disabled={success}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
