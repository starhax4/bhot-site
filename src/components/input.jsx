import React, { forwardRef, useState } from "react";
import { EyeOff, Eye } from "lucide-react";

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
              {showPassword ? <Eye /> : <EyeOff />}
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
