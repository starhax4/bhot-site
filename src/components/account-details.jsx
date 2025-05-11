import React, { useState } from "react";
import Input from "./input";
import ButtonCTA from "./button";
import { Link } from "react-router";

const AccountDetails = ({ closeModal }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const closeAccountModal = () => {
    closeModal();
  };

  return (
    <div className="w-full px-12 py-8 ">
      <div className="flex flex-col">
        <div>
          <div>
            <h2 className="text-primary text-5xl font-bold">My Account</h2>
          </div>
          <div className="flex flex-col gap-6 mt-8">
            <div className="grid md:grid-cols-2 gap-8">
              <Input
                label="First Name"
                name="first-name"
                placeHolder="John "
                className="mt-3.5 bg-[#F9F9F9]"
                labelClassName="text-black"
                disabled={!isAuthenticated}
              />
              <Input
                label="Last Name"
                name="last-name"
                placeHolder="Smith"
                className="mt-3.5 bg-[#F9F9F9]"
                labelClassName="text-black"
                disabled={!isAuthenticated}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <Input
                label="Email"
                name="email"
                placeHolder="example@gmail.com"
                className="mt-3.5 bg-[#F9F9F9]"
                disabled={!isAuthenticated}
              />
              <Input
                label="Password"
                name="password"
                placeHolder="********"
                disabled={!isAuthenticated}
                className="mt-3.5 bg-[#F9F9F9]"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <Input
                label="Property(ies)"
                name="property"
                placeHolder="1, First Street, City, AB12 3CD"
                disabled={!isAuthenticated}
                className="mt-3.5 bg-[#F9F9F9]"
              />
              <Input
                label="Plan"
                name="plan"
                placeHolder="Basic"
                disabled={!isAuthenticated}
                className="mt-3.5 bg-[#F9F9F9]"
              />
            </div>
            <div className="flex justify-center mt-36">
              <span
                className="text-center cursor-pointer font-medium hover:text-primary"
                onClick={closeAccountModal}
              >
                Close your account
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;
