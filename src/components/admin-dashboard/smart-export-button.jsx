import React, { useState } from "react";
import { adminDownloadUsersCsv } from "../../api/serices/api_utils";

const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-blue-600"
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
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>

          <p className="text-gray-600 mb-6">{message}</p>

          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Downloading...</span>
                </>
              ) : (
                <span>Download</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SmartExportButton = ({ className = "" }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [message, setMessage] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleInitiateDownload = () => {
    setShowConfirmation(true);
  };

  const handleConfirmDownload = async () => {
    setIsDownloading(true);
    setMessage("");

    try {
      const response = await adminDownloadUsersCsv();

      if (response.success) {
        setMessage("✅ CSV downloaded successfully!");
        setShowConfirmation(false);
        setTimeout(() => setMessage(""), 4000);
      } else {
        setMessage(`❌ ${response.message || "Failed to download CSV"}`);
        setTimeout(() => setMessage(""), 6000);
      }
    } catch (error) {
      setMessage("❌ An error occurred while downloading");
      setTimeout(() => setMessage(""), 6000);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCloseConfirmation = () => {
    if (!isDownloading) {
      setShowConfirmation(false);
    }
  };

  return (
    <>
      <div className={`flex flex-col items-end gap-3 ${className}`}>
        {/* Main Download Button */}
        <button
          onClick={handleInitiateDownload}
          disabled={isDownloading}
          className={`
            flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-sm
            ${
              isDownloading
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-md transform hover:-translate-y-0.5"
            }
            focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
          `}
        >
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
              d="M12 10v6m0 0l-3-3m3 3l3-3M7 7h10a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V9a2 2 0 012-2z"
            />
          </svg>
          <span>Export Users</span>
        </button>

        {/* Status Message */}
        {message && (
          <div
            className={`
            text-sm px-4 py-2 rounded-lg max-w-xs text-center shadow-sm
            ${
              message.includes("✅")
                ? "text-emerald-700 bg-emerald-50 border border-emerald-200"
                : "text-red-700 bg-red-50 border border-red-200"
            }
          `}
          >
            {message}
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showConfirmation}
        onClose={handleCloseConfirmation}
        onConfirm={handleConfirmDownload}
        isLoading={isDownloading}
        title="Download Users CSV"
        message="This will download a CSV file containing all user data (excluding sensitive information like passwords). The file will be saved to your downloads folder. Continue?"
      />
    </>
  );
};

export default SmartExportButton;
