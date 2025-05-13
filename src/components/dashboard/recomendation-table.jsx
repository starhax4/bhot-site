const RecomendationTable = () => {
  return (
    <div className="flex w-[45vw] px-4 pt-4 pb-10 bg-white  shadow-lg rounded-3xl">
      <div></div>
    </div>
  );
};

import React from "react";
import { Link } from "react-router";

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

const dummyData = [
  {
    id: "1",
    measure: "Internal Wall Insulation",
    cost: "£4,000 - £14,000",
    yearlySaving: "£271",
    epcImpact: "+ 8 pts",
    estimatedValueImpact: "£20,000 - £40,000",
    totalPaybackPeriod: "0.5 years",
  },
  {
    id: "2",
    measure: "Solar Water Heating",
    cost: "£4,000 - £6,000",
    yearlySaving: "£55",
    epcImpact: "+ 2 pts",
    estimatedValueImpact: "Upgrade to unlock",
    locked: true,
  },
  // Add more dummy data rows here if needed
];

const LockIcon = () => (
  <img
    src="/lock.svg"
    alt="paid-lock"
  />
);

const RecommendationsTable = ({ data }) => {
  return (
    <div className="w-full bg-white p-4 sm:p-6 rounded-3xl shadow-lg md:w-[45vw] mx-auto">
      <h2 className="text-sm font-semibold text-primary mb-4">
        Recommendations
      </h2>
      <div className="overflow-x-scroll">
        <table className="min-w-full divide-y divide-gray-200 overflow-x-scroll">
          <thead className="bg-white">
            <tr>
              <th
                scope="col"
                className="px-4 py-3 text-left text-black text-sm font-bold font-['Sora'] uppercase tracking-wider"
              >
                Measure
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-black text-sm font-bold font-['Sora'] uppercase tracking-wider"
              >
                Cost
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-black text-sm font-bold font-['Sora'] uppercase tracking-wider"
              >
                Yearly Saving
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-black text-sm font-bold font-['Sora'] uppercase tracking-wider"
              >
                EPC Impact
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-black text-sm font-bold font-['Sora'] uppercase tracking-wider"
              >
                Estimated Value Impact
              </th>
              <th
                scope="col"
                className="px-1 py-3 text-left text-black text-sm font-bold font-['Sora'] uppercase tracking-wider"
              >
                Total Payback Period
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, index) => (
              <tr
                key={row.id}
                className={
                  index % 2 === 0
                    ? "bg-white"
                    : "bg-white" /* Alternating rows not in image, so keeping white */
                }
              >
                <td className="px-4 py-9 text-wrap text-sm font-bold font-['Sora']">
                  {row.measure}
                </td>
                <td className="px-4 py-9 text-wrap text-black text-sm font-normal font-['Sora']">
                  {row.cost}
                </td>
                <td className="px-4 py-9 text-wrap text-black text-sm font-normal font-['Sora']">
                  {row.yearlySaving}
                </td>
                <td className="px-4 py-9 text-wrap text-black text-sm font-normal font-['Sora']">
                  {row.epcImpact}
                </td>
                <td className="px-4 py-9 text-wrap text-black text-sm font-normal font-['Sora']">
                  {row.locked ? (
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
          </tbody>
        </table>
      </div>
      {/* Placeholder for the greyed out buttons/indicators at the bottom */}
      <div className="my-9 flex space-x-2 sm:space-x-6 justify-center sm:justify-start">
        <div className="w-16 h-8 sm:w-20 sm:h-10 bg-gray-600 rounded-full"></div>
        <div className="w-16 h-8 sm:w-20 sm:h-10 bg-gray-300 rounded-full"></div>
        <div className="w-16 h-8 sm:w-20 sm:h-10 bg-gray-300 rounded-full"></div>
        <div className="w-16 h-8 sm:w-20 sm:h-10 bg-gray-300 rounded-full"></div>
        <div className="w-16 h-8 sm:w-20 sm:h-10 bg-gray-300 rounded-full"></div>
        <div className="w-16 h-8 sm:w-20 sm:h-10 bg-gray-300 rounded-full"></div>
      </div>
    </div>
  );
};

export default RecommendationsTable;
