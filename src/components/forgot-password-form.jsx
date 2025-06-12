import React, { useState } from "react";
import Input from "./input";
import { motion } from "motion/react";
import ButtonCTA from "./button";
import { forgetPassword } from "../api/serices/api_utils";

const ForgotPasswordForm = ({ closeModal }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");
    try {
      const formData = new FormData(e.target);
      const email = formData.get("email");
      const res = await forgetPassword(email);
      if (res && res.success) {
        setSuccess("Password reset instructions sent to your email.");
      } else {
        setError(res?.message || "Failed to send reset instructions.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
        onSubmit={handleSubmit}
        className="flex flex-col"
      >
        <div>
          <div>
            <h2 className="text-primary text-4xl font-bold text-center mb-6">
              Forgot Password
            </h2>
            <div className="flex flex-col gap-8 mt-4">
              <Input
                label="Email"
                name="email"
                type="email"
                required
              />
              {error && (
                <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded-md">
                  {error}
                </div>
              )}
              {success && (
                <div className="text-green-600 text-sm text-center p-2 bg-green-50 rounded-md">
                  {success}
                </div>
              )}
              <ButtonCTA
                label="Send Reset Link"
                fullWidth
                submit
                isLoading={isLoading}
              />
              <button
                type="button"
                className="text-primary mt-2 underline text-sm"
                onClick={closeModal}
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default ForgotPasswordForm;
