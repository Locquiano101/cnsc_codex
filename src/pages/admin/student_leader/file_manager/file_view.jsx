import { useEffect, useState } from "react";
import { API_ROUTER } from "../../../../App";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilter,
  faFolderOpen,
  faImage,
  faFile,
  faMapPin,
  faThumbTack,
  faFileAlt,
  faFilePdf,
  faFileImage,
  faFileWord,
  faFileExcel,
  faFilePowerpoint,
  faFileCode,
  faFileArchive,
  faFileVideo,
  faFileAudio,
  faTimes,
  faSearch,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

// Improved popup component with professional styling
function PopUp({ title, text, onClose, buttons }) {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-lg p-6 shadow-2xl max-w-md w-full animate-scaleIn">
        <h3 className="text-xl font-bold mb-3 text-gray-800">{title}</h3>
        <p className="mb-6 text-gray-600">{text}</p>
        <div className="flex justify-end gap-3">
          {buttons.map((button, index) => (
            <button
              key={index}
              onClick={button.onClick}
              className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
                index === 0
                  ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {button.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export const FileRendererAll = ({ basePath, fileName, type, onPin }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const extension = fileName.split(".").pop().toLowerCase();
  const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(extension);
  const displayName =
    fileName.length > 25 ? fileName.substring(0, 22) + "..." : fileName;

  // Get file icon based on extension
  const getFileIcon = () => {
    switch (extension) {
      case "pdf":
        return faFilePdf;
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "svg":
      case "webp":
        return faFileImage;
      case "doc":
      case "docx":
        return faFileWord;
      case "xls":
      case "xlsx":
      case "csv":
        return faFileExcel;
      case "ppt":
      case "pptx":
        return faFilePowerpoint;
      case "zip":
      case "rar":
      case "7z":
        return faFileArchive;
      case "mp4":
      case "mov":
      case "avi":
      case "webm":
        return faFileVideo;
      case "mp3":
      case "wav":
      case "ogg":
        return faFileAudio;
      case "js":
      case "html":
      case "css":
      case "json":
      case "php":
      case "py":
        return faFileCode;
      case "txt":
        return faFileAlt;
      default:
        return faFile;
    }
  };

  const handlePreviewClick = () => {
    if (isImage) {
      setIsLoading(true);
      setShowPreview(true);
      setIsLoading(false);
    } else {
      window.open(basePath, "_blank");
    }
  };

  const handleClosePreview = (e) => {
    e?.stopPropagation();
    setShowPreview(false);
  };

  // Image Preview Modal
  const ImagePreviewModal = () => (
    <div
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
      onClick={handleClosePreview}
    >
      <div className="absolute top-4 right-4">
        <button
          onClick={handleClosePreview}
          className="text-white hover:text-gray-300 text-3xl"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>

      <div
        className="max-w-full max-h-full"
        onClick={(e) => e.stopPropagation()}
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <FontAwesomeIcon
              icon={faSpinner}
              className="animate-spin text-white text-4xl"
            />
          </div>
        ) : (
          <img
            src={basePath}
            alt={fileName}
            className="max-w-full max-h-[90vh] object-contain"
            onLoad={() => setIsLoading(false)}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/placeholder-image.png";
            }}
          />
        )}
      </div>

      <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm">
        {fileName}
      </div>
    </div>
  );

  // Image Thumbnail
  if (isImage) {
    return (
      <>
        <div className="relative w-full h-full flex flex-col items-center justify-center group cursor-zoom-in">
          {/* Pin Button */}
          {onPin && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPin();
              }}
              className="absolute top-2 right-2 z-10 p-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100"
            >
              <FontAwesomeIcon
                icon={faThumbTack}
                className="transform rotate-45 text-red-500 hover:text-red-700"
              />
            </button>
          )}

          {/* Image Thumbnail */}
          <div
            className="relative w-full h-full overflow-hidden rounded-lg"
            onClick={handlePreviewClick}
          >
            <img
              src={basePath}
              alt={fileName}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/placeholder-image.png";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 pointer-events-none" />
          </div>

          {/* File Name */}
          <div className="absolute bottom-0 left-0 right-0 p-2">
            <div className="w-full text-white text-sm font-medium truncate text-center">
              {displayName}
            </div>
          </div>
        </div>

        {/* Preview Modal */}
        {showPreview && <ImagePreviewModal />}
      </>
    );
  }

  // Document File
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center cursor-pointer group"
      onClick={handlePreviewClick}
    >
      <div className="w-full h-full flex flex-col items-center justify-center p-2 rounded-lg shadow-md bg-white transition-all duration-300 group-hover:shadow-lg relative">
        {/* Pin Button */}
        {onPin && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPin();
            }}
            className="absolute top-2 right-2 z-10 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <FontAwesomeIcon
              icon={faThumbTack}
              className="transform rotate-45 text-red-500 hover:text-red-700"
            />
          </button>
        )}

        {/* File Icon */}
        <div className="mb-2 text-4xl text-gray-700 group-hover:text-blue-600 transition-colors">
          <FontAwesomeIcon
            icon={getFileIcon()}
            className="transform group-hover:scale-110 transition-transform"
          />
        </div>

        {/* File Name */}
        <div className="w-full px-2">
          <a
            href={basePath}
            target="_blank"
            rel="noreferrer"
            className="block text-blue-600 text-sm text-center truncate group-hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2" />
                <span>Loading...</span>
              </div>
            ) : (
              <>(preview) - {displayName}</>
            )}
          </a>
        </div>
      </div>
    </div>
  );
};

