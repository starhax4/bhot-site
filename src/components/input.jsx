import React, { forwardRef, useState } from "react";

// A fully reusable outlined input with floating label and password toggle
const sizeStyles = {
  small: "px-2 pt-3 pb-1 text-sm",
  medium: "px-3 pt-4 pb-2 text-base",
  large: "px-4 pt-5 pb-3 text-lg",
};

const OutlinedInput = forwardRef(
  (
    {
      id,
      name,
      label,
      value,
      onChange,
      placeholder = "",
      error = false,
      helperText = "",
      startAdornment = null,
      endAdornment = null,
      fullWidth = false,
      disabled = false,
      size = "medium",
      type = "text",
      className = "",
      ...props
    },
    ref
  ) => {
    const [focused, setFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [internalValue, setInternalValue] = useState("");

    const isControlled = value !== undefined;
    const inputValue = isControlled ? value : internalValue;
    const handleChange = (e) => {
      if (!isControlled) setInternalValue(e.target.value);
      if (onChange) onChange(e);
    };

    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;
    const hasValue = inputValue !== "";

    // Determine border color
    const borderColor = error
      ? "border-red-500"
      : focused
      ? "border-blue-500"
      : "border-gray-300";

    // Determine ring
    const ringClass =
      focused && !error
        ? "ring-1 ring-blue-500"
        : focused && error
        ? "ring-1 ring-red-500"
        : "";

    const widthClass = fullWidth ? "w-full" : "inline-flex";

    return (
      <div
        className={`flex flex-col ${fullWidth ? "w-full" : ""} ${className}`}
      >
        <div
          className={`relative border ${borderColor} ${ringClass} rounded-lg bg-white flex items-center ${sizeStyles[size]} ${widthClass}`}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        >
          {/* Floating label */}
          {label && (
            <label
              htmlFor={id || name}
              className={`absolute left-3 px-1 bg-white transition-all pointer-events-none 
              ${
                hasValue || focused
                  ? "-top-2 text-xs text-gray-600"
                  : "top-1/2 -translate-y-1/2 text-gray-500"
              }`}
            >
              {label}
            </label>
          )}

          {startAdornment && (
            <span className="mr-2 z-10">{startAdornment}</span>
          )}

          <input
            id={id || name}
            name={name}
            ref={ref}
            type={inputType}
            placeholder={focused || hasValue ? placeholder : ""}
            disabled={disabled}
            className="flex-1 bg-transparent outline-none disabled:cursor-not-allowed disabled:opacity-50 z-0"
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChange={handleChange}
            value={isControlled ? value : inputValue}
            {...props}
          />

          {/* Password toggle or endAdornment */}
          {isPassword ? (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="ml-2 z-10 focus:outline-none"
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.875 18.825A10.05 10.05 0 0112 19.5c-5.523 0-10-4.477-10-10 0-1.303.265-2.54.745-3.675m3.116 1.581A1.75 1.75 0 118.25 6.75 1.75 1.75 0 016.5 8.75zM12 12a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3l18 18M8.53 8.53a5.5 5.5 0 017.87 7.87M10.12 2.925A10.045 10.045 0 0112 2.5c5.523 0 10 4.477 10 10 0 1.476-.342 2.884-.946 4.147M5.636 5.636A9.958 9.958 0 002.5 12c0 2.372.833 4.546 2.214 6.196"
                  />
                </svg>
              )}
            </button>
          ) : (
            endAdornment && <span className="ml-2 z-10">{endAdornment}</span>
          )}
        </div>

        {helperText && (
          <p
            className={`mt-1 text-xs ${
              error ? "text-red-600" : "text-gray-500"
            }`}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

export default OutlinedInput;
