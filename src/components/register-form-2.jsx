import React, { useState } from "react";
import Input from "./input";
import ButtonCTA from "./button";
import { Link, useNavigate } from "react-router";

const RegisterForm2 = ({ closeModal }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    //form Submition logic
    // closeModal();
    navigate("/dashboard");
  };

  return (
    <div className="w-full px-4 md:px-12 py-8 ">
      <form
        onSubmit={handleRegisterSubmit}
        className="flex flex-col"
      >
        <div>
          <div>
            <h2 className="text-primary text-5xl font-bold">Register</h2>
            <h4 className="w-full flex md:justify-end font-semibold text-xl">
              Step 2 of 2: Your Property
            </h4>
          </div>
          <div className="flex flex-col gap-[270px] mt-8">
            <div className="flex flex-col gap-6">
              <Input
                label="PostCode"
                name="zip-code"
                placeHolder="AB12 3CD"
                className=""
                required
              />
              <Input
                label="Select Adress"
                name="adress"
                placeHolder=""
                required
              />
            </div>

            <div>
              <ButtonCTA
                label="Go to Dashboard"
                fullWidth
                submit
                className=""
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm2;
