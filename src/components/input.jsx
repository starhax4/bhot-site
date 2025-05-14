import React, { forwardRef, useState } from "react";
import { EyeOff, Eye } from "lucide-react";

// A fully reusable outlined input with floating label and password toggle
const sizeStyles = {
  small: "px-2.5 pt-4 pb-1.5 text-lg", // Adjusted for more compact "small" size
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
      size = "medium", // Changed default size to "small"
      type = "text",
      className = "",
      inputClass = "",
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

    // Determine label color and size
    let labelColorClass = "text-zinc-800";
    if (error) {
      labelColorClass = "text-red-500";
    } else if (focused) {
      labelColorClass = "text-primary"; // Or your theme's focus color
    }

    const labelSizeAndPositionClass =
      hasValue || focused
        ? size === "small"
          ? "-top-1.5 text-[0.65rem]" // Adjusted active label for "small"
          : "-top-2 text-xs" // Default active label for other sizes
        : size === "small"
        ? "top-1/2 -translate-y-1/2 text-xs" // Inactive label for "small"
        : "top-1/2 -translate-y-1/2 text-gray-500"; // Default inactive

    // Determine border color
    const borderColor = error
      ? "border-red-500"
      : focused
      ? "border-primary"
      : "border-gray-500";

    // Determine ring
    const ringClass =
      focused && !error
        ? "ring-1 ring-primary"
        : focused && error
        ? "ring-1 ring-red-500"
        : "";

    const widthClass = fullWidth ? "w-full" : "inline-flex";

    return (
      <div
        className={`flex flex-col ${fullWidth ? "w-full" : ""} ${className}`}
      >
        <div
          className={`relative border ${borderColor} ${ringClass} rounded-lg bg-white flex items-center ${sizeStyles[size]} ${widthClass} ${inputClass}`}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        >
          {/* Floating label */}
          {label && (
            <label
              htmlFor={id || name}
              className={`absolute left-2.5 px-1 bg-white transition-all duration-200 ease-in-out pointer-events-none 
              ${labelSizeAndPositionClass} ${
                hasValue || focused ? labelColorClass : "text-gray-500"
              }
              `}
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
              {showPassword ? <Eye /> : <EyeOff className="text-gray-500" />}
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
