import React from "react";

const DetailCard = ({
  title = "Current Value Estimate",
  userCard = false,
  value,
  percentage,
  isDecreasing = false,
}) => {
  return (
    <div className="flex flex-col gap-7 md:w-64 md:h-40 px-4 py-4 bg-white  shadow-lg rounded-3xl">
      <div className="flex justify-between">
        <div className="flex flex-col gap-5">
          <p className="text-neutral-800 text-base font-semibold font-['Nunito_Sans']">
            {title}
          </p>
          <p className="text-neutral-800 text-3xl font-bold font-['Nunito_Sans'] tracking-wide">
            {userCard ? "" : "£"}
            {value}
          </p>
        </div>
        <div>
          {userCard ? (
            <img
              src="/user.svg"
              alt="user-icon"
            />
          ) : (
            <img
              src="/sales.svg"
              alt="sales-icon"
            />
          )}
        </div>
      </div>
      <div className="flex">
        <div>
          {isDecreasing ? (
            <img
              src="/dec.svg"
              alt="decreasing-value"
            />
          ) : (
            <img
              src="/inc.svg"
              alt="increasing-value"
            />
          )}
        </div>
        <div>
          <p className="text-base text-zinc-600 font-semibold font-['Nunito_Sans']">
            <span
              className={`${
                isDecreasing ? "text-text-rose-500" : "text-teal-500"
              }`}
            >
              {percentage}%
            </span>
            {"  "}
            {isDecreasing ? "Down" : "Up"} from yesterday
          </p>
        </div>
      </div>
    </div>
  );
};

export default DetailCard;
