import React from "react";

const ButtonCTA = ({ label, onClickHandler, fullWidth = false, className }) => {
  return (
    <button
      onClick={onClickHandler}
      className={`py-3 flex justify-center items-center bg-primary rounded w-56 hover:bg-green-950 ${
        fullWidth ? "w-full" : ""
      } ${className && className}`}
    >
      <p className="text-zinc-100 text-lg font-semibold">{label}</p>
    </button>
  );
};

export default ButtonCTA;
