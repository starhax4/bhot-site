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
    <div className="w-full bg-white px-4 py-2 sm:py-6 sm:px-6 rounded-3xl shadow-[0px_10px_20px_0px_rgba(0,0,0,0.20)] md:w-[45vw] mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-primary my-2">
          Recommendations
        </h2>
        {user && user.plan === "Pro" && currentAddress && (
          <p className="text-sm text-gray-500">
            For: {currentAddress.street}, {currentAddress.city}
          </p>
        )}
      </div>
      <div className="overflow-x-scroll overflow-y-auto md:overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-white">
            <tr>
              <th
                scope="col"
                className="px-4 py-3 text-left text-black text-sm font-bold font-['Sora'] tracking-wider"
              >
                Measure
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-black text-sm font-bold font-['Sora']  tracking-wider"
              >
                Cost
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-black text-sm font-bold font-['Sora']  tracking-wider"
              >
                Potential Yearly Bills Saving
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-black text-sm font-bold font-['Sora']  tracking-wider"
              >
                EPC Impact
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-black text-sm font-bold font-['Sora']  tracking-wider"
              >
                Estimated Value Impact
              </th>
              <th
                scope="col"
                className="px-1 py-3 text-left text-black text-sm font-bold font-['Sora']  tracking-wider"
              >
                Total Payback Period
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {recommendations.map((row, index) => (
              <tr
                key={row.id}
                className={
                  index % 2 === 0
                    ? "bg-white"
                    : "bg-white" /* Alternating rows not in image, so keeping white */
                }
              >
                <td className="px-4 py-6 text-wrap text-sm font-bold font-['Sora']">
                  {row.measure}
                </td>
                <td className="px-4 py-6 text-wrap text-black text-sm font-normal font-['Sora']">
                  {row.cost}
                </td>
                <td className="px-4 py-6 text-wrap text-black text-sm font-normal font-['Sora']">
                  {row.yearlySaving}
                </td>
                <td className="px-4 py-6 text-wrap text-black text-sm font-normal font-['Sora']">
                  {row.epcImpact}
                </td>
                <td
                  className="row-span-2 px-4 py-6 text-wrap text-black text-sm font-normal font-['Sora']"
                  colSpan={user.plan === "Basic" && row.locked ? "2" : "1"}
                >
                  {user.plan === "Basic" && row.locked ? (
                    <Link to="/pricing">
                      <div className="flex flex-col items-center text-center">
                        <LockIcon />
                        <span className="text-xs text-gray-500 mt-1">
                          Upgrade to unlock
                        </span>
                      </div>
                    </Link>
                  ) : (
                    row.estimatedValueImpact
                  )}
                </td>
                <td className="px-4 py-4 text-wrap text-black text-sm font-normal font-['Sora']">
                  {row.totalPaybackPeriod || ""}
                </td>
              </tr>
            ))}
            <tr className="">
              <td className="px-4 py-6">
                <div className="w-16 h-6 sm:w-20 sm:h-8 bg-gray-600 rounded-full"></div>
              </td>
              <td className="px-2 py-6">
                <div className="w-16 h-6 sm:w-20 sm:h-8 bg-gray-300 rounded-full"></div>
              </td>
              <td className="px-2 py-6">
                <div className="w-16 h-6 sm:w-20 sm:h-8 bg-gray-300 rounded-full"></div>
              </td>
              <td className="px-2 py-6">
                <div className="w-16 h-6 sm:w-20 sm:h-8 bg-gray-300 rounded-full"></div>
              </td>
              <td className="px-4 py-6">
                <div className="w-16 h-6 sm:w-20 sm:h-8 bg-gray-300 rounded-full"></div>
              </td>
              <td className="py-6">
                <div className="w-16 h-6 sm:w-20 sm:h-8 bg-gray-300 rounded-full"></div>
              </td>
            </tr>
            {/* <tr>
              <td className="px-4 py-6">
                <div className="w-16 h-6 sm:w-20 sm:h-8 bg-gray-600 rounded-full"></div>
              </td>
              <td className="px-2 py-6">
                <div className="w-16 h-6 sm:w-20 sm:h-8 bg-gray-300 rounded-full"></div>
              </td>
              <td className="px-2 py-6">
                <div className="w-16 h-6 sm:w-20 sm:h-8 bg-gray-300 rounded-full"></div>
              </td>
              <td className="px-2 py-6">
                <div className="w-16 h-6 sm:w-20 sm:h-8 bg-gray-300 rounded-full"></div>
              </td>
              <td className="px-4 py-6">
                <div className="w-16 h-6 sm:w-20 sm:h-8 bg-gray-300 rounded-full"></div>
              </td>
              <td className="py-6">
                <div className="w-16 h-6 sm:w-20 sm:h-8 bg-gray-300 rounded-full"></div>
              </td>
            </tr> */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecommendationsTable;
