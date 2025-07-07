import React from "react";
import SmartExportButton from "./smart-export-button";

const ExportSection = ({ summary }) => {
  return (
    <div className="bg-white rounded-3xl shadow-[0px_10px_20px_0px_rgba(0,0,0,0.20)] p-6  md:w-[93vw] md:mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12  rounded-lg flex items-center justify-center">
            <img
              src="/user.svg"
              alt="user-icon"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              User Data Export
            </h3>
            <p className="text-gray-600 text-sm">
              Export all registered users to CSV
            </p>
          </div>
        </div>
        <SmartExportButton />
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Secure export (passwords excluded)</span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Real-time data</span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-purple-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span>CSV format</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportSection;
