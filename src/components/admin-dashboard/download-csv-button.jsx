import React, { useState } from "react";
import { adminDownloadUsersCsv } from "../../api/serices/api_utils";

const DownloadCsvButton = ({ className = "" }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [message, setMessage] = useState("");

  const handleDownload = async () => {
    setIsDownloading(true);
    setMessage("");

    try {
      const response = await adminDownloadUsersCsv();

      if (response.success) {
        setMessage("CSV downloaded successfully!");
        // Clear success message after 3 seconds
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(response.message || "Failed to download CSV");
        // Clear error message after 5 seconds
        setTimeout(() => setMessage(""), 5000);
      }
    } catch (error) {
      setMessage("An error occurred while downloading");
      setTimeout(() => setMessage(""), 5000);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        onClick={handleDownload}
        disabled={isDownloading}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
          ${
            isDownloading
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-green-600 hover:bg-green-700 text-white hover:shadow-lg"
          }
          focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
          ${className}
        `}
      >
        {isDownloading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Downloading...</span>
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
            <span>Download Users CSV</span>
          </>
        )}
      </button>

      {message && (
        <div
          className={`
          text-sm px-3 py-1 rounded-md
          ${
            message.includes("success")
              ? "text-green-700 bg-green-100 border border-green-200"
              : "text-red-700 bg-red-100 border border-red-200"
          }
        `}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default DownloadCsvButton;
