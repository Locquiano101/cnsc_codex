// Common utilities for both forms
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PopUp from "../../../../components/pop-ups";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import {
  ReusableFileUpload,
  ReusableMultiFileUpload,
} from "../../../../components/reusable_file_upload";
import { usePostForm } from "./student_posts_view";
import { API_ROUTER } from "../../../../App";
import axios from "axios";
// Component for adding a new post
export default function AddPostFormModal({
  orgName,
  orgLogo,
  orgId,
  onCancel,
}) {
  const {
    formDataState,
    uploadedFiles,
    isDocument,
    setIsDocument,
    showPopup,
    setShowPopup,
    tags,
    handleTagToggle,
    handleChange,
    handleFileChange,
    setUploadedFiles,
    getFileFields,
    getLogoPath,
  } = usePostForm(orgName);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create form data
    const formData = new FormData();

    // Append basic post data
    formData.append("title", formDataState.title);
    formData.append("content", formDataState.content);
    formData.append("tags", JSON.stringify(formDataState.tags));
    formData.append("orgFolder", orgName);
    formData.append("organization", orgId);
    formData.append("orgDocumentClassification", "StudentPost");
    formData.append("orgDocumentTitle", formDataState.title);

    // Handle file uploads
    Object.entries(uploadedFiles).forEach(([fieldKey, fileOrFiles]) => {
      const files = Array.isArray(fileOrFiles) ? fileOrFiles : [fileOrFiles];

      files.forEach((file) => {
        if (!file) return;

        // Determine if this is a document or photo based on file type
        const isFileDocument = file.type === "application/pdf";
        const formKey = isFileDocument ? "document" : "photo";

        // Append the file with the correct key
        formData.append(formKey, file);

        // Also store the filename separately if needed
        formData.append(`${formKey}`, file.name);
      });
    });

    try {
      const formDataObject = {};
      for (let [key, value] of formData.entries()) {
        formDataObject[key] = value;
      }

      console.log("Form data before submission:", formDataObject);

      const { data } = await axios.post(`${API_ROUTER}/upload-post`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Server response:", data);
      setShowPopup(true);
    } catch (error) {
      console.error("Submission error:", error);
      // Add error handling here (could show an error popup)
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    onCancel(); // Close the modal
    window.location.reload(); // Refresh to show updated data
  };

  const logoPath = getLogoPath(orgName, orgLogo);
  const fileFields = getFileFields();

  return (
    <div className="inset-0 fixed bg-black/50 backdrop-blur-xs flex items-center justify-center z-50">
      {showPopup && (
        <PopUp
          title="Success!"
          text="Your post has been created."
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

          {/* File upload section */}
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Upload Files:
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
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
