import React, { useState, useEffect } from "react";
import Input from "./input";
import ButtonCTA from "./button";
import { Link } from "react-router";
import SelectInput from "./select-input";
import { useAuth } from "../context/auth/AuthContext";

const AccountDetails = ({ closeModal, nextModal }) => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [formChanged, setFormChanged] = useState(false);

  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    property: "",
    plan: "basic",
  });

  useEffect(() => {
    if (user) {
      setUserData({
        firstName: user.name.split(" ")[0] || "",
        lastName: user.name.split(" ")[1] || "",
        email: user.email || "",
        password: "********", // Don't show actual password
        property: user.addresses?.[0]?.street || "",
        plan: user.plan.toLowerCase() || "basic",
      });
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
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormChanged(true);
    setError(""); // Clear any previous errors
    setSuccess(""); // Clear any previous success messages
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError("");

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        throw new Error("Please enter a valid email address");
      }

      // Validate required fields
      if (!userData.firstName || !userData.lastName) {
        throw new Error("First name and last name are required");
      }

      // In a real app, you would send this to your API
      await new Promise((resolve) => setTimeout(resolve, 600)); // Simulate API call

      // Update user object
      const updatedUser = {
        ...user,
        name: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
      };

      // Save to local storage (replace with your API call)
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setSuccess("Changes saved successfully!");
      setFormChanged(false);
    } catch (err) {
      setError(err.message || "Failed to save changes. Please try again.");
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
                className="mt-3.5 bg-[#F9F9F9]"
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
                disabled={true}
                className="mt-3.5 bg-[#F9F9F9]"
                helperText="Contact support to change password"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <SelectInput
                  label="Property(ies)"
                  name="property"
                  value={userData.property}
                  options={[
                    {
                      label: "1, First Street, City, AB12 3CD",
                      value: "1, First Street, City, AB12 3CD",
                    },
                  ]}
                  searchEnabled={false}
                  disabled={true}
                  // helperText="You can't change Address! In case of Mistake Contact us."
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
                  value={userData.plan.toLowerCase()}
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
                onClick={handleSave}
                disabled={!isAuthenticated || loading || !formChanged}
                loading={loading}
                className="w-48"
              />
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
