import React, { useState } from "react";
import { motion } from "motion/react";
import Input from "./input";
import ButtonCTA from "./button";
import { useNavigate } from "react-router";
import SelectInput from "./select-input";

const RegisterForm2 = ({ closeModal }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    //form Submition logic
    console.log(data);
    navigate("/dashboard");
  };

  return (
    <div className="w-full px-4 md:px-12 py-8 ">
      <form
        onSubmit={handleRegisterSubmit}
        className="flex flex-col"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          <div>
            <h2 className="text-primary text-5xl font-bold">Register</h2>
            <h4 className="w-full flex md:justify-end font-semibold text-xl">
              Step 2 of 2: Your Property
            </h4>
          </div>
          <div className="flex flex-col gap-[270px] mt-8">
            <div className="flex flex-col gap-6">
              <SelectInput
                name="zip-code"
                label="Postcode"
                options={[
                  {
                    label: "",
                    value: "",
                  },
                ]}
                searchEnabled={true}
                // onSearch={handleSearch}
                fullWidth
              />
              <SelectInput
                name="ADRESS"
                label="select Adress"
                options={[
                  {
                    label: "Okara",
                    value: "okara",
                  },
                ]}
                searchEnabled={true}
                // onSearch={handleSearch}
                fullWidth
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
        </motion.div>
      </form>
    </div>
  );
};

export default RegisterForm2;
