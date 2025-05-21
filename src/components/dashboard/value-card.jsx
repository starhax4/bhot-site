import React from "react";

const ValueCard = ({
  title = "Current Value Estimate",
  desc = false,
  lowValue = "xxx,xxx",
  estimate = "xxx,xxx",
  highValue = "xxx,xxx",
}) => {
  return (
    <div className="flex flex-col md:w-[21vw] px-6 py-6 bg-white shadow-[0px_10px_20px_0px_rgba(0,0,0,0.20)] rounded-3xl">
      <div>
        <p className="text-base font-semibold text-primary">{title}</p>
        {desc && (
          <p className="text-sm font-semibold text-neutral-400">
            If all receommendations implemented
          </p>
        )}
      </div>
      <div className={`flex flex-col gap-4 px-8 ${desc ? "mt-0" : "mt-6"}`}>
        <div className="flex flex-wrap sm:gap-13 md:gap-5 lg:gap-13">
          <p className="text-neutral-400 text-sm font-semibold">Low:</p>
          <p className="text-neutral-400 text-sm ">£{lowValue}</p>
        </div>
        <div className="flex flex-wrap gap-5">
          <p className="text-primary font-semibold">Estimate:</p>
          <p className="text-primary">£{estimate}</p>
        </div>
        <div className="flex flex-wrap sm:gap-12 md:gap-5 lg:gap-12">
          <p className="text-neutral-400 text-sm font-semibold">High:</p>
          <p className="text-neutral-400 text-sm ">£{highValue}</p>
        </div>
      </div>
    </div>
  );
};

export default ValueCard;
