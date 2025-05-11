// Common utilities for both forms
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PopUp } from "../../../../components/pop-ups";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import {
  ReusableFileUpload,
  ReusableMultiFileUpload,
} from "../../../../components/reusable_file_upload";
import { API_ROUTER } from "../../../../App";
import axios from "axios";
import { useState } from "react";
import { usePostForm } from "./adviser_post_view";
import { FileRenderer } from "../../../../components/file_renderer";
import { DocumentRenderer } from "./adviser_post_view";

export default function AdviserPostApproval({
  orgName,
  orgLogo,
  orgId,
  onCancel,
  initialData,
  postId,
  basePath,
}) {
  const [showRevisionForm, setShowRevisionForm] = useState(false);
  const [revisionReason, setRevisionReason] = useState("");

  // Get logo path helper function
  const getLogoPath = (orgName, logoFile) => {
    // Implementation assumed from original code
    return logoFile ? `${basePath}/logos/${logoFile}` : "/default-logo.png";
  };

  const handleApprove = async () => {
    try {
      const formData = new FormData();

      formData.append("postId", postId);
      formData.append("orgId", orgId);
      formData.append("status", "approved");

      // Debug log
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const endpoint = `${API_ROUTER}/approve-post/${postId}`;
      const { data } = await axios.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Post approved:", data);
    } catch (error) {
      console.error("Approval error:", error);
    }
  };
  const handleRevisionSubmit = async () => {
    if (!revisionReason.trim()) {
      alert("Please provide a reason for revision");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("postId", postId);
      formData.append("orgId", orgId);
      formData.append("status", "revision");
      formData.append("revision_notes", revisionReason);

      const endpoint = `${API_ROUTER}/revision-post/${postId}`;
      const { data } = await axios.post(endpoint, formData);

      console.log("Revision requested:", data);
    } catch (error) {
      console.error("Revision error:", error);
    }
  };

  // Display content from initialData (post details)
  const postContent = initialData || {};

  console.log("this is from the edit side", postContent);
  return (
    <div className="inset-0 fixed bg-black/50 backdrop-blur-xs flex items-center justify-center z-50">
      <div className="bg-white shadow rounded-2xl p-4 w-full max-w-xl mx-auto relative max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <FontAwesomeIcon icon={faTimes} className="text-xl" />
        </button>

        {/* Post content display (read-only) */}
        <div className="flex items-center gap-2 mb-4">
          <img
            src={`/${orgName}/Accreditation/Accreditation/photos/${orgLogo}`}
            alt={orgName}
            className="w-16 h-16 mt-1 ml-2 object-cover rounded-full"
          />
          <div className="flex flex-col">
            <h1 className="font-bold">{orgName}</h1>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-bold">{postContent.title}</h2>
          <p className="text-gray-700 mt-2">{postContent.content}</p>
          <p className="text-gray-700 mt-2">{postContent.status} what</p>

          {/* Tags */}
          {postContent.tags && (
            <div className="flex flex-wrap gap-2 mt-3">
              {postContent.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Display photos if any - using FileRenderer */}
          {postContent.existingPhotos &&
            postContent.existingPhotos.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Photos:
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {postContent.existingPhotos.map((photo, index) => (
                    <div key={index} className="border p-1 rounded">
                      <FileRenderer basePath={basePath} fileName={photo} />
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Display documents if any - using DocumentRenderer */}
          {postContent.existingDocuments &&
            postContent.existingDocuments.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Documents:
                </h3>
                <div className="space-y-2">
                  {postContent.existingDocuments.map((doc, index) => (
                    <div key={index} className="rounded">
                      {doc.endsWith(".pdf") ? (
                        <DocumentRenderer basePath={basePath} fileName={doc} />
                      ) : (
                        <FileRenderer basePath={basePath} fileName={doc} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>

        {/* Revision form or approval buttons */}
        {showRevisionForm ? (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Revision Reason:
            </h3>
            <textarea
              value={revisionReason}
              onChange={(e) => setRevisionReason(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Please explain why this post needs revision..."
              required
            />
            <div className="flex justify-between mt-4">
              <button
                type="button"
                onClick={() => setShowRevisionForm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-1 rounded-full hover:bg-gray-400 text-sm"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleRevisionSubmit}
                className="bg-yellow-500 text-white px-4 py-1 rounded-full hover:bg-yellow-600 text-sm"
              >
                Submit Revision
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-300 text-gray-700 px-4 py-1 rounded-full hover:bg-gray-400 text-sm"
            >
              Cancel
            </button>
            <div className="space-x-2">
              <button
                type="button"
                onClick={() => setShowRevisionForm(true)}
                className="bg-yellow-500 text-white px-4 py-1 rounded-full hover:bg-yellow-600 text-sm"
              >
                Revision
              </button>
              <button
                type="button"
                onClick={handleApprove}
                className="bg-green-500 text-white px-4 py-1 rounded-full hover:bg-green-600 text-sm"
              >
                Approve
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
