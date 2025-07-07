import React, { useState } from "react";
import { adminDownloadUsersCsv } from "../../api/serices/api_utils";

const ExportMenu = ({ className = "" }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [message, setMessage] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const handleDownloadCsv = async () => {
    setIsDownloading(true);
    setMessage("");
    setShowDropdown(false);

    try {
      const response = await adminDownloadUsersCsv();

      if (response.success) {
        setMessage("CSV downloaded successfully!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(response.message || "Failed to download CSV");
        setTimeout(() => setMessage(""), 5000);
      }
    } catch (error) {
      setMessage("An error occurred while downloading");
      setTimeout(() => setMessage(""), 5000);
    } finally {
      setIsDownloading(false);
    }
  };

  const exportOptions = [
    {
      id: "csv",
      label: "Download Users CSV",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      action: handleDownloadCsv,
      description: "Export all users data",
    },
  ];

  return (
    <div className={`relative ${className}`}>
      <div className="flex flex-col items-end gap-2">
        {/* Main Export Button */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            disabled={isDownloading}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
              ${
                isDownloading
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg"
              }
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            `}
          >
            {isDownloading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span>Export Data</span>
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </>
            )}
          </button>

          {/* Dropdown Menu */}
          {showDropdown && !isDownloading && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="py-2">
                <div className="px-4 py-2 text-sm font-medium text-gray-700 border-b border-gray-100">
                  Export Options
                </div>
                {exportOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={option.action}
                    className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150"
                  >
                    <div className="text-gray-500 mt-0.5">{option.icon}</div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {option.label}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {option.description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Status Message */}
        {message && (
          <div
            className={`
            text-sm px-3 py-2 rounded-md max-w-xs
            ${
              message.includes("success")
                ? "text-green-700 bg-green-100 border border-green-200"
                : "text-red-700 bg-red-100 border border-red-200"
            }
          `}
          >
            <div className="flex items-center gap-2">
              {message.includes("success") ? (
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
              <span>{message}</span>
            </div>
          </div>
        )}
      </div>

      {/* Overlay to close dropdown when clicking outside */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default ExportMenu;
