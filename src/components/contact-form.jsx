import React from "react";

const ContactForm = () => {
  return (
    <div className="px-6 flex justify-between">
      <div className="flex flex-col justify-between gap-[300px]">
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
        action=""
        method="post"
        className="flex flex-col"
      >
        <div>
          <p className="text-primary font-semibold">I’m interested in:</p>
          <div className="flex gap-5 flex-wrap">
            <div className="px-5 py-2.5 text-primary outline-1 outline-offset-[-1px] outline-green-950 active:bg-primary active:text-white rounded-[50px] inline-flex justify-center items-center gap-2 overflow-hidden">
              <p className="text-nowrap">Data Sources</p>
            </div>
            <div className="px-5 py-2.5 text-primary outline-1 outline-offset-[-1px] outline-green-950 active:bg-[#176b87] active:text-white rounded-[50px] inline-flex justify-center items-center gap-2 overflow-hidden">
              <p className="text-nowrap">Reporting an Issue</p>
            </div>
            <div className="px-5 py-2.5 text-primary outline-1 outline-offset-[-1px] outline-green-950 active:bg-primary active:text-white rounded-[50px] inline-flex justify-center items-center gap-2 overflow-hidden">
              <p className="text-nowrap">Finding a Contractor</p>
            </div>
            <div className="px-5 py-2.5 text-primary outline-1 outline-offset-[-1px] outline-green-950 active:bg-primary active:text-white rounded-[50px] inline-flex justify-center items-center gap-2 overflow-hidden">
              <p className="text-nowrap">Careers</p>
            </div>
            <div className="px-5 py-2.5 text-primary outline-1 outline-offset-[-1px] outline-green-950 active:bg-primary active:text-white rounded-[50px] inline-flex justify-center items-center gap-2 overflow-hidden">
              <p className="text-nowrap">Other</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
