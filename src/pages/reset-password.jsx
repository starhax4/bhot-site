import React, { useState } from "react";
import { useParams, useNavigate } from "react-router";
import Input from "../components/input";
import ButtonCTA from "../components/button";
import { motion } from "motion/react";
import { resetPassword } from "../api/serices/api_utils";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!form.password || !form.confirmPassword) {
      setError("Both fields are required.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setIsLoading(true);
    try {
      const res = await resetPassword(
        token,
        form.password,
        form.confirmPassword
      );
      if (res && res.success) {
        setSuccess("Password reset successful. Redirecting to login...");
        setTimeout(() => navigate("/"), 2000);
      } else {
        setError(res?.message || "Failed to reset password.");
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
      className="w-full min-h-screen flex items-center justify-center bg-gray-50 px-4"
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl border-2 border-primary shadow-xl p-8 md:p-12 flex flex-col gap-8 w-full max-w-md"
      >
        <h2 className="text-primary text-4xl font-bold text-center mb-2">
          Reset Password
        </h2>
        <Input
          label="New Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <Input
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
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
          label="Reset Password"
          fullWidth
          submit
          isLoading={isLoading}
        />
      </form>
    </motion.div>
  );
};

export default ResetPasswordPage;
