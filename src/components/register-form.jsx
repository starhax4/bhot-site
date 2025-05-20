import React, { useState } from "react";
import Input from "./input";
import ButtonCTA from "./button";
import { Link } from "react-router";
import SelectInput from "./select-input";
import { motion } from "motion/react";
import { useNavigate } from "react-router";

const RegisterForm = ({ closeModal, nextModal }) => {
  const [isFirst, setIsFirst] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [showOtherHearFromField, setShowOtherHearFromField] = useState(false); // Added state
  const [otherHearFromText, setOtherHearFromText] = useState(""); // Added state
  const [error, setError] = useState(false); //
  const navigate = useNavigate();

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // If "Other" was selected for hear-from, use the text from the additional input
    if (data["hear-from"] === "other") {
      data["hear-from"] = data.hear_from_other_text || "other"; // Use specified text or empty string
    }
    delete data.hear_from_other_text; // Clean up the temporary field

    //form Submition logic
    console.log(data);

    navigate("/dashboard");

    // nextModal("register-2");
  };

  const handleNext = () => {
    setIsFirst(false);
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

  const isPasswordDifferent = () => {
    return rePassword !== "" && password !== rePassword;
  };

  // Handler for the "How did you hear about us?" SelectInput
  const handleHearFromChange = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue === "other") {
      setShowOtherHearFromField(true);
    } else {
      setShowOtherHearFromField(false);
      setOtherHearFromText(""); // Clear the text if a non-other option is chosen
    }
  };

  return (
    <div className="w-full px-4 md:px-6 py-5 ">
      {" "}
      {/* Reduced padding */}
      <form
        onSubmit={handleRegisterSubmit}
        className="flex flex-col"
      >
        <div className={`${isFirst ? "block" : "hidden"}`}>
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
                  { label: "18-25", value: "18-25" },
                  { label: "26-35", value: "26-35" },
                  { label: "36-45", value: "36-45" },
                  { label: "46-55", value: "46-55" },
                  { label: "56+", value: "56-100" },
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
              error={isPasswordDifferent()}
              helperText={
                isPasswordDifferent() ? "Password does't matched" : ""
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
              onChange={handleHearFromChange} // Added onChange handler
              // searchEnabled={true}
              // onSearch={handleSearch}
              fullWidth
            />
            {showOtherHearFromField && (
              <Input
                label="Please specify"
                name="hear_from_other_text" // Temporary name for FormData collection
                value={otherHearFromText}
                onChange={(e) => setOtherHearFromText(e.target.value)}
                required // Make this field required if "Other" is selected
                className="mt-0" // Relies on parent gap, adjust if needed e.g. mt-2 or mt-4
              />
            )}
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
                onClickHandler={handleNext}
                className=""
                isLoading={isLoading}
                disabled={isPasswordDifferent()}
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

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className={`${isFirst ? "hidden" : "block"}`}
        >
          <div>
            <h2 className="text-primary text-5xl font-bold">Register</h2>
            <h4 className="w-full flex md:justify-end font-semibold text-xl">
              Step 2 of 2: Your Property
            </h4>
          </div>
          <div className="flex flex-col gap-[226px] mt-8">
            <div className="flex flex-col gap-6">
              <SelectInput
                name="zip-code"
                label="Postcode"
                options={[
                  {
                    label: "57400",
                    value: "57400",
                  },
                ]}
                searchEnabled={true}
                // onSearch={handleSearch}
                fullWidth
              />
              <SelectInput
                name="adress"
                label="Select Address"
                options={[
                  {
                    label: "Poole, United Kingdom",
                    value: "poole",
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

export default RegisterForm;
