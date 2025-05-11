import React from "react";

const Input = ({
  name,
  label,
  placeHolder,
  required = false,
  className,
  type = "text",
  disabled = false,
  value,
  labelClassName,
}) => {
  return (
    <div className="flex flex-col">
      <label
        htmlFor={name}
        className={`text-primary ${labelClassName ? labelClassName : ""}`}
      >
        {label}
      </label>
      {value ? (
        <input
          type={type}
          name={name}
          id={name}
          placeholder={placeHolder && placeHolder}
          required={required}
          className={`px-4 py-2 outline rounded disabled:outline-gray-100 ${
            className ? className : ""
          }`}
          disabled={disabled}
          value={value}
        />
      ) : (
        <input
          type={type}
          name={name}
          id={name}
          placeholder={placeHolder && placeHolder}
          required={required}
          className={`px-4 py-2 outline rounded disabled:outline-gray-100 focus-visible:outline-primary ${
            className ? className : ""
          }`}
          disabled={disabled}
        />
      )}
    </div>
  );
};

export default Input;
