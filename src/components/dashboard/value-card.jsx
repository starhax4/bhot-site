import React from "react";

const ValueCard = ({
  title = "Current Value Estimate",
  desc = false,
  lowValue = "xxx,xxx",
  estimate = "xxx,xxx",
  highValue = "xxx,xxx",
}) => {
  return (
    <div className="flex flex-col w-full sm:w-[90%] md:flex-wrap md:w-[20vw] lg:w-[20vw] px-3 sm:px-5 lg:px-6 py-4 sm:py-5 md:py-6 bg-white shadow-[0px_10px_20px_0px_rgba(0,0,0,0.20)] rounded-3xl">
      <div>
        <p className="text-base font-semibold text-primary">{title}</p>
        {desc && (
          <p className="text-sm font-semibold text-neutral-400">
            If all receommendations implemented
          </p>
        )}
      </div>
      <div
        className={`flex flex-col gap-3 sm:gap-4 px-4 sm:px-6 md:px-2 lg:px-4 ${
          desc ? "mt-0" : "mt-4 sm:mt-6"
        }`}
      >
        <div className="flex items-center justify-between sm:justify-start sm:gap-8 md:gap-4 lg:gap-8">
          <p className="text-neutral-400 text-sm font-semibold">Low:</p>
          <p className="text-neutral-400 text-sm">£{lowValue}</p>
        </div>
        <div className="flex items-center md:flex justify-between sm:justify-start sm:gap-6 md:flex-wrap md:gap-1 lg:gap-4">
          <p className="text-primary font-semibold">Estimate:</p>
          <p className="text-primary">£{estimate}</p>
        </div>
        <div className="flex items-center justify-between sm:justify-start sm:gap-8 md:gap-4 lg:gap-8">
          <p className="text-neutral-400 text-sm font-semibold">High:</p>
          <p className="text-neutral-400 text-sm">£{highValue}</p>
        </div>
      </div>
    </div>
  );
};

export default ValueCard;
