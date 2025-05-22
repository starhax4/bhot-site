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
//   epcImpact: string;
//   estimatedValueImpact: string;
//   totalPaybackPeriod?: string;
//   locked?: boolean;
// }

// Seed data for different addresses, in a real app this would come from an API
const address1Recommendations = [
  {
    id: "1a",
    measure: "Internal Wall Insulation",
    cost: "£4,000 - £14,000",
    yearlySaving: "£271",
    epcImpact: "+ 8 pts",
    estimatedValueImpact: "£20,000 - £40,000",
    totalPaybackPeriod: "0.5 years",
  },
  {
    id: "2a",
    measure: "Solar Water Heating",
    cost: "£4,000 - £6,000",
    yearlySaving: "£55",
    epcImpact: "+ 2 pts",
    estimatedValueImpact: "£20,000 - £40,000",
    totalPaybackPeriod: "0.5 years",
    locked: true,
  },
  {
    id: "3a",
    measure: "Solar Electricity System",
    cost: "£6,000 - £8,000",
    yearlySaving: "£100",
    epcImpact: "+ 3 pts",
    estimatedValueImpact: "£20,000 - £40,000",
    totalPaybackPeriod: "0.5 years",
    locked: true,
  },
];

const address2Recommendations = [
  {
    id: "1b",
    measure: "Loft Insulation",
    cost: "£1,500 - £3,000",
    yearlySaving: "£215",
    epcImpact: "+ 5 pts",
    estimatedValueImpact: "£8,000 - £15,000",
    totalPaybackPeriod: "0.3 years",
  },
  {
    id: "2b",
    measure: "Double Glazing",
    cost: "£5,000 - £8,000",
    yearlySaving: "£120",
    epcImpact: "+ 4 pts",
    estimatedValueImpact: "£20,000 - £40,000",
    totalPaybackPeriod: "0.5 years",
    locked: true,
  },
  {
    id: "3b",
    measure: "Heat Pump",
    cost: "£8,000 - £15,000",
    yearlySaving: "£350",
    epcImpact: "+ 10 pts",
    estimatedValueImpact: "£20,000 - £40,000",
    totalPaybackPeriod: "0.5 years",
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
                Value Impact
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
            {recommendations.map((row, index) => (
              <tr
                key={row.id}
                className={index % 2 === 0 ? "bg-white" : "bg-white"}
              >
                <td className="px-2 py-4 text-wrap text-[11px] sm:text-xs font-bold font-['Sora']">
                  {row.measure}
                </td>
                <td className="px-2 py-4 text-wrap text-black text-[11px] sm:text-xs font-normal font-['Sora']">
                  {row.cost}
                </td>
                <td className="px-1 py-4 text-center text-black text-[11px] sm:text-xs font-normal font-['Sora']">
                  {row.yearlySaving}
                </td>
                <td className="px-1 py-4 text-center text-black text-[11px] sm:text-xs font-normal font-['Sora']">
                  {row.epcImpact}
                </td>
                <td
                  className="px-2 py-4 text-center text-black text-[11px] sm:text-xs font-normal font-['Sora']"
                  colSpan={user.plan === "Basic" && row.locked ? "2" : "1"}
                >
                  {user.plan === "Basic" && row.locked ? (
                    <Link to="/pricing">
                      <div className="flex flex-col items-center text-center">
                        <LockIcon />
                        <span className="text-[10px] sm:text-xs text-gray-500 mt-1">
                          Upgrade to unlock
                        </span>
                      </div>
                    </Link>
                  ) : (
                    row.estimatedValueImpact
                  )}
                </td>
                <td className="px-2 py-4 text-center text-black text-[11px] sm:text-xs font-normal font-['Sora']">
                  {row.totalPaybackPeriod || ""}
                </td>
              </tr>
            ))}
            <tr className="">
              <td className="px-2 py-4">
                <div className="w-14 h-5 sm:w-16 sm:h-6 bg-gray-600 rounded-full"></div>
              </td>
              <td className="px-2 py-4">
                <div className="w-14 h-5 sm:w-16 sm:h-6 bg-gray-300 rounded-full"></div>
              </td>
              <td className="px-1 py-4">
                <div className="w-12 h-5 sm:w-14 sm:h-6 bg-gray-300 rounded-full"></div>
              </td>
              <td className="px-1 py-4">
                <div className="w-10 h-5 sm:w-12 sm:h-6 bg-gray-300 rounded-full"></div>
              </td>
              <td className="px-2 py-4">
                <div className="w-14 h-5 sm:w-16 sm:h-6 bg-gray-300 rounded-full"></div>
              </td>
              <td className="px-2 py-4">
                <div className="w-12 h-5 sm:w-14 sm:h-6 bg-gray-300 rounded-full"></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecommendationsTable;
