import React from "react";

const ButtonCTA = ({
  label,
  onClickHandler,
  fullWidth = false,
  className,
  submit = false,
  isLoading,
}) => {
  return (
    <button
      onClick={onClickHandler}
      className={`py-3 flex justify-center items-center bg-primary rounded w-56 hover:bg-[#005000f0] cursor-pointer ${
        fullWidth ? "w-full" : ""
      } ${className && className}`}
      type={submit ? "submit" : "button"}
    >
      <p className="text-zinc-100 text-base font-semibold">{label}</p>
      {isLoading && <span className="text-white ml-0.5">...</span>}
    </button>
  );
};

export default ButtonCTA;
