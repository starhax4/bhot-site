import React, { useState } from "react";
import Input from "./input";
import ButtonCTA from "./button";
import { Link, useNavigate } from "react-router";

const RegisterForm = ({ closeModal, nextModal }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    //form Submition logic
    navigate("/dashboard");
  };

  const handleLoginClick = () => {
    nextModal("cta");
  };

  return (
    <div className="w-full px-4 md:px-12 py-8 ">
      <form
        onSubmit={handleLoginSubmit}
        className="flex flex-col"
      >
        <div>
          <div>
            <div>
              <h2 className="text-primary text-5xl font-bold">Login</h2>
            </div>
            <div className="flex flex-col gap-12 mt-8">
              <div className="flex flex-col gap-6">
                <Input
                  label="Email"
                  name="zip-code"
                  placeHolder="example@gmail.com"
                  type="email"
                  required
                />
                <Input
                  label="Password"
                  name="adress"
                  placeHolder=""
                  type="password"
                  required
                />
              </div>

              <div>
                <div>
                  <ButtonCTA
                    label="Login"
                    fullWidth
                    submit
                    className=""
                    isLoading={isLoading}
                  />
                </div>
                <div className="flex flex-col gap-4 mt-4 justify-center items-center">
                  <p>
                    Don't have an Account?{" "}
                    <span
                      onClick={handleLoginClick}
                      className="text-primary font-semibold cursor-pointer"
                    >
                      Register here
                    </span>
                  </p>
                  <p>
                    <span className="text-primary font-semibold cursor-pointer">
                      Forgot your password?
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
