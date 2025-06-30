import React, { useState, useEffect } from "react";
import Input from "./input";
import ButtonCTA from "./button";
import { Link, useNavigate } from "react-router";
import SelectInput from "./select-input";
import { useAuth } from "../context/auth/AuthContext";
import { updateUserData } from "../api/serices/api_utils";

const AccountDetails = ({ closeModal, nextModal }) => {
  const {
    user,
    isAuthenticated,
    loading: authLoading,
    getAuthToken,
    logout,
  } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [formChanged, setFormChanged] = useState(false);

  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [passwordChanged, setPasswordChanged] = useState(false);

  useEffect(() => {
    if (user) {
      setUserData({
        firstName: user.name.split(" ")[0] || "",
        lastName: user.name.split(" ")[1] || "",
        email: user.email || "",
        password: "••••••••", // Show placeholder stars for existing password
      });
      setPasswordChanged(false); // Reset password changed flag
    }
  }, [user]);

  const closeAccountModal = () => {
    if (formChanged) {
      // Show confirmation if there are unsaved changes
      if (
        window.confirm(
          "You have unsaved changes. Are you sure you want to close?"
        )
      ) {
        closeModal();
      }
    } else {
      closeModal();
    }
  };

  const handleDataChange = (e) => {
    const { name, value } = e.target;

    // Track if password field is being changed
    if (name === "password") {
      // If user clears the password field or it's just the placeholder, don't mark as changed
      if (value === "" || value === "••••••••") {
        setPasswordChanged(false);
      } else {
        setPasswordChanged(true);
      }
    }

    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormChanged(true);
    setError(""); // Clear any previous errors
    setSuccess(""); // Clear any previous success messages
  };

  const handlePasswordFocus = () => {
    // Clear the placeholder stars when user focuses on password field
    if (userData.password === "••••••••") {
      setUserData((prev) => ({
        ...prev,
        password: "",
      }));
    }
  };

  const handlePasswordBlur = () => {
    // If user leaves password field empty and hasn't made changes, restore placeholder
    if (userData.password === "" && !passwordChanged) {
      setUserData((prev) => ({
        ...prev,
        password: "••••••••",
      }));
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        throw new Error("Please enter a valid email address");
      }

      // Validate required fields
      if (!userData.firstName || !userData.lastName) {
        throw new Error("First name and last name are required");
      }

      const token = getAuthToken();

      if (!token) {
        throw new Error("Please log in again to save changes.");
      }

      // Prepare user data for API
      const userDataToSend = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        // Only include password if it was actually changed by the user
        ...(passwordChanged &&
          userData.password &&
          userData.password !== "••••••••" && { password: userData.password }),
      };

      // Don't pass token as parameter, let the interceptor handle it
      const res = await updateUserData(userDataToSend);

      if (res && res.success) {
        setSuccess("Changes saved successfully!");
        setFormChanged(false);
        setPasswordChanged(false); // Reset password changed flag after successful save

        // If password was changed, reset it to show stars again
        if (passwordChanged) {
          setUserData((prev) => ({
            ...prev,
            password: "••••••••",
          }));
        }
      } else {
        // Handle specific error cases
        if (res?.status === 401) {
          setError("Session expired. Please log in again.");
        } else {
          setError(res?.message || "User update failed. Please try again.");
        }
      }
    } catch (error) {
      // Handle different types of errors
      if (error.message.includes("log in again")) {
        setError("Your session has expired. Please log in again.");
        // Close modal and redirect to home after a delay
        setTimeout(() => {
          closeModal();
          navigate("/");
        }, 2000);
      } else {
        setError(error.message || "Failed to save changes. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleContactModal = () => {
    nextModal("contact");
  };

  return (
    <div className="w-full px-12 py-8 ">
      <div className="flex flex-col">
        <div>
          <div>
            <h2 className="text-primary text-2xl md:text-3xl font-semibold">
              My Account
            </h2>
          </div>
          <div className="flex flex-col gap-6 mt-8">
            <div className="grid md:grid-cols-2 gap-8">
              <Input
                label="First Name"
                name="firstName"
                value={userData.firstName}
                onChange={handleDataChange}
                className="mt-3.5 bg-[#F9F9F9]"
                disabled={!isAuthenticated || loading}
                required
                error={error && !userData.firstName}
                helperText={
                  error && !userData.firstName ? "First name is required" : ""
                }
              />
              <Input
                label="Last Name"
                name="lastName"
                value={userData.lastName}
                onChange={handleDataChange}
                className="mt-3.5 bg-[#F9F9F9]"
                disabled={!isAuthenticated || loading}
                required
                error={error && !userData.lastName}
                helperText={
                  error && !userData.lastName ? "Last name is required" : ""
                }
              />
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <Input
                label="Email"
                name="email"
                type="email"
                value={userData.email}
                onChange={handleDataChange}
                className="mt-3.5"
                disabled={!isAuthenticated || loading}
                required
                error={
                  error &&
                  (!userData.email ||
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email))
                }
                helperText={
                  error &&
                  (!userData.email ||
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email))
                    ? "Please enter a valid email address"
                    : ""
                }
              />
              <Input
                label="Password"
                name="password"
                type="password"
                value={userData.password}
                onChange={handleDataChange}
                onFocus={handlePasswordFocus}
                onBlur={handlePasswordBlur}
                disabled={!isAuthenticated}
                className="mt-3.5 "
                placeholder="Enter new password to change"
                helperText="Leave blank to keep current password"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <SelectInput
                  label="Property(ies)"
                  name="property"
                  value={user?.addresses?.[0]?.address || ""}
                  options={
                    user?.addresses?.length
                      ? user.addresses.map((addr) => ({
                          label: addr.address,
                          value: addr.address,
                        }))
                      : [
                          {
                            label: "No address available",
                            value: "",
                          },
                        ]
                  }
                  searchEnabled={false}
                  disabled={true}
                  className="mt-3.5 bg-[#F9F9F9]"
                />
                <div className="mt-2">
                  <p className="text-xs">
                    Updates/Additions to property not available in your pricing
                    plan. Please{" "}
                    <span
                      onClick={handleContactModal}
                      className="text-primary cursor-pointer hover:underline"
                    >
                      contact us here
                    </span>{" "}
                    for any errors.
                  </p>
                </div>
              </div>
              <div>
                <SelectInput
                  label="Plan"
                  name="plan"
                  value={user?.plan || ""}
                  options={[
                    { label: "Basic", value: "basic" },
                    { label: "Pro", value: "pro" },
                  ]}
                  searchEnabled={false}
                  disabled={true}
                  className="mt-3.5 bg-[#F9F9F9]"
                />
                <div className="mt-2">
                  <p className="text-xs">
                    Want to Upgrade? Go to{" "}
                    <Link
                      to="/pricing"
                      className="text-primary cursor-pointer"
                    >
                      Pricing & Plans
                    </Link>
                  </p>
                </div>
              </div>
            </div>
            {(error || success) && (
              <div
                className={`text-center p-3 rounded-md ${
                  error
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {error || success}
              </div>
            )}
            <div className="flex flex-col items-center gap-8 mt-14">
              <ButtonCTA
                label="Save Changes"
                onClickHandler={handleSave}
                disabled={!isAuthenticated || loading || !formChanged}
                isLoading={loading}
                className="w-48"
              />
              <span
                className="text-center cursor-pointer font-medium hover:text-primary"
                onClick={closeAccountModal}
              >
                Close your account
              </span>
              {/* Compact Logout Button */}
              <button
                className="mt-2 px-3 py-1 text-xs rounded bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-600 border border-gray-200 transition-colors cursor-pointer"
                style={{ minWidth: 0, width: "auto", alignSelf: "center" }}
                onClick={async () => {
                  await logout();
                  navigate("/");
                }}
                type="button"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;
