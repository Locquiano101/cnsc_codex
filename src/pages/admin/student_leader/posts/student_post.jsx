import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTimes } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { API_ROUTER } from "../../../../App";
import {
  ReusableFileUpload,
  ReusableMultiFileUpload,
} from "../../../../components/reusable_file_upload";
import { PostFeed } from "../../../../components/posts";

function CreatePostModal({ onPost, orgName, orgLogo, orgId, onCancel }) {
  const [formDataState, setFormDataState] = useState({
    title: "",
    tags: [],
    content: "",
  });

  const [uploadedFiles, setUploadedFiles] = useState({});
  const [isDocument, setIsDocument] = useState(false);

  const tags = [
    "Event",
    "Update",
    "Achievement",
    "Memorandum/s",
    "Resolution/s",
    "Announcement",
    "Accomplishment",
  ];

  const handleTagToggle = (tag) => {
    setFormDataState((prev) => {
      const tags = prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag];
      return { ...prev, tags };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDataState((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (fieldKey, files) => {
    if (!files || files.length === 0) {
      setUploadedFiles((prev) => {
        const copy = { ...prev };
        delete copy[fieldKey];
        return copy;
      });
      return;
    }

    // Store files based on document type
    setUploadedFiles((prev) => ({
      ...prev,
      [fieldKey]: isDocument ? files[0] : Array.from(files),
    }));
  };

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

    // Log form data for debugging
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    try {
      // Uncomment this section to enable the actual API call
      const { data } = await axios.post(`${API_ROUTER}/upload-post`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Server response:", data);

      // Call the onPost callback with the post data
      onPost?.({
        title: formDataState.title,
        caption: formDataState.content,
        tags: formDataState.tags,
        files: Object.values(uploadedFiles).flat(),
      });

      onCancel();
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  const fileFields = {
    upload: isDocument
      ? {
          label: "Document Upload",
          accept: ".pdf",
          multiple: false,
        }
      : {
          label: "Photo Upload",
          accept: "image/*",
          multiple: true,
        },
  };

  return (
    <div className="inset-0 fixed bg-black/50 backdrop-blur-xs flex items-center justify-center z-50">
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
              src={`/${encodeURIComponent(
                orgName
              )}/Accreditation/Accreditation/photos/${encodeURIComponent(
                orgLogo
              )}`}
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

          <div className="mt-4">
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

function ViewPostModals({ user }) {
  return (
    <div className="border p-4 w-full h-[32rem] flex-1 flex flex-col gap-4">
      <div className="flex gap-4">
        <img
          src={`/${encodeURIComponent(
            user.organization.org_name
          )}/Accreditation/Accreditation/photos/${encodeURIComponent(
            user.organization.logo
          )}`}
          className="h-10 w-auto rounded-full"
          alt="Logo"
        />
        <div>
          <h1>{user.organization.org_name}</h1>
          <h1>Status: Pending</h1>
        </div>
      </div>
      <div className="border h-full w-full p-4">
        <h1 className="font-bold mb-2">CAPTION</h1>
        <p>
          Share your experiences, achievements, and updates with your
          organization.
        </p>
      </div>
    </div>
  );
}
// Your posts data
const posts = [
  // More posts...
];
export default function StudentPosting({ user }) {
  const [posts, setPosts] = useState([
    {
      type: "documents",
      owner: "Proficient Architects",
      owner_profile: "../general/logo.jpg",
      caption: "Constitution and By-Laws",
      fileDirectory: "../general/PRAXIS_CBL.pdf",
      postedAt: Date.now(),
    },
  ]);
  const [isCreatingPost, setIsCreatingPost] = useState(false);

  const handleNewPost = async (postData) => {
    try {
      // Add the new post to the local state
      setPosts((prevPosts) => [
        {
          title: postData.title,
          content: postData.caption,
          tags: postData.tags,
          photoName: postData.files.length > 0 ? postData.files[0].name : null,
          // For document we'd have similar logic
        },
        ...prevPosts,
      ]);

      setIsCreatingPost(false);
    } catch (error) {
      console.error("Post handling error:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* ADD POST */}
      <div
        onClick={() => setIsCreatingPost(true)}
        className="flex flex-col items-center justify-center border p-4 w-full h-[32rem] cursor-pointer hover:bg-gray-100"
      >
        <FontAwesomeIcon icon={faPenToSquare} className="text-[3rem]" />
        <h1 className="font-bold text-[2.5rem]">ADD POST</h1>
      </div>
      <PostFeed
        posts={posts}
        maxImagesToShow={4}
        documentHeight={700}
        imageHeight={256}
      />

      <ViewPostModals user={user} />

      {/* Create Post Modal */}
      {isCreatingPost && (
        <CreatePostModal
          onPost={handleNewPost}
          orgName={user.organization.org_name}
          orgLogo={user.organization.logo}
          orgId={user.organization._id}
          onCancel={() => setIsCreatingPost(false)}
        />
      )}
    </div>
  );
}
