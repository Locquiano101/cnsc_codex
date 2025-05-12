import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTimes } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { API_ROUTER } from "../../../../App";
import { FileRenderer } from "../../../../components/file_renderer";
import AdviserPostApproval from "./adviser_post_edit";

export const usePostForm = (orgName, initialData = null) => {
  const [formDataState, setFormDataState] = useState({
    title: initialData?.title || "",
    tags: initialData?.tags || [],
    content: initialData?.content || "",
  });

  const [uploadedFiles, setUploadedFiles] = useState({});
  const [isDocument, setIsDocument] = useState(
    initialData?.existingDocuments?.length > 0
  );
  const [showPopup, setShowPopup] = useState(false);

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

  const getFileFields = () => ({
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
  });

  return {
    formDataState,
    setFormDataState,
    uploadedFiles,
    setUploadedFiles,
    isDocument,
    setIsDocument,
    showPopup,
    setShowPopup,
    tags,
    handleTagToggle,
    handleChange,
    handleFileChange,
    getFileFields,
    getLogoPath,
  };
};

export const DocumentRenderer = ({ basePath, fileName }) => {
  const url = `${basePath}/documents/${encodeURIComponent(fileName)}`;
  const isPdf = fileName.endsWith(".pdf");

  return (
    <div className="w-full  h-full flex flex-col">
      {isPdf && (
        <div className="w-full h-72">
          <iframe
            src={`${url}#toolbar=0&navpanes=0&scrollbar=0`}
            className="w-full h-full"
            title={fileName}
          />
        </div>
      )}
    </div>
  );
};

export const PostCard = ({
  post,
  maxImagesToShow = 4,
  basePath = "/content",
  onEditClick = null,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const hasPhotos = post.content?.photos && post.content.photos.length > 0;
  const hasDocuments =
    post.content?.documents && post.content.documents.length > 0;

  return (
    <>
      <div
        className={`rounded-xl shadow-md shadow-gray-500 px-8 py-6 relative h-fit `}
      >
        <div className="absolute shadow-md shadow-gray-500 p-2 rounded top-4 right-4 flex flex-col gap-2">
          <div className="flex gap-4 ">
            {onEditClick && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-xs px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
              >
                Edit
              </button>
            )}
            <h1>status: {post.status}</h1>
          </div>

          {post.revision_notes && (
            <div className="border">
              <h1>notes: {post.revision_notes}</h1>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <img
            src={`/${post.organization.org_name}/Accreditation/Accreditation/photos/${post.organization.logo}`}
            alt={`${post.organization.org_name} logo`}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h1 className="text-sm font-semibold">
              {post.organization.org_name}
            </h1>
            <p className="text-xs text-gray-500">
              {new Date(post.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
        {/* Post Title and Caption */}
        <div className="mt-3">
          <h2 className="font-bold text-lg">{post.title}</h2>
          <p className="text-sm text-gray-800 mt-1">{post.caption}</p>
        </div>
        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        {/* Photos */}
        {hasPhotos && (
          <div className="grid grid-cols-2 gap-2 mt-2">
            {post.content.photos
              .slice(0, maxImagesToShow)
              .map((photo, index) => (
                <div key={index} className="relative w-full border-gray-200">
                  <FileRenderer
                    basePath={basePath}
                    fileName={photo}
                    type="photos"
                  />
                  {index === maxImagesToShow - 1 &&
                    post.content.photos.length > maxImagesToShow && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold">
                        +{post.content.photos.length - maxImagesToShow}
                      </div>
                    )}
                </div>
              ))}
          </div>
        )}
        {/* Documents */}
        {hasDocuments && (
          <div className="flex flex-wrap gap-2 mt-2">
            {post.content.documents.map((document, index) => (
              <div key={index} className="w-full p-1">
                <DocumentRenderer basePath={basePath} fileName={document} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <AdviserPostApproval
          orgName={post.organization.org_name}
          orgLogo={post.organization.logo}
          orgId={post.organization._id}
          onCancel={() => setIsEditing(false)}
          initialData={{
            title: post.title,
            content: post.caption,
            tags: post.tags || [],
            status: post.status,
            existingPhotos: post.content?.photos || [],
            existingDocuments: post.content?.documents || [],
          }}
          isEdit={true}
          postId={post._id}
          basePath={basePath}
        />
      )}
    </>
  );
};

export default function AdviserPosting({ user }) {
  const [posts, setPosts] = useState([]);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  console.log(user);

  useEffect(() => {
    if (!user) return;

    async function fetchPosts() {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${API_ROUTER}/get-post/${user.organization._id}`
        );
        setPosts(response.data);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
        setError("Failed to load posts");
      } finally {
        setIsLoading(false);
      }
    }

    fetchPosts();
  }, [user]);

  if (!user) {
    return <div className="text-center p-4">User not authenticated</div>;
  }

  if (isLoading) {
    return <div className="text-center p-4">Loading posts...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 overflow-auto gap-4">
      {posts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          onEditClick={() => true} // Enable edit button
          basePath={`/${user.organization.org_name}/StudentPost/${post.title}`}
        />
      ))}
    </div>
  );
}
