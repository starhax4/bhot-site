import React, { useState } from "react";
import Input from "./input";
import { motion } from "motion/react";
import ButtonCTA from "./button";
import { useNavigate } from "react-router";

const RegisterForm = ({ closeModal, nextModal }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    //form Submition logic
    console.log(data);
    navigate("/dashboard");
  };

  const handleLoginClick = () => {
    nextModal("cta");
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="w-full px-4 md:px-12 py-8 "
    >
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
                  name="EMAIL"
                  type="email"
                  // error={true}
                  // helperText="Wrong Email"
                  required
                />
                <Input
                  label="Password"
                  name="PASSword"
                  type="password"
                  // error={true}
                  // helperText="Wrong Password"
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
    </motion.div>
  );
};

export default RegisterForm;
