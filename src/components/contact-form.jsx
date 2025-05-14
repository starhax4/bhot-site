import React, { useState } from "react";
import Input from "./input";
import ButtonCTA from "./button";

const ContactForm = ({ closeModal }) => {
  const [selectedOptions, setSelectedOptions] = useState("data-sources");
  const [isLoading, setIsLoading] = useState(false);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    //form Submition logic
    console.log({ option: selectedOptions, ...data });

    closeModal();
  };
  return (
    <div className="px-6 py-8 flex justify-between">
      <div className="hidden md:flex flex-col gap-[324px]">
        <div>
          <h2 className="text-primary text-5xl font-bold">Contact Us</h2>
        </div>
        <div className="flex flex-col gap-9">
          <div className="flex gap-4">
            <img
              src="/email.svg"
              alt="email_icon"
            />
            <p>contact@bhots.co.uk</p>
          </div>
          <div className="flex gap-4">
            <img
              src="/location.svg"
              alt="location_pin_icon"
            />
            <p>86-90 Paul Street, London, England, United Kingdom, EC2A 4NE</p>
          </div>
        </div>
      </div>
      <form
        onSubmit={handleContactSubmit}
        className="flex flex-col"
      >
        <div className="flex flex-col gap-4">
          <div className="md:hidden">
            <h2 className="text-primary text-5xl font-bold">Contact Us</h2>
          </div>
          <p className="text-primary font-semibold">I’m interested in:</p>
          <div className="flex gap-5 flex-wrap mx-auto">
            <button
              type="button"
              onClick={() => {
                setSelectedOptions("data-sources");
              }}
              className={`px-4 py-2 md:px-5 md:py-2.5 text-primary outline-2 outline-offset-[-1px] outline-primary active:bg-primary active:text-white rounded-[50px] inline-flex justify-center items-center gap-2 overflow-hidden cursor-pointer  ${
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
                setSelectedOptions("careers");
              }}
              className={`px-4 py-2 md:px-5 md:py-2.5 text-primary outline-2 outline-offset-[-1px] outline-primary active:bg-primary active:text-white rounded-[50px] inline-flex justify-center items-center gap-2 overflow-hidden cursor-pointer  ${
                selectedOptions === "careers" ? "bg-primary text-white" : ""
              }`}
            >
              <p className="text-nowrap">Careers</p>
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedOptions("issue-reporting");
              }}
              className={`px-4 py-2 md:px-5 md:py-2.5 text-primary outline-2 outline-offset-[-1px] outline-primary active:bg-primary active:text-white rounded-[50px] inline-flex justify-center items-center gap-2 overflow-hidden cursor-pointer  ${
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
                setSelectedOptions("other");
              }}
              className={`px-4 py-2 md:px-5 md:py-2.5 text-primary outline-2 outline-offset-[-1px] outline-primary active:bg-primary active:text-white rounded-[50px] inline-flex justify-center items-center gap-2 overflow-hidden cursor-pointer  ${
                selectedOptions === "other" ? "bg-primary text-white" : ""
              }`}
            >
              <p className="text-nowrap">Other</p>
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedOptions("finding-contractor");
              }}
              className={`px-4 py-2 md:px-5 md:py-2.5 text-primary outline-2 outline-offset-[-1px] outline-primary active:bg-primary active:text-white rounded-[50px] inline-flex justify-center items-center gap-2 overflow-hidden cursor-pointer  ${
                selectedOptions === "finding-contractor"
                  ? "bg-primary text-white"
                  : ""
              }`}
            >
              <p className="text-nowrap">Finding a Contractor</p>
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-8 mt-8">
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
              className="py-44"
            /> */}
            <label
              htmlFor="message"
              className="text-gray-500"
            >
              Your Message
            </label>
            <textarea
              name="message"
              id="message"
              required
              className="outline-2 rounded px-4 py-2 outline-gray-300 h-32"
            ></textarea>
          </div>
          <div>
            <ButtonCTA
              label="Send message"
              fullWidth
              submit
              className="rounded-full"
              isLoading={isLoading}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
