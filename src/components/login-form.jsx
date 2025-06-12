import React, { useState } from "react";
import Input from "./input";
import { motion } from "motion/react";
import ButtonCTA from "./button";
import { useNavigate } from "react-router";
import { useAuth } from "../context/auth/AuthContext";

const RegisterForm = ({ closeModal, nextModal }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, user } = useAuth();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());

      const res = await login(data);
      if (res && res.success) {
        if (closeModal) closeModal(); // Only close modal on success
        // Check for redirectAfterLogin
        const redirectPath = localStorage.getItem("redirectAfterLogin");
        if (redirectPath) {
          localStorage.removeItem("redirectAfterLogin");
          navigate(redirectPath);
          return;
        }
        if (user && user.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/dashboard");
        }
      } else {
        setError(res?.message || "Login failed. Please try again.");
        // Do NOT close modal or navigate
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginClick = () => {
    nextModal("cta");
  };

  const handleForgotPasswordClick = () => {
    nextModal("forgot-password");
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
                  name="email"
                  type="email"
                  // error={true}
                  // helperText="Wrong Email"
                  required
                />
                <Input
                  label="Password"
                  name="password"
                  type="password"
                  // error={true}
                  // helperText="Wrong Password"
                  required
                />
              </div>

              {error && (
                <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded-md">
                  {error}
                </div>
              )}

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
                    <span
                      className="text-primary font-semibold cursor-pointer"
                      onClick={handleForgotPasswordClick}
                    >
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
