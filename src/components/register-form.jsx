import React, { useState } from "react";
import Input from "./input";
import ButtonCTA from "./button";
import { Link } from "react-router";

const RegisterForm = ({ closeModal, nextModal }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    //form Submition logic
    nextModal("register-2");
  };

  const handleLoginClick = () => {
    nextModal("login");
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
              Step 1 of 2: Your Information
            </h4>
          </div>
          <div className="flex flex-col gap-6 mt-8">
            <div className="grid md:grid-cols-2 gap-8">
              <Input
                label="First Name"
                name="first-name"
                placeHolder="John "
                className=""
                required
              />
              <Input
                label="Last Name"
                name="last-name"
                placeHolder="Smith"
                required
              />
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <Input
                label="Email"
                name="email"
                placeHolder="example@gmail.com"
                type="email"
                required
              />
              <Input
                label="Age Bracket"
                name="age"
                placeHolder="18-23"
                required
              />
            </div>
            <Input
              label="Password"
              name="password"
              type="password"
              required
            />
            <Input
              label="Confirm Password"
              name="c-password"
              type="password"
              required
            />
            <div className="flex flex-col">
              <label
                htmlFor="hear-from"
                className="text-primary"
              >
                How did you hear about us?
              </label>
              <select
                name="hear-from"
                id="hear-from"
                className="px-4 py-2 outline rounded text-gray-500"
              >
                <option value="google">Google Search</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="flex gap-2 items-baseline">
              <input
                type="checkbox"
                name="policy"
                id="policy"
                required
              />
              <label htmlFor="policy">
                <p>
                  I agree to all the{" "}
                  <Link
                    to="/terms"
                    className="text-primary"
                  >
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy-policy"
                    className="text-primary"
                  >
                    Privacy Policies
                  </Link>
                </p>
              </label>
            </div>

            <div>
              <ButtonCTA
                label="Create account and continue"
                fullWidth
                submit
                className=""
                isLoading={isLoading}
              />
            </div>
            <div className="flex justify-center">
              <p>
                Already have an Account?{" "}
                <span
                  onClick={handleLoginClick}
                  className="text-primary font-semibold cursor-pointer"
                >
                  Login
                </span>
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
