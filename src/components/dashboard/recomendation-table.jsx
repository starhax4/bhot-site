import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { useAuth } from "../../context/auth/AuthContext";

const RecomendationTable = () => {
  return (
    <div className="flex w-[45vw] px-4 pt-4 pb-10 bg-white  shadow-lg rounded-3xl">
      <div></div>
    </div>
  );
};

// interface RecommendationRow {
//   id: string;
//   measure: string;
//   cost: string;
//   yearlySaving: string;
//   epc_impact: string;
//   estimated_value_impact: string;
//   total_payback_period?: string;
//   locked?: boolean;
// }

// Seed data for different addresses, in a real app this would come from an API
const address1Recommendations = [
  {
    id: "1a",
    measure: "Internal Wall Insulation",
    cost: "£4,000 - £14,000",
    potential_yearly_bills_saving: "£271",
    epc_impact: "+ 8 pts",
    estimated_value_impact: "£20,000 - £40,000",
    total_payback_period: "0.5 years",
  },
  {
    id: "2a",
    measure: "Solar Water Heating",
    cost: "£4,000 - £6,000",
    potential_yearly_bills_saving: "£55",
    epc_impact: "+ 2 pts",
    estimated_value_impact: "£20,000 - £40,000",
    total_payback_period: "0.5 years",
    locked: true,
  },
  {
    id: "3a",
    measure: "Solar Electricity System",
    cost: "£6,000 - £8,000",
    potential_yearly_bills_saving: "£100",
    epc_impact: "+ 3 pts",
    estimated_value_impact: "£20,000 - £40,000",
    total_payback_period: "0.5 years",
    locked: true,
  },
];

const address2Recommendations = [
  {
    id: "1b",
    measure: "Loft Insulation",
    cost: "£1,500 - £3,000",
    potential_yearly_bills_saving: "£215",
    epc_impact: "+ 5 pts",
    estimated_value_impact: "£8,000 - £15,000",
    total_payback_period: "0.3 years",
  },
  {
    id: "2b",
    measure: "Double Glazing",
    cost: "£5,000 - £8,000",
    potential_yearly_bills_saving: "£120",
    epc_impact: "+ 4 pts",
    estimated_value_impact: "£20,000 - £40,000",
    total_payback_period: "0.5 years",
    locked: true,
  },
  {
    id: "3b",
    measure: "Heat Pump",
    cost: "£8,000 - £15,000",
    potential_yearly_bills_saving: "£350",
    epc_impact: "+ 10 pts",
    estimated_value_impact: "£20,000 - £40,000",
    total_payback_period: "0.5 years",
    locked: true,
  },
];

const LockIcon = () => (
  <img
    src="/lock.svg"
    alt="paid-lock"
  />
);

const RecommendationsTable = ({ data, addressId }) => {
  const { user, currentAddress } = useAuth();

  const [recommendations, setRecommendations] = useState(
    data || address1Recommendations
  );

  // Update recommendations based on current address
  useEffect(() => {
    if (user && user.plan === "Pro" && currentAddress) {
      // In a real app, we would fetch the recommendations from an API
      // For now, we'll just toggle between our two sets of dummy data
      const newRecommendations =
        currentAddress.id === "addr1"
          ? address1Recommendations
          : address2Recommendations;

      setRecommendations(newRecommendations);
    } else {
      // For non-Pro users or users without an address, use the default data
      setRecommendations(data || address1Recommendations);
    }
  }, [currentAddress, user, data]);

  // Fallback for user.plan if user is null
  const userPlan = user?.plan || "Free";
  // Ensure userPlan is always lowercase for comparison
  const isFree = String(userPlan).toLowerCase() === "free";
  const visibleRows = recommendations;

  // Handler for locked cell click
  const handleLockedClick = (e) => {
    e.preventDefault();
    window.location.href = "/pricing";
  };

  return (
    <div className="w-full bg-white px-2 py-2 sm:py-4 sm:px-4 rounded-3xl shadow-[0px_10px_20px_0px_rgba(0,0,0,0.20)] md:w-[45vw] mx-auto">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-sm sm:text-base font-semibold text-primary">
          Recommendations
        </h2>
      </div>
      <div className="overflow-x-scroll overflow-y-auto md:overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-600">
          <thead className="bg-white">
            <tr>
              <th
                scope="col"
                className="px-2 py-3 text-left text-black text-[11px] sm:text-sm font-bold font-['Sora'] tracking-wider"
              >
                Measure
              </th>
              <th
                scope="col"
                className="px-2 py-3 text-left text-black text-[11px] sm:text-sm font-bold font-['Sora'] tracking-wider w-2"
              >
                Cost
              </th>
              <th
                scope="col"
                className="px-1 py-3 text-center text-black text-[11px] sm:text-sm font-bold font-['Sora'] tracking-wider whitespace-normal w-1"
              >
                Potential Yearly Bills Saving
              </th>
              <th
                scope="col"
                className="px-1 py-3 text-center text-black text-[11px] sm:text-sm font-bold font-['Sora'] tracking-wider max-w-[80px]"
              >
                EPC Impact
              </th>
              <th
                scope="col"
                className="px-2 py-3 text-center text-black text-[11px] sm:text-sm font-bold font-['Sora'] tracking-wider w-1"
              >
                Estimated Value Impact
              </th>
              <th
                scope="col"
                className="px-2 py-3 text-center text-black text-[11px] sm:text-sm font-bold font-['Sora'] tracking-wider whitespace-normal w-1"
              >
                Total Payback Period
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {visibleRows.map((row, index) => {
              // For Free users, lock all rows
              const isLocked = isFree;
              return (
                <tr
                  key={row.id || index}
                  className={index % 2 === 0 ? "bg-white" : "bg-white"}
                >
                  <td className="px-2 py-4 text-wrap text-primary text-[11px] sm:text-xs font-bold font-['Sora']">
                    {row.measure}
                  </td>
                  <td className="px-2 py-4 text-wrap text-black text-[11px] sm:text-xs font-normal font-['Sora']">
                    {row.cost}
                  </td>
                  <td className="px-1 py-4 text-center text-black text-[11px] sm:text-xs font-normal font-['Sora']">
                    {row.potential_yearly_bills_saving}
                  </td>
                  <td className="px-1 py-4 text-center text-black text-[11px] sm:text-xs font-normal font-['Sora']">
                    {row.epc_impact}
                  </td>
                  {/* Estimated Value Impact */}
                  <td
                    className="px-2 py-4 text-center text-black text-[11px] sm:text-xs font-normal font-['Sora'] cursor-pointer"
                    onClick={isLocked ? handleLockedClick : undefined}
                  >
                    {isLocked ? (
                      <div className="flex flex-col items-center text-center">
                        <LockIcon />
                        <span className="text-[10px] sm:text-xs text-gray-500 mt-1">
                          Upgrade to unlock
                        </span>
                      </div>
                    ) : (
                      row.estimated_value_impact
                    )}
                  </td>
                  {/* Total Payback Period */}
                  <td
                    className="px-2 py-4 text-center text-black text-[11px] sm:text-xs font-normal font-['Sora'] cursor-pointer"
                    onClick={isLocked ? handleLockedClick : undefined}
                  >
                    {isLocked ? (
                      <div className="flex flex-col items-center text-center">
                        <LockIcon />
                        <span className="text-[10px] sm:text-xs text-gray-500 mt-1">
                          Upgrade to unlock
                        </span>
                      </div>
                    ) : (
                      row.total_payback_period || ""
                    )}
                  </td>
                </tr>
              );
            })}
            {/* Placeholders removed as requested */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecommendationsTable;