// Enhanced StudentFiles component with professional styling
export default function StudentFiles({ user }) {
  const [allFiles, setAllFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [pinnedFiles, setPinnedFiles] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [activeFilters, setActiveFilters] = useState({
    category: "All",
    subcategory: "All",
    type: "All",
  });
  const [pinSuccess, setPinSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Popup state
  const [showPopup, setShowPopup] = useState(false);
  const [popupAction, setPopupAction] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const getPinnedFiles = async () => {
      try {
        const response = await axios.get(
          `${API_ROUTER}/get-pinned-files/${user.organization._id}`
        );
        setPinnedFiles(response.data);
      } catch (error) {
        console.error("Error fetching pinned files:", error);
      }
    };
    getPinnedFiles();
  }, [user]);

  // Update subcategories when category filter changes
  useEffect(() => {
    if (allFiles.length === 0) return;

    // If category is 'All', show all subcategories
    if (activeFilters.category === "All") {
      const allSubcategories = [
        "All",
        ...new Set(allFiles.map((file) => file.subcategory)),
      ];
      setSubcategories(allSubcategories);
    } else {
      // Otherwise only show subcategories from the selected category
      const filteredSubcategories = [
        "All",
        ...new Set(
          allFiles
            .filter((file) => file.category === activeFilters.category)
            .map((file) => file.subcategory)
        ),
      ];
      setSubcategories(filteredSubcategories);
    }
  }, [activeFilters.category, allFiles]);

  useEffect(() => {
    if (!user || !user.organization?.org_name) return;

    async function fetchFiles() {
      try {
        setIsLoading(true);
        const response = await axios.post(
          `${API_ROUTER}/get-organization-files`,
          { organization: user.organization.org_name }
        );

        let files = response.data[user.organization.org_name] || [];

        // Remove the "../../public/" prefix completely
        files = files.map((path) => {
          // Normalize slashes and remove ../../public
          const normalized = path.replaceAll("\\", "/");
          return normalized.startsWith("../../public/")
            ? normalized.replace("../../public", "")
            : normalized;
        });

        const processedFiles = files.map((path) => {
          const parts = path.split("/").filter(Boolean); // e.g., ["orgABC", "Documents", "Accomplishment1", "file.pdf"]

          const orgname = parts[0] || "unknown-org";
          const docutype = parts[1] || "unknown-type";
          const title = parts[2] || "untitled";
          const title2 = parts[3] || "untitled";
          const fileName = parts[4] || "file";

          const isPhoto = path.toLowerCase().includes("/photos/");
          const fileType = isPhoto ? "Photos" : "Documents";

          return {
            basepath: `/${orgname}/${docutype}/${title}/${title2}/${fileName}`,
            filename: fileName,
            category: docutype,
            subcategory: title,
            type: fileType,
          };
        });

        const uniqueCategories = [
          "All",
          ...new Set(processedFiles.map((file) => file.category)),
        ];
        const uniqueSubcategories = [
          "All",
          ...new Set(processedFiles.map((file) => file.subcategory)),
        ];

        setCategories(uniqueCategories);
        setSubcategories(uniqueSubcategories);
        setAllFiles(processedFiles);
        setFilteredFiles(processedFiles);
      } catch (err) {
        console.error("Failed to fetch files:", err);
        setError("Failed to load files");
      } finally {
        setIsLoading(false);
      }
    }

    fetchFiles();
  }, [user]);

  // Apply filters and search when active filters or search term changes
  useEffect(() => {
    let result = [...allFiles];

    // Apply category filter
    if (activeFilters.category !== "All") {
      result = result.filter(
        (file) => file.category === activeFilters.category
      );
    }

    // Apply subcategory filter
    if (activeFilters.subcategory !== "All") {
      result = result.filter(
        (file) => file.subcategory === activeFilters.subcategory
      );
    }

    // Apply type filter
    if (activeFilters.type !== "All") {
      result = result.filter((file) => file.type === activeFilters.type);
    }

    // Apply search term if present
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (file) =>
          file.filename.toLowerCase().includes(term) ||
          file.category.toLowerCase().includes(term) ||
          file.subcategory.toLowerCase().includes(term)
      );
    }

    setFilteredFiles(result);
  }, [activeFilters, allFiles, searchTerm]);

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    // If category is changed, reset subcategory to 'All'
    if (filterType === "category") {
      setActiveFilters((prev) => ({
        ...prev,
        [filterType]: value,
        subcategory: "All", // Reset subcategory when category changes
      }));
    } else {
      setActiveFilters((prev) => ({
        ...prev,
        [filterType]: value,
      }));
    }
  };

  // Handle file pin action
  const handlePinFile = (file) => {
    setSelectedFile(file);
    setPopupAction("pin");
    setShowPopup(true);
  };

  // Function to handle pin confirmation
  const confirmPinFile = async (organizationId, fileName) => {
    try {
      setIsLoading(true);
      const response = await axios.post(`${API_ROUTER}/pin-files`, {
        organizationId,
        fileName,
      });

      console.log("Pinned files updated:", response.data);
      setPinSuccess(true); // Show success message

      // Refresh pinned files
      const pinnedRes = await axios.get(
        `${API_ROUTER}/get-pinned-files/${organizationId}`
      );
      setPinnedFiles(pinnedRes.data);
    } catch (error) {
      console.error(
        "Error adding pinned file:",
        error.response?.data || error.message
      );
      setError("Failed to pin file");
      setShowPopup(false);
    } finally {
      setIsLoading(false);
    }
  };

  const transformFilePath = (path) => {
    const normalized = path.replaceAll("\\", "/");
    const parts = normalized.split("/").filter(Boolean); // remove empty segments

    const orgname = parts[0] || "unknown-org";
    const docutype = parts[1] || "unknown-type";
    const title = parts[2] || "untitled";
    const title2 = parts[3] || "untitled";
    const fileName = parts[4] || "file";

    const isPhoto = path.toLowerCase().includes("/photos/");
    const fileType = isPhoto ? "Photos" : "Documents";

    return {
      basepath: `/${orgname}/${docutype}/${title}/${title2}/${fileName}`,
      filename: fileName,
      category: docutype,
      subcategory: title,
      type: fileType,
    };
  };

  // Separate files by type
  const documentFiles = filteredFiles.filter(
    (file) => file.type === "Documents"
  );
  const photoFiles = filteredFiles.filter((file) => file.type === "Photos");

  return (
    <div className="h-full overflow-hidden flex flex-col bg-gray-50">
      {/* Popup component - only shows when showPopup is true */}
      {showPopup && (
        <PopUp
          title={
            pinSuccess
              ? "File Pinned"
              : popupAction === "pin"
              ? "Pin File"
              : "Confirm Action"
          }
          text={
            pinSuccess
              ? `${selectedFile?.filename} was pinned successfully.`
              : popupAction === "pin"
              ? `Are you sure you want to pin ${selectedFile?.filename}?`
              : "Are you sure you want to proceed?"
          }
          onClose={() => {
            setShowPopup(false);
            setPinSuccess(false); // Reset for next time
          }}
          buttons={
            pinSuccess
              ? [
                  {
                    label: "Close",
                    onClick: () => {
                      setShowPopup(false);
                      setPinSuccess(false);
                    },
                  },
                ]
              : [
                  {
                    label: "Yes",
                    onClick: () => {
                      if (popupAction === "pin") {
                        confirmPinFile(
                          user.organization._id,
                          selectedFile.basepath
                        );
                      }
                    },
                  },
                  {
                    label: "Cancel",
                    onClick: () => {
                      setShowPopup(false);
                    },
                  },
                ]
          }
        />
      )}

      <div className="p-6 bg-white border-b shadow-sm">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Files</h2>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Search box */}
          <div className="relative lg:w-1/3">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter controls */}
          <div className="flex flex-wrap gap-4 flex-1">
            <div className="flex flex-1 items-center">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FontAwesomeIcon
                    icon={faFolderOpen}
                    className="text-blue-600"
                  />
                </div>
                <select
                  className="border rounded-lg w-full p-2.5 pl-10 bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                  value={activeFilters.category}
                  onChange={(e) =>
                    handleFilterChange("category", e.target.value)
                  }
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === "All" ? "All Categories" : category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-1 items-center">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FontAwesomeIcon
                    icon={faFolderOpen}
                    className="text-blue-600"
                  />
                </div>
                <select
                  className="border rounded-lg w-full p-2.5 pl-10 bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                  value={activeFilters.subcategory}
                  onChange={(e) =>
                    handleFilterChange("subcategory", e.target.value)
                  }
                >
                  {subcategories.map((subcategory) => (
                    <option key={subcategory} value={subcategory}>
                      {subcategory === "All" ? "All Title" : subcategory}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-1 items-center">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FontAwesomeIcon icon={faFile} className="text-blue-600" />
                </div>
                <select
                  className="border rounded-lg w-full p-2.5 pl-10 bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                  value={activeFilters.type}
                  onChange={(e) => handleFilterChange("type", e.target.value)}
                >
                  <option value="All">All Types</option>
                  <option value="Documents">Documents</option>
                  <option value="Photos">Photos</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-auto">
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <FontAwesomeIcon
              icon={faSpinner}
              className="text-blue-600 text-4xl animate-spin"
            />
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg shadow-sm mb-6">
            <p>{error}</p>
          </div>
        )}

        {filteredFiles.length === 0 && !isLoading && !error && (
          <div className="bg-blue-50 text-blue-700 p-8 rounded-lg shadow-sm text-center">
            <FontAwesomeIcon icon={faFilter} className="text-4xl mb-4" />
            <p className="text-lg">No files match the selected filters</p>
            <p className="text-sm mt-2">
              Try adjusting your search criteria or filters
            </p>
          </div>
        )}

        {/*pinned files*/}
        {pinnedFiles.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 flex items-center border-b pb-2">
              <FontAwesomeIcon icon={faMapPin} className="mr-2 text-red-600" />
              <span className="text-gray-800">Pinned Files</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {pinnedFiles.map((path, index) => {
                const file = transformFilePath(path);
                return (
                  <div
                    key={`pinned-${index}`}
                    className="h-48 bg-yellow-50 rounded-xl shadow-md border border-yellow-200 overflow-hidden"
                  >
                    <FileRendererAll
                      basePath={file.basepath}
                      fileName={file.filename}
                      type={file.category}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Documents Section */}
        {(activeFilters.type === "All" || activeFilters.type === "Documents") &&
          documentFiles.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center border-b pb-2">
                <FontAwesomeIcon icon={faFile} className="mr-2 text-blue-600" />
                <span className="text-gray-800">Documents</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                {documentFiles.map((file, index) => (
                  <div
                    key={`doc-${index}`}
                    className="h-48 bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <FileRendererAll
                      basePath={file.basepath}
                      fileName={file.filename}
                      type={file.category}
                      onPin={() => handlePinFile(file)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Photos Section */}
        {(activeFilters.type === "All" || activeFilters.type === "Photos") &&
          photoFiles.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center border-b pb-2">
                <FontAwesomeIcon
                  icon={faImage}
                  className="mr-2 text-blue-600"
                />
                <span className="text-gray-800">Photos</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {photoFiles.map((file, index) => (
                  <div
                    key={`photo-${index}`}
                    className="aspect-square bg-gray-100 overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-shadow"
                  >
                    <FileRendererAll
                      basePath={file.basepath}
                      fileName={file.filename}
                      type={file.category}
                      onPin={() => handlePinFile(file)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
