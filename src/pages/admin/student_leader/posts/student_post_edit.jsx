// Common utilities for both forms
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PopUp from "../../../../components/pop-ups";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import {
  ReusableFileUpload,
  ReusableMultiFileUpload,
} from "../../../../components/reusable_file_upload";
import { API_ROUTER } from "../../../../App";
import axios from "axios";
import { useState } from "react";
import { usePostForm } from "./student_posts_view";
// Component for editing an existing post
export default function EditPostFormModal({
  orgName,
  orgLogo,
  orgId,
  onCancel,
  initialData,
  postId,
  basePath,
}) {
  const {
    formDataState,
    uploadedFiles,
    isDocument,
    showPopup,
    tags,
    setUploadedFiles,
    setIsDocument,
    setShowPopup,
    handleTagToggle,
    handleChange,
    handleFileChange,
    getFileFields,
    getLogoPath,
  } = usePostForm(orgName, initialData);

  // Track existing files separately from newly uploaded ones
  const [existingPhotos, setExistingPhotos] = useState(
    initialData?.existingPhotos || []
  );
  const [existingDocuments, setExistingDocuments] = useState(
    initialData?.existingDocuments || []
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // Append basic post data
    formData.append("title", formDataState.title);
    formData.append("caption", formDataState.content);
    formData.append("tags", JSON.stringify(formDataState.tags));
    formData.append("orgFolder", orgName);
    formData.append("organization", orgId);
    formData.append("orgDocumentClassification", "StudentPost");
    formData.append("orgDocumentTitle", formDataState.title);
    formData.append("postId", postId);

    // Filter out nulls
    const filteredExistingPhotos = existingPhotos.filter(
      (photo) => photo !== null
    );
    const filteredExistingDocuments = existingDocuments.filter(
      (doc) => doc !== null
    );

    let hasNewDocuments = false;
    let hasNewPhotos = false;

    // Append files
    Object.entries(uploadedFiles).forEach(([key, files]) => {
      const arr = Array.isArray(files) ? files : [files];
      arr.forEach((file) => {
        if (!file) return;
        const isImage = file.type.startsWith("image/");
        formData.append(isImage ? "photo" : "document", file);
      });
    });

    // File names
    Object.entries(uploadedFiles).forEach(([key, files]) => {
      const arr = Array.isArray(files) ? files : [files];
      arr.forEach((file) => {
        if (!file) return;
        formData.append(key, file.name);
      });
    });
    // Set empty flags explicitly if needed
    if (
      isDocument &&
      !hasNewDocuments &&
      filteredExistingDocuments.length === 0
    ) {
      formData.append("emptyDocuments", "true");
    }

    if (!isDocument && !hasNewPhotos && filteredExistingPhotos.length === 0) {
      formData.append("emptyPhotos", "true");
    }

    try {
      // Debug log
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const endpoint = `${API_ROUTER}/update-post/${postId}`;

      const { data } = await axios.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Server response:", data);
      // setShowPopup(true); // optional
    } catch (error) {
      console.error("Submission error:", error);
      // Optionally handle error popup here
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    onCancel(); // Close the modal
    window.location.reload(); // Refresh to show updated data
  };

  const handleRemoveExistingPhoto = (index, filename) => {
    setExistingPhotos((prev) => prev.filter((_, i) => i !== index));
    setPhotosToRemove((prev) => [...prev, filename]);
  };

  const handleRemoveExistingDocument = (index, filename) => {
    setExistingDocuments((prev) => prev.filter((_, i) => i !== index));
    setDocumentsToRemove((prev) => [...prev, filename]);
  };

  const logoPath = getLogoPath(orgName, orgLogo);
  const fileFields = getFileFields();

  return (
    <div className="inset-0 fixed bg-black/50 backdrop-blur-xs flex items-center justify-center z-50">
      {showPopup && (
        <PopUp
          title="Success!"
          text="Your post has been updated."
          ButtonText="Okay"
          onClose={handleClosePopup}
        />
      )}
      <div className="bg-white shadow rounded-2xl p-4 w-full max-w-xl mx-auto relative">
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <FontAwesomeIcon icon={faTimes} className="text-xl" />
        </button>

        <form onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <img
              src={logoPath}
              alt="Organization Logo"
              className="w-16 h-16 mt-1 ml-2 object-cover rounded-full"
            />
            <div className="flex flex-col w-full gap-2">
              <h1 className="font-bold">{orgName}</h1>
              <div className="flex gap-2">
                <h1 className="flex-1">Title:</h1>
                <input
                  type="text"
                  name="title"
                  className="flex-3/4 px-2 py-1 border w-full"
                  placeholder="Enter post title"
                  value={formDataState.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex gap-1">
                <h1 className="flex-1">Caption:</h1>
                <textarea
                  name="content"
                  className="flex-3/4 px-2 py-1 border w-full"
                  placeholder="What's on your mind?"
                  value={formDataState.content}
                  onChange={handleChange}
                  rows={3}
                  required
                />
              </div>
            </div>
          </div>

          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-1 rounded-full text-sm border transition ${
                    formDataState.tags.includes(tag)
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="flex min-w-fit items-center gap-2 text-sm text-gray-700 mt-4">
            <input
              type="checkbox"
              id="document-toggle"
              checked={isDocument}
              onChange={(e) => {
                setIsDocument(e.target.checked);
                // Clear uploaded files when switching between document and photo mode
                setUploadedFiles({});
              }}
              className="form-checkbox rounded text-blue-600"
            />
            <label htmlFor="document-toggle">
              This is a document upload (PDF only)
            </label>
          </div>

          {/* Show existing files when editing */}
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Current Files:
            </h3>

            {/* Display existing photos */}
            {existingPhotos.length > 0 && !isDocument && (
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-1">Current Photos:</p>
                <div className="grid grid-cols-2 gap-2">
                  {existingPhotos.map((photo, index) => (
                    <div key={index} className="relative border p-1 rounded">
                      <img
                        src={`${basePath}/photos/${encodeURIComponent(photo)}`}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-32 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingPhoto(index, photo)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Display existing documents */}
            {existingDocuments.length > 0 && isDocument && (
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-1">Current Documents:</p>
                <div className="space-y-1">
                  {existingDocuments.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <span className="text-sm truncate max-w-xs">{doc}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingDocument(index, doc)}
                        className="text-red-500"
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* File upload section for new files */}
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Add New Files:
            </h3>
            {isDocument ? (
              <ReusableFileUpload
                fields={fileFields}
                onFileChange={handleFileChange}
              />
            ) : (
              <ReusableMultiFileUpload
                fields={fileFields}
                onFileChange={handleFileChange}
              />
            )}
          </div>

          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-300 text-gray-700 px-4 py-1 rounded-full hover:bg-gray-400 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-1 rounded-full hover:bg-blue-600 text-sm"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
