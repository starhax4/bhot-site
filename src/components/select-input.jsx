import React, { forwardRef, useState, useRef, useEffect } from "react";

// Reusable SelectInput with floating label, object options, default value, and async support
const sizeStyles = {
  small: "px-3 pt-3 pb-1.5 text-base",
  medium: "px-4 pt-4 pb-2 text-base",
  large: "px-5 pt-5 pb-3 text-lg",
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
      inputText, // Allow direct control of input text from parent
      onInputChange, // Allow parent to handle input changes
      ...props
    },
    ref
  ) => {
    const [focused, setFocused] = useState(false);
    const initialLabel =
      options.find((opt) => opt.value === (value || defaultValue))?.label || "";
    const [internalInputText, setInternalInputText] = useState(initialLabel);
    const [selectedValue, setSelectedValue] = useState(value || defaultValue);
    const [showList, setShowList] = useState(false);
    const [filtered, setFiltered] = useState(options);
    const containerRef = useRef(null);

    // Handle controlled value prop changes
    useEffect(() => {
      if (value !== undefined && value !== selectedValue) {
        setSelectedValue(value);
        const foundOption = options.find((opt) => opt.value === value);
        if (foundOption) {
          setInternalInputText(foundOption.label);
        }
      }
    }, [value, options]);

    // Handle default value initialization
    useEffect(() => {
      if (value === undefined && defaultValue && !selectedValue) {
        setSelectedValue(defaultValue);
        const foundOption = options.find((opt) => opt.value === defaultValue);
        if (foundOption && !internalInputText) {
          setInternalInputText(foundOption.label);
        }
      }
    }, [defaultValue, options, value, selectedValue, internalInputText]);

    // Handle external inputText control
    useEffect(() => {
      if (inputText !== undefined && inputText !== internalInputText) {
        setInternalInputText(inputText);
      }
    }, [inputText]);

    // Only filter if searchEnabled is true
    useEffect(() => {
      if (searchEnabled) {
        const searchTerm = internalInputText.toLowerCase();
        const filteredOptions = options.filter((opt) =>
          opt.label.toLowerCase().includes(searchTerm)
        );
        setFiltered(filteredOptions);
      } else {
        setFiltered(options);
      }
    }, [options, internalInputText, searchEnabled]);

    // Handle outside clicks
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
      if (!disabled) {
        setFocused(true);
        setFiltered(options);
        setShowList(true);
      }
    };

    const handleInputChange = (e) => {
      const term = e.target.value;
      if (disabled) return;

      if (onInputChange) {
        onInputChange(e);
      } else {
        setInternalInputText(term);
      }

      if (value === undefined) {
        setSelectedValue("");
        if (onChange) onChange({ target: { name, value: "" } });
      }
      setShowList(true);
    };

    const handleSelect = (opt) => {
      if (disabled) return;

      setInternalInputText(opt.label);

      if (value === undefined) {
        setSelectedValue(opt.value);
      }

      if (onChange) {
        onChange({ target: { name, value: opt.value } });
      }

      setShowList(false);
      setFocused(false);
    };

    const displayValue =
      inputText !== undefined ? inputText : internalInputText;
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
          className={`relative border ${borderColor} ${ringClass} rounded-lg bg-white flex items-center ${
            sizeStyles[size]
          } ${widthClass} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          onFocus={handleFocus}
        >
          {/* Floating label */}
          {label && (
            <label
              htmlFor={id || name}
              className={`absolute left-3 px-1 bg-white transition-all pointer-events-none z-10
              ${
                focused || displayValue
                  ? `-top-2 text-xs ${focused ? "text-primary" : "text-black"}`
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
            className="flex-1 bg-transparent outline-none disabled:cursor-not-allowed disabled:opacity-50 whitespace-nowrap overflow-hidden pr-2 max-w-full"
            onFocus={handleFocus}
            onChange={handleInputChange}
            value={displayValue}
            readOnly={!searchEnabled}
            {...props}
          />
        </div>

        {/* Options dropdown */}
        {showList && filtered.length > 0 && !disabled && (
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
