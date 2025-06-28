import React, { useState } from "react";
import Input from "./input";
import ButtonCTA from "./button";
import { Link } from "react-router";
import SelectInput from "./select-input";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import {
  registerUser,
  loginUser,
  fetchAddressesByPostcode,
} from "../api/serices/api_utils";
import { useAuth } from "../context/auth/AuthContext";

const RegisterForm = ({ closeModal, nextModal }) => {
  const [isFirst, setIsFirst] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [showOtherHearFromField, setShowOtherHearFromField] = useState(false);
  const [otherHearFromText, setOtherHearFromText] = useState("");
  const [error, setError] = useState("");
  const [postcode, setPostcode] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [addressError, setAddressError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    // Check only the second step fields
    const secondStepFields = document.querySelectorAll(
      ".second-step-fields input, .second-step-fields select"
    );
    let isValid = true;

    secondStepFields.forEach((field) => {
      if (!field.checkValidity()) {
        field.reportValidity();
        isValid = false;
      }
    });

    // Additional validation for address selection
    if (!selectedAddress) {
      const manualAddressInput = document.querySelector(
        'input[name="address"]'
      );
      if (!manualAddressInput || !manualAddressInput.value.trim()) {
        setError(
          "Please select an address from the list or enter your address manually"
        );
        return;
      }
    }

    if (!isValid) return;

    // Additional client-side validation to match backend requirements
    if (password !== rePassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate that hear-from field is properly filled
    const formData = new FormData(e.target);
    const hearFromValue = formData.get("hear-from");

    if (!hearFromValue) {
      setError("Please select how you heard about us");
      return;
    }

    if (hearFromValue === "other" && !otherHearFromText.trim()) {
      setError("Please specify how you heard about us");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const data = Object.fromEntries(formData.entries());

      // Get the address - either from selection or manual input
      const finalAddress = selectedAddress || data.address;

      // Transform form data to match backend API expectations
      const apiData = {
        firstName: data["first-name"],
        lastName: data["last-name"],
        email: data.email,
        ageBracket: data.age,
        password: data.password,
        confirmPassword: data["c-password"],
        hearFrom:
          data["hear-from"] === "other"
            ? otherHearFromText || "other"
            : data["hear-from"],
        postcode: data.postcode,
        addresses: [
          {
            id: crypto.randomUUID(), // Generate unique ID for the address
            address: finalAddress, // Use the final address (selected or manual)
            postcode: data.postcode,
          },
        ], // Create address object array matching the schema
      };

      // Validate all required fields are present
      const requiredFields = [
        "firstName",
        "lastName",
        "email",
        "ageBracket",
        "password",
        "confirmPassword",
        "hearFrom",
        "postcode",
      ];
      const missingFields = requiredFields.filter((field) => !apiData[field]);

      if (missingFields.length > 0) {
        setError(`Missing required fields: ${missingFields.join(", ")}`);
        return;
      }

      if (!apiData.addresses[0].address) {
        setError("Please select an address or enter your address manually");
        return;
      }

      const res = await registerUser(apiData);
      if (res && res.success) {
        // Automatically log in the user after successful registration using AuthContext
        const loginRes = await login({
          email: apiData.email,
          password: apiData.password,
        });
        if (loginRes && loginRes.success) {
          navigate("/dashboard");
        } else {
          setError(
            loginRes?.message ||
              loginRes?.error?.message ||
              "Account created, but automatic sign-in failed. Please log in manually."
          );
        }
      } else {
        const errorMessage =
          res?.message ||
          res?.error?.message ||
          "SignUp failed. Please try again.";
        setError(errorMessage);
      }
    } catch (err) {
      let errorMessage = "An unexpected error occurred. Please try again.";

      // Handle different types of errors
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = (e) => {
    e.preventDefault();

    // Clear any existing errors
    setError("");

    // Get only the visible first step fields (including hidden inputs from SelectInput)
    const firstStepFields = document.querySelectorAll(
      ".first-step-fields input, .first-step-fields select"
    );
    let isValid = true;
    let invalidFields = [];

    // Check validity of only the first step fields
    firstStepFields.forEach((field) => {
      // Skip validation for non-required fields or fields that aren't relevant
      if (field.type === "hidden" && field.name === "hear_from_other_text") {
        // Only validate the "other" text field if "Other" is selected
        if (showOtherHearFromField && !field.value.trim()) {
          isValid = false;
          invalidFields.push("Please specify how you heard about us");
        }
      } else if (!field.checkValidity()) {
        field.reportValidity();
        isValid = false;
        invalidFields.push(field.name || field.id || "unnamed field");
      }
    });

    // Additional custom validation for required SelectInput fields
    const hearFromValue = document.querySelector(
      'input[name="hear-from"]'
    )?.value;
    const ageValue = document.querySelector('input[name="age"]')?.value;

    if (!hearFromValue) {
      setError("Please select how you heard about us");
      isValid = false;
    }

    if (!ageValue) {
      setError("Please select your age bracket");
      isValid = false;
    }

    // If "Other" is selected but no text is provided
    if (hearFromValue === "other" && !otherHearFromText.trim()) {
      setError("Please specify how you heard about us");
      isValid = false;
    }

    if (!isValid) {
      return;
    }

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

  // UK Postcode formatter with proper validation and address fetching
  const handlePostcodeChange = async (e) => {
    let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");

    // Format UK postcode with space
    // Outward code: 2-4 characters (letter+number combinations)
    // Inward code: 3 characters (number+letter+letter)
    if (value.length > 3) {
      // Insert space before the last 3 characters (inward code)
      const outward = value.slice(0, -3);
      const inward = value.slice(-3);
      value = outward + " " + inward;
    }

    // Limit to 8 characters maximum (including space)
    if (value.length <= 8) {
      setPostcode(value);

      // Clear previous addresses and selected address when postcode changes
      setAddresses([]);
      setSelectedAddress("");
      setAddressError("");

      // Clear error when user starts typing valid postcode
      if (error && !isFirst) {
        setError("");
      }

      // Fetch addresses when postcode is complete (has space and correct length)
      if (value.includes(" ") && value.length >= 6 && value.length <= 8) {
        setIsLoadingAddresses(true);
        setAddressError("");

        try {
          const result = await fetchAddressesByPostcode(value);

          if (result.success && result.data.addresses) {
            const addressOptions = result.data.addresses.map((addr) => ({
              label: addr.label,
              value: addr.value,
            }));
            setAddresses(addressOptions);

            if (addressOptions.length === 0) {
              setAddressError(
                "No addresses found for this postcode. You may need to enter your address manually."
              );
            }
          } else {
            setAddressError(
              result.message || "Unable to fetch addresses for this postcode."
            );
            setAddresses([]);
          }
        } catch (err) {
          console.error("Error fetching addresses:", err);
          setAddressError(
            "Error fetching addresses. Please try again or enter your address manually."
          );
          setAddresses([]);
        } finally {
          setIsLoadingAddresses(false);
        }
      }
    }
  };

  // Handler for address selection
  const handleAddressChange = (e) => {
    setSelectedAddress(e.target.value);
    setAddressError("");
    // Clear any registration errors
    if (error && !isFirst) {
      setError("");
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
        {/* Hidden input for selected address to ensure form submission works */}
        {selectedAddress && (
          <input
            type="hidden"
            name="address"
            value={selectedAddress}
          />
        )}
        <div className={`first-step-fields ${isFirst ? "block" : "hidden"}`}>
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
                placeholder="Enter your first name"
                className=""
                required
              />
              <Input
                label="Last Name"
                name="last-name"
                placeholder="Enter your last name"
                required
              />
            </div>
            <div className="grid md:grid-cols-2 gap-x-4 gap-y-4">
              {" "}
              {/* Reduced grid gap */}
              <Input
                label="Email"
                name="email"
                placeholder="Enter your email address"
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
                required
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
              required
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
            {error && isFirst && (
              <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded-md">
                {error}
              </div>
            )}
            <div>
              <ButtonCTA
                label="Create account and continue"
                fullWidth
                onClickHandler={handleNext}
                type="submit"
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
          className={`second-step-fields ${isFirst ? "hidden" : "block"}`}
        >
          <div>
            <h2 className="text-primary text-5xl font-bold">Register</h2>
            <h4 className="w-full flex md:justify-end font-semibold text-xl">
              Step 2 of 2: Your Property
            </h4>
          </div>
          <div className="flex flex-col gap-[226px] mt-8">
            <div className="flex flex-col gap-6">
              <Input
                name="postcode"
                label="Postcode"
                placeholder="Enter your UK postcode (e.g., SW1A 0AA)"
                value={postcode}
                onChange={handlePostcodeChange}
                pattern="^[A-Z]{1,2}[0-9R][0-9A-Z]?\s[0-9][A-Z]{2}$"
                title="Please enter a valid UK postcode (e.g., SW1A 0AA, M1 9AB)"
                maxLength="8"
                type="text"
                required
                helperText="Enter your postcode to find your address automatically."
              />

              {/* Address Selection */}
              {postcode && (
                <div className="relative">
                  {isLoadingAddresses ? (
                    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                      <span className="text-sm text-blue-700">
                        Finding addresses for {postcode}...
                      </span>
                    </div>
                  ) : addresses.length > 0 ? (
                    <SelectInput
                      name="address"
                      label="Select Your Address"
                      options={addresses}
                      value={selectedAddress}
                      onChange={handleAddressChange}
                      placeholder="Choose your address from the list"
                      searchEnabled={true}
                      required
                      fullWidth
                      helperText={`${addresses.length} address${
                        addresses.length === 1 ? "" : "es"
                      } found. Start typing to search or select from the dropdown.`}
                    />
                  ) : addressError ? (
                    <div className="space-y-4">
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-yellow-800">
                            {addressError}
                          </p>
                          <button
                            type="button"
                            onClick={() =>
                              handlePostcodeChange({
                                target: { value: postcode },
                              })
                            }
                            className="text-xs text-yellow-700 hover:text-yellow-900 underline"
                            disabled={isLoadingAddresses}
                          >
                            Retry
                          </button>
                        </div>
                      </div>
                      <Input
                        name="address"
                        label="Street Address"
                        placeholder="Enter your full street address manually"
                        minLength="10"
                        title="Please enter your complete street address"
                        required
                        helperText="Please enter your full address including house number and street name."
                      />
                    </div>
                  ) : postcode.includes(" ") && postcode.length >= 6 ? (
                    <Input
                      name="address"
                      label="Street Address"
                      placeholder="Enter your full street address"
                      minLength="10"
                      title="Please enter your complete street address"
                      required
                      helperText="Please enter your full address including house number and street name."
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <p className="text-sm text-gray-600">
                        Complete your postcode above to automatically find your
                        address.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded-md">
                {error}
              </div>
            )}

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
