import React, { useState } from "react";
import Input from "./input";
import ButtonCTA from "./button";
import { Link } from "react-router";
import SelectInput from "./select-input";

const AccountDetails = ({ closeModal }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "example@gmail.com",
    password: "Password1234",
    property: "1, First Street, City, AB12 3CD",
    plan: "Basic",
  });

  const closeAccountModal = () => {
    closeModal();
  };

  const handleDataChange = () => {};

  return (
    <div className="w-full px-12 py-8 ">
      <div className="flex flex-col">
        <div>
          <div>
            <h2 className="text-primary text-2xl md:text-3xl font-semibold">My Account</h2>
          </div>
          <div className="flex flex-col gap-6 mt-8">
            <div className="grid md:grid-cols-2 gap-8">
              <Input
                label="First Name"
                name="first-name"
                value={userData.firstName}
                onChange={handleDataChange}
                className="mt-3.5 bg-[#F9F9F9]"
                disabled={!isAuthenticated}
              />
              <Input
                label="Last Name"
                name="last-name"
                value={userData.lastName}
                onChange={handleDataChange}
                className="mt-3.5 bg-[#F9F9F9]"
                disabled={!isAuthenticated}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <Input
                label="Email"
                name="email"
                value={userData.email}
                onChange={handleDataChange}
                className="mt-3.5 bg-[#F9F9F9]"
                disabled={!isAuthenticated}
              />
              <Input
                label="Password"
                name="password"
                type="password"
                value={userData.password}
                onChange={handleDataChange}
                disabled={!isAuthenticated}
                className="mt-3.5 bg-[#F9F9F9]"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <SelectInput
                label="Property(ies)"
                name="property"
                value={userData.property}
                // options={}
                searchEnabled={true}
                disabled={!isAuthenticated}
                className="mt-3.5 bg-[#F9F9F9]"
              />
              <SelectInput
                label="Plan"
                name="plan"
                defaultValue={"Basic"}
                searchEnabled={false}
                options={[
                  { label: "Basic", value: "basic" },
                  { label: "Pro", value: "pro" },
                ]}
                // disabled={!isAuthenticated}
                className="mt-3.5 bg-[#F9F9F9]"
              />
            </div>
            <div className="flex justify-center mt-32">
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
