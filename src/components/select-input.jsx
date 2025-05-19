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

    // Initialize and synchronize input display text and selected value
    useEffect(() => {
      if (defaultValue) {
        // If defaultValue is truthy, ensure selectedValue and inputText align with it.
        // This handles cases where defaultValue prop itself changes to a new truthy value.
        if (selectedValue !== defaultValue) {
          setSelectedValue(defaultValue);
        }
        const foundOption = options.find((opt) => opt.value === defaultValue);
        const newText = foundOption ? foundOption.label : "";
        if (inputText !== newText) {
          setInputText(newText);
        }
      } else {
        // If defaultValue is falsy (e.g., "", null, undefined).
        // Only reset to this falsy defaultValue if no actual selection has been made by the user.
        // This prevents wiping out a user's selection if the component re-renders
        // (e.g., due to options prop changing reference) and defaultValue is empty.
        if (!selectedValue) {
          // Check if selectedValue is also falsy
          if (inputText !== "") {
            setInputText("");
          }
          // Ensure selectedValue is strictly the defaultValue (e.g. "" vs null)
          if (selectedValue !== defaultValue) {
            setSelectedValue(defaultValue);
          }
        }
        // If selectedValue is truthy here, it means the user has made a selection.
        // Even if defaultValue is falsy, we don't override the user's choice.
        // However, we should ensure the inputText matches the selectedValue's label if options changed.
        else {
          const foundOption = options.find(
            (opt) => opt.value === selectedValue
          );
          const newText = foundOption
            ? foundOption.label
            : selectedValue
            ? inputText
            : ""; // Keep inputText if selectedValue became invalid but was truthy
          if (inputText !== newText && foundOption) {
            // Only update if found and different
            setInputText(newText);
          } else if (!foundOption && selectedValue) {
            // Selected value is no longer in options, but it was a user selection.
            // Decide behavior: clear, or keep text? For now, keep text if it was a specific selection.
            // Or, to be safe, if value not in options, clear.
            // Let's clear if not found, to avoid stale display text for an invalid value.
            // setInputText(""); // This might be too aggressive if user is typing a custom value not in options.
            // For a select, typically the value must be in options.
            // If selectedValue is not in options, it's effectively invalid.
            // The current logic for handleSelect ensures selectedValue is from options.
            // This path implies selectedValue exists but its option disappeared.
          }
        }
      }
    }, [defaultValue, options, selectedValue, inputText]); // Dependencies updated

    const displayValue = inputText;

    // // Filter local options always
    useEffect(() => {
      setFiltered(
        options.filter((opt) =>
          opt.label.toLowerCase().includes(displayValue.toLowerCase())
        )
      );
    }, [options, displayValue]);

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
