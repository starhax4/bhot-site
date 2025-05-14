import React, { useState } from "react";
import Input from "./input";
import ButtonCTA from "./button";
import { Link } from "react-router";
import SelectInput from "./select-input";

const RegisterForm = ({ closeModal, nextModal }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    //form Submition logic
    console.log(data);

    nextModal("register-2");
  };

  const handleLoginClick = () => {
    nextModal("login");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleRePasswordChange = (e) => {
    setRePassword(e.target.value);
  };

  return (
    <div className="w-full px-4 md:px-6 py-5 ">
      {" "}
      {/* Reduced padding */}
      <form
        onSubmit={handleRegisterSubmit}
        className="flex flex-col"
      >
        <div>
          <div>
            <h2 className="text-primary text-2xl md:text-3xl font-semibold">
              Register
            </h2>{" "}
            {/* Reduced heading size */}
            <h4 className="w-full flex md:justify-end font-semibold text-base md:text-lg">
              {" "}
              {/* Reduced sub-heading size */}
              Step 1 of 2: Your Information
            </h4>
          </div>
          <div className="flex flex-col gap-4 mt-5">
            {" "}
            {/* Reduced gap and margin */}
            <div className="grid md:grid-cols-2 gap-x-4 gap-y-4">
              {" "}
              {/* Reduced grid gap */}
              <Input
                label="First Name"
                name="first-name"
                // placeHolder="John "
                className=""
                required
              />
              <Input
                label="Last Name"
                name="last-name"
                // placeHolder="Smith"
                required
              />
            </div>
            <div className="grid md:grid-cols-2 gap-x-4 gap-y-4">
              {" "}
              {/* Reduced grid gap */}
              <Input
                label="Email"
                name="email"
                // placeHolder="example@gmail.com"
                type="email"
                required
              />
              <SelectInput
                name="age"
                label="Age Bracket"
                options={[
                  { label: "18-24", value: "18-24" },
                  { label: "24-40", value: "24-40" },
                  { label: "40-55", value: "40-55" },
                  { label: "55-100", value: "55-100" },
                ]}
                // defaultValue="18-24"
                // searchEnabled={true}
                // onSearch={handleSearch}
              />
            </div>
            <Input
              label="Password"
              name="password"
              type="password"
              onChange={handlePasswordChange}
              required
            />
            <Input
              label="Confirm Password"
              name="c-password"
              type="password"
              onChange={handleRePasswordChange}
              error={rePassword && password !== rePassword}
              helperText={
                rePassword && password !== rePassword
                  ? "Password does't matched"
                  : ""
              }
              required
            />
            <SelectInput
              name="hear-from"
              label="How did you hear about us?"
              options={[
                { label: "Google Search", value: "google" },
                { label: "Social Media", value: "social" },
                { label: "Friend", value: "friend" },
                { label: "Other", value: "other" },
              ]}
              // searchEnabled={true}
              // onSearch={handleSearch}
              fullWidth
            />
            <div className="flex gap-2 items-baseline">
              <input
                type="checkbox"
                name="policy"
                id="policy"
                required
                className="mt-1 accent-primary" // Align checkbox better
              />
              <label htmlFor="policy">
                <p className="text-sm">
                  {" "}
                  {/* Ensured text is small */}I agree to all the{" "}
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
              <p className="text-sm">
                {" "}
                {/* Ensured text is small */}
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
