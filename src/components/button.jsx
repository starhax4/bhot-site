import React from "react";

const ButtonCTA = ({
  label,
  onClickHandler,
  fullWidth = false,
  className,
  submit = false,
  isLoading,
  disabled,
  props,
}) => {
  return (
    <button
      onClick={onClickHandler}
      className={`py-3 flex justify-center items-center rounded w-56 transition-colors
      ${fullWidth ? "w-full" : ""}
      ${className || ""} 
      ${
        disabled || isLoading
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-primary hover:bg-[#005000f0] cursor-pointer"
      }`}
      type={submit ? "submit" : "button"}
      {...props}
      disabled={disabled || isLoading} // Also disable if loading
    >
      <p
        className={`text-base font-semibold ${
          disabled || isLoading ? "text-gray-600" : "text-zinc-100"
        }`}
      >
        {label}
      </p>
      {isLoading && <span className="text-white ml-0.5">...</span>}
    </button>
  );
};

export default ButtonCTA;
