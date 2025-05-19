import { FileText, Upload, X, Pen } from "lucide-react";
import axios from "axios";
import { API_ROUTER } from "../../../../App";
import { useState, useEffect } from "react";

export default function StudentEditAccreditation({
  document,
  onClose,
  accreditationId,
  orgName,
}) {
  // Revision popup component
  const [showFileRenderer, setShowFileRenderer] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  if (!document) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setUploadError(null); // Clear any previous error
      console.log("Selected file:", file); // Log selected file data
    }
  };

  const handleEditClick = () => {
    setShowFileRenderer(true);
  };

  // Function to upload revised document
  // Frontend function to upload revised document
  const uploadRevisedDocument = async (
    accreditationId,
    documentId,
    file,
    orgName
  ) => {
    const formData = new FormData();

    // Add organization metadata
    formData.append("orgName", orgName);
    formData.append("orgFolder", orgName);
    formData.append("orgDocumentClassification", "Accreditation");
    formData.append("orgDocumentTitle", "Accreditation");
    formData.append("documentId", documentId); // Add documentId to identify which document to update

    // Append file based on its type
    if (file && file.type) {
      if (file.type.startsWith("image/")) {
        formData.append("photo", file);
      } else if (
        file.type === "application/pdf" ||
        file.type === "application/msword" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        formData.append("document", file);
      } else {
        formData.append("file", file);
      }
      formData.append("fileName", file.name); // Using a consistent key instead of document.label
    }

    // Debug: Log all form data entries
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    // API request
    const response = await axios.post(
      `${API_ROUTER}/student-update-accreditation/${accreditationId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  };

  const handleUploadDocument = async () => {
    if (!selectedFile) {
      setUploadError("Please select a file to upload");
      return;
    }

    try {
      setIsUploading(true);
      setUploadError(null);

      // Log what we're uploading
      console.log("Uploading document data:");
      console.log("- File:", selectedFile);
      console.log("- File name:", selectedFile.name);
      console.log("- File size:", selectedFile.size);
      console.log("- File type:", selectedFile.type);
      console.log("- Accreditation ID:", accreditationId);
      console.log("- Document ID:", document._id);
      console.log("- Organization name:", orgName);

      const result = await uploadRevisedDocument(
        accreditationId,
        document._id,
        selectedFile,
        orgName
      );

      console.log("Upload result:", result);

      setUploadSuccess(true);
    } catch (error) {
      console.error("Error uploading document:", error);
      setUploadError(
        error.response?.data?.message || "Failed to upload document"
      );
    } finally {
      setIsUploading(false);
    }
  };

  // Status badge component with appropriate colors
  const StatusBadge = ({ status }) => {
    let bgColor = "bg-yellow-100";
    let textColor = "text-yellow-800";

    switch (status?.toLowerCase()) {
      case "approved":
        bgColor = "bg-green-100";
        textColor = "text-green-800";
        break;
      case "rejected":
        bgColor = "bg-red-100";
        textColor = "text-red-800";
        break;
      case "revision":
      case "revision required":
        bgColor = "bg-orange-100";
        textColor = "text-orange-800";
        break;
      case "pending":
      default:
        bgColor = "bg-yellow-100";
        textColor = "text-yellow-800";
        break;
    }

    return (
      <span
        className={`flex items-center px-3 py-1 rounded-full ${bgColor} ${textColor} text-sm font-medium`}
      >
        {status || "Pending"}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-xs flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Revision Required
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <h4 className="font-medium text-gray-700 mb-2">Document</h4>
            <p className="text-gray-800">{document.label}</p>
          </div>

          <div className="mb-4">
            <h4 className="font-medium text-gray-700 mb-2">Status</h4>
            <StatusBadge status={document.Status} />
          </div>

          <div className="mb-6">
            <h4 className="font-medium text-gray-700 mb-2">Revision Notes</h4>
            <div className="bg-orange-50 border border-orange-200 rounded-md p-3">
              <p className="text-gray-800">
                {document.revision_notes || "No specific notes provided."}
              </p>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="font-medium text-gray-700 mb-2">Current File</h4>
            {document.file ? (
              <div className="flex justify-between">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-blue-500 mr-2" />
                  <span className="text-blue-600">{document.file}</span>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={handleEditClick}
                    className="flex items-center text-blue-500 hover:text-blue-700"
                  >
                    <Pen className="w-5 h-5 mr-1" />
                    <span>edit</span>
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 italic">No file uploaded</p>
            )}
          </div>

          {showFileRenderer && (
            <div className="mb-6 border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-700 mb-2">
                Upload New File
              </h4>
              <input
                type="file"
                onChange={handleFileChange}
                disabled={isUploading}
                className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
              />

              {/* Show selected file name */}
              {selectedFile && (
                <div className="mt-2 text-sm text-gray-700">
                  Selected file: {selectedFile.name}
                </div>
              )}

              {/* Error message */}
              {uploadError && (
                <div className="mt-2 text-sm text-red-600">{uploadError}</div>
              )}

              {/* Success message */}
              {uploadSuccess && (
                <div className="mt-2 text-sm text-green-600">
                  Document uploaded successfully! Refreshing...
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              disabled={isUploading}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center disabled:opacity-50 ${
                isUploading ? "opacity-75" : ""
              }`}
              onClick={handleUploadDocument}
              disabled={!selectedFile || isUploading || uploadSuccess}
            >
              {isUploading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Revised Document
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
