import { useEffect, useState } from "react";
import { API_ROUTER } from "../../../../App";
import { FileRendererAll } from "../../../../components/file_renderer";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilter,
  faFolderOpen,
  faImage,
  faFile,
  faMapPin,
  faThumbTack,
} from "@fortawesome/free-solid-svg-icons";

// Popup component
function PopUp({ title, text, onClose, buttons }) {
  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-xl max-w-md w-full">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="mb-6">{text}</p>
        <div className="flex justify-end gap-4">
          {buttons.map((button, index) => (
            <button
              key={index}
              onClick={button.onClick}
              className={`px-4 py-2 rounded ${
                index === 0
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-200 hover:bg-gray-300"
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

function PinnedFiles(user) {}

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
        console.log(response.data);
        setPinnedFiles(response.data);
      } catch (error) {}
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

  // Apply filters when active filters change
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

    setFilteredFiles(result);
  }, [activeFilters, allFiles]);

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
    <div className="h-full overflow-hidden flex flex-col">
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

      <div className="p-4 bg-white border-b">
        <h2 className="text-2xl font-bold mb-4">Files</h2>

        {/* Filter controls */}
        <div className="flex flex-wrap w-1/2 gap-4 mb-4">
          <div className="flex flex-1 items-center">
            <FontAwesomeIcon
              icon={faFolderOpen}
              className="mr-2 text-2xl text-blue-600"
            />
            <select
              className="border rounded w-full p-2"
              value={activeFilters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "All" ? "All Categories" : category}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-1 items-center">
            <FontAwesomeIcon
              icon={faFolderOpen}
              className="mr-2 text-2xl text-blue-600"
            />
            <select
              className="border w-full rounded p-2"
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

          <div className="flex flex-1 items-center">
            <FontAwesomeIcon
              icon={faFile}
              className="mr-2 text-blue-600 text-2xl"
            />
            <select
              className="border w-full rounded p-2"
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

      <div className="flex-1 p-4 overflow-auto">
        {isLoading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {filteredFiles.length === 0 && !isLoading && (
          <p className="text-gray-500 text-center py-8">
            No files match the selected filters
          </p>
        )}
        {/*pinned files*/}
        {pinnedFiles.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <FontAwesomeIcon icon={faMapPin} className="mr-2 text-red-600" />
              Pinned Files
            </h3>
            <div className="grid grid-cols-5 gap-4">
              {pinnedFiles.map((path, index) => {
                const file = transformFilePath(path);
                return (
                  <div
                    key={`pinned-${index}`}
                    className="h-48 bg-yellow-50 rounded-2xl shadow-md flex justify-center items-center relative border border-yellow-400"
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
            <div className="relative">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <FontAwesomeIcon icon={faFile} className="mr-2 text-blue-600" />
                Documents
              </h3>
              <div className="grid grid-cols-6 gap-4">
                {documentFiles.map((file, index) => (
                  <div
                    key={`doc-${index}`}
                    className="h-48 bg-white items-center rounded-2xl shadow-md flex justify-center relative"
                  >
                    <FontAwesomeIcon
                      icon={faThumbTack}
                      className="transform rotate-45 absolute top-4 right-4 text-red-500 cursor-pointer hover:text-red-700"
                      onClick={() => handlePinFile(file)}
                    />
                    <FileRendererAll
                      basePath={file.basepath}
                      fileName={file.filename}
                      type={file.category}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Photos Section */}
        {(activeFilters.type === "All" || activeFilters.type === "Photos") &&
          photoFiles.length > 0 && (
            <div className="flex flex-col mt-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <FontAwesomeIcon
                  icon={faImage}
                  className="mr-2 text-blue-600"
                />
                Photos
              </h3>
              <div className="flex flex-wrap gap-4 justify-between">
                {photoFiles.map((file, index) => (
                  <div
                    key={`photo-${index}`}
                    className="overflow-hidden relative"
                  >
                    <FontAwesomeIcon
                      icon={faThumbTack}
                      className="transform rotate-45 absolute top-4 right-4 text-red-500 cursor-pointer hover:text-red-700 z-10"
                      onClick={() => handlePinFile(file)}
                    />
                    <FileRendererAll
                      basePath={file.basepath}
                      fileName={file.filename}
                      type={file.category}
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
