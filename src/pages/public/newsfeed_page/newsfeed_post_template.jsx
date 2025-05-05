import { useEffect, useState } from "react";
import { API_ROUTER } from "../../../App";
import axios from "axios";
import { FileRenderer } from "../../../components/file_renderer";

const GetAllApprovedPost = ({ documentLocations, posts }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle edit post functionality
  const handleEditPost = (postId) => {
    console.log(`Edit post with ID: ${postId}`);
    // Implement your edit logic here or navigate to edit page
  };

  // If no props were passed, fetch the data directly
  useEffect(() => {
    if (!posts && !documentLocations) {
      setLoading(true);

      const fetchData = async () => {
        try {
          const [locationsRes, postsRes] = await Promise.all([
            axios.get(`${API_ROUTER}/get-all-student-post/`),
            axios.get(`${API_ROUTER}/get-post/`),
          ]);

          // Update state with fetched data
          documentLocations = locationsRes.data;
          posts = postsRes.data;
          setLoading(false);
        } catch (err) {
          console.error("Error fetching data:", err);
          setError("Failed to fetch data");
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [posts, documentLocations]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        <p>{error}</p>
      </div>
    );
  }

  // Filter only the approved posts if posts data is available
  const approvedPosts = posts
    ? posts.filter((post) => post.status === "approved")
    : [];

  if (approvedPosts.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <p className="text-gray-500">No approved posts available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {approvedPosts.map((post) => {
        // Find organization-specific file paths if documentLocations is available
        const orgFiles =
          documentLocations &&
          documentLocations.StudentPosts &&
          documentLocations.StudentPosts[post.organization.org_name]
            ? documentLocations.StudentPosts[post.organization.org_name]
            : [];

        return (
          <PostCard
            key={post._id}
            post={post}
            className="bg-white"
            // Pass the orgFiles to determine proper paths for files
            orgFiles={orgFiles}
            onEditClick={() => handleEditPost(post._id)}
          />
        );
      })}
    </div>
  );
};

const DocumentRenderer = ({ filePath }) => {
  const isPdf = filePath.toLowerCase().endsWith(".pdf");

  return (
    <div className="w-full border h-full flex flex-col">
      {isPdf && (
        <div className="w-full h-72">
          <iframe
            src={`/${filePath}#toolbar=0&navpanes=0&scrollbar=0`}
            className="w-full h-full"
            title={filePath.split("/").pop()}
          />
        </div>
      )}
    </div>
  );
};

const PostCard = ({
  post,
  className = "",
  maxImagesToShow = 4,
  orgFiles = [],
  onEditClick = null,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const hasPhotos = post.content?.photos && post.content.photos.length > 0;
  const hasDocuments =
    post.content?.documents && post.content.documents.length > 0;

  // Helper function to find the complete file path from orgFiles
  const getCompletePath = (fileName, fileType) => {
    // Look for matching file paths in orgFiles
    const matchingFile = orgFiles.find((path) => {
      // Check if the path contains both the org name, file type and the filename
      return (
        path.includes(post.organization.org_name) &&
        path.includes(`/${fileType}/`) &&
        path.includes(fileName)
      );
    });

    return (
      matchingFile ||
      `${post.organization.org_name}/StudentPost/${post.title}/${fileType}/${fileName}`
    );
  };

  return (
    <>
      <div className={`shadow-md px-4 py-2 relative ${className}`}>
        {/* Profile and Org Name */}
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
              .map((photo, index) => {
                const photoPath = getCompletePath(photo, "photos");

                return (
                  <div key={index} className="relative w-full border-gray-200">
                    <img
                      src={`/${photoPath}`}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-48 object-cover rounded"
                    />
                    {index === maxImagesToShow - 1 &&
                      post.content.photos.length > maxImagesToShow && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold">
                          +{post.content.photos.length - maxImagesToShow}
                        </div>
                      )}
                  </div>
                );
              })}
          </div>
        )}

        {/* Documents */}
        {hasDocuments && (
          <div className="flex flex-wrap gap-2 mt-2">
            {post.content.documents.map((document, index) => {
              const docPath = getCompletePath(document, "documents");

              return (
                <div key={index} className="w-full p-1">
                  <DocumentRenderer filePath={docPath} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default function NewsFeedPage() {
  const [documentLocations, setDocumentLocations] = useState({});
  const [postInfo, setPostInfo] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getAllDocumentLocation() {
      try {
        const response = await axios.get(`${API_ROUTER}/get-all-student-post/`);
        setDocumentLocations(response.data);
        console.log("Document locations:", response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch document locations data");
      }
    }

    async function getAllPostInformation() {
      try {
        const response = await axios.get(`${API_ROUTER}/get-post/`);
        setPostInfo(response.data);
        console.log("Post information:", response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch posts data");
      }
    }

    // Fetch all necessary data
    Promise.all([getAllDocumentLocation(), getAllPostInformation()])
      .then(() => setIsLoading(false))
      .catch((err) => {
        console.error("Error loading data:", err);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="w-full flex flex-col">
      {/* Main content */}
      <main>
        {isLoading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <p>{error}</p>
          </div>
        ) : (
          <>
            {/* Pass the fetched data to the GetAllApprovedPost component */}
            <GetAllApprovedPost
              documentLocations={documentLocations}
              posts={postInfo}
            />
          </>
        )}
      </main>

      {/* Optional: Add filters, pagination, or other controls */}
      <div className=" flex justify-center">
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
          Load More Posts
        </button>
      </div>
    </div>
  );
}
