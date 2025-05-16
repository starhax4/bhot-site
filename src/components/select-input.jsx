import React, { forwardRef, useState, useRef, useEffect } from "react";

// Reusable SelectInput with floating label, object options, default value, and async support
const sizeStyles = {
  small: "px-2 pt-3 pb-1.5 text-base",
  medium: "px-3 pt-4 pb-2 text-base",
  large: "px-4 pt-5 pb-3 text-lg",
};

const SelectInput = forwardRef(
  (
    {
      id,
      name,
      label,
      options = [], // array of { label, value }
      value, // controlled selected value
      defaultValue = "", // initial selected value
      onChange,
      placeholder = "",
      error = false,
      helperText = "",
      fullWidth = false,
      disabled = false,
      size = "small",
      searchEnabled = false,
      onSearch, // async callback(term)
      className = "",
      ...props
    },
    ref
  ) => {
    const [focused, setFocused] = useState(false);
    const [inputText, setInputText] = useState("");
    const [selectedValue, setSelectedValue] = useState(defaultValue);
    const [showList, setShowList] = useState(false);
    const [filtered, setFiltered] = useState(options);
    const containerRef = useRef(null);

    // Initialize and synchronize from defaultValue and options
    useEffect(() => {
      if (defaultValue) {
        // If a defaultValue is provided, always try to set it as the selectedValue
        setSelectedValue(defaultValue);
        const found = options.find((opt) => opt.value === defaultValue);
        if (found) {
          // If found in options, set the display text to its label
          setInputText(found.label);
        } else {
          // If not found in options, clear the display text
          setInputText("");
        }
      } else {
        // If defaultValue is falsy (e.g., "", null, undefined),
        // clear the display text and set selectedValue to this falsy value
        setInputText("");
        setSelectedValue(defaultValue);
      }
    }, [defaultValue, options]);

    const displayValue = inputText;

    // // // Filter local options always
    // useEffect(() => {
    //   setFiltered(
    //     options.filter((opt) =>
    //       opt.label.toLowerCase().includes(displayValue.toLowerCase())
    //     )
    //   );
    // }, [options, displayValue]);

    // Trigger async search if enabled
    useEffect(() => {
      if (searchEnabled && onSearch) {
        onSearch(displayValue);
      }
    }, [displayValue, searchEnabled, onSearch]);

    // Close dropdown on outside click
    useEffect(() => {
      const handleClick = (e) => {
        if (containerRef.current && !containerRef.current.contains(e.target)) {
          setShowList(false);
          setFocused(false);
        }
      };
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const handleFocus = () => {
      setFocused(true);
      setFiltered(options);
      setShowList(true);
    };

    const handleInputChange = (e) => {
      const term = e.target.value;
      setInputText(term);
      setSelectedValue(""); // clear selected when typing
      if (onChange) onChange({ target: { name, value: "" } });
      setShowList(true);
    };

    const handleSelect = (opt) => {
      setInputText(opt.label);
      setSelectedValue(opt.value);
      if (onChange) onChange({ target: { name, value: opt.value } });
      setShowList(false);
    };

    const borderColor = error
      ? "border-red-500"
      : focused
      ? "border-primary"
      : "border-gray-500";
    const ringClass = focused
      ? error
        ? "ring-1 ring-red-500"
        : "ring-1 ring-primary"
      : "";
    const widthClass = fullWidth ? "w-full" : "inline-flex";

    return (
      <div
        className={`flex flex-col relative ${
          fullWidth ? "w-full" : ""
        } ${className}`}
        ref={containerRef}
      >
        {/* Hidden input for form submission */}
        <input
          type="hidden"
          name={name}
          value={selectedValue}
        />

        <div
          className={`relative border ${borderColor} ${ringClass} rounded-lg bg-white flex items-center ${sizeStyles[size]} ${widthClass}`}
          onFocus={handleFocus}
        >
          {/* Floating label */}
          {label && (
            <label
              htmlFor={id || name}
              className={`absolute left-3 px-1 bg-white transition-all pointer-events-none
              ${
                focused || displayValue
                  ? "-top-2 text-xs text-primary"
                  : "top-1/2 -translate-y-1/2 text-zinc-600"
              }`}
            >
              {label}
            </label>
          )}

          <input
            id={id || name}
            ref={ref}
            type="text"
            placeholder={""}
            disabled={disabled}
            className="flex-1 bg-transparent outline-none disabled:cursor-not-allowed disabled:opacity-50 z-0"
            onFocus={handleFocus}
            onChange={handleInputChange}
            value={displayValue}
            {...props}
          />
        </div>

        {/* Options dropdown */}
        {showList && filtered.length > 0 && (
          <ul className="absolute mt-10 w-full max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg z-50">
            {filtered.map((opt) => (
              <li
                key={opt.value}
                onMouseDown={() => handleSelect(opt)}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              >
                {opt.label}
              </li>
            ))}
          </ul>
        )}

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

export default SelectInput;
