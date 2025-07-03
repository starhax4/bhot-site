import React from "react";
import { useAuth } from "../../context/auth/AuthContext";
import { useNavigate } from "react-router";

const LockIcon = () => (
  <svg
    className="inline w-5 h-5 mr-2 align-middle"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="6"
      y="10"
      width="12"
      height="8"
      rx="2"
      fill="currentColor"
      fillOpacity="0.15"
    />
    <path
      d="M8 10V8a4 4 0 1 1 8 0v2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx="12"
      cy="14"
      r="1.5"
      fill="currentColor"
    />
  </svg>
);

const ValueCard = ({
  title = "Current Value Estimate",
  desc = false,
  lowValue = "xxx,xxx",
  estimate = "xxx,xxx",
  highValue = "xxx,xxx",
}) => {
  const { user } = useAuth();
  const isFreePlan = user?.plan === "free" || !user?.plan;
  const navigate = useNavigate();

  const handleUpgradeClick = () => {
    navigate("/pricing");
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-md px-6 py-6 flex flex-col gap-4 md:gap-6 border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-0">
        <div>
          <p className="text-lg md:text-xl font-bold text-primary mb-1">
            {title}
          </p>
          {desc && (
            <p className="text-xs font-semibold text-neutral-400">
              If all recommendations with value uplift are implemented
            </p>
          )}
        </div>
        {isFreePlan ? (
          <div className="flex flex-col items-center justify-center w-full md:w-auto mt-4 md:mt-0">
            <button
              className="flex items-center bg-primary text-white font-semibold px-6 py-2 rounded-full shadow hover:bg-green-950 cursor-pointer"
              onClick={handleUpgradeClick}
            >
              <LockIcon /> Upgrade to Unlock
            </button>
            <span className="text-xs text-gray-400 mt-2">
              Upgrade your plan to view value estimates
            </span>
          </div>
        ) : (
          (() => {
            // Check if all values indicate "No Historical Uplift"
            const isNoHistoricalUplift =
              lowValue === "£000000" &&
              estimate === "£000000" &&
              highValue === "£000000";

            if (isNoHistoricalUplift) {
              return (
                <div className="flex justify-center mt-2 md:mt-0">
                  <div className="flex flex-col items-center">
                    <span className="ext-lg md:text-2xl font-extrabold text-primary bg-primary/10 rounded px-4 py-1">
                      No Historical Uplift
                    </span>
                    {/* <span className="text-lg md:text-2xl font-extrabold text-primary bg-primary/10 rounded px-4 py-1 mt-1">
                      {estimate}
                    </span> */}
                  </div>
                </div>
              );
            }

            return (
              <div className="flex gap-2 md:gap-4 mt-2 md:mt-0">
                <div className="flex flex-col items-center">
                  <span className="text-xs text-neutral-400 font-semibold">
                    Low
                  </span>
                  <span className="text-base md:text-lg font-bold text-gray-600 bg-gray-50 rounded px-3 py-1 mt-1">
                    {lowValue}
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs text-primary font-semibold">
                    Estimate
                  </span>
                  <span className="text-lg md:text-2xl font-extrabold text-primary bg-primary/10 rounded px-4 py-1 mt-1">
                    {estimate}
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs text-neutral-400 font-semibold">
                    High
                  </span>
                  <span className="text-base md:text-lg font-bold text-gray-600 bg-gray-50 rounded px-3 py-1 mt-1">
                    {highValue}
                  </span>
                </div>
              </div>
            );
          })()
        )}
      </div>
    </div>
  );
};

export default ValueCard;
