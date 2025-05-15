import EventCalendar from "../newsfeed_page/newsfeed_event_calendar";
import PostTemplate from "../newsfeed_page/newsfeed_post_template";
import { FileRenderer } from "../../../components/file_renderer";
import { useParams } from "react-router-dom";

import {
  faArrowLeft,
  faCalendarAlt,
  faFileAlt,
  faUser,
  faUserShield,
  faMapPin,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, use } from "react";
import axios from "axios";
import { API_ROUTER } from "../../../App";
// Define API_ROUTER constant that was missing

export default function OrganizationProfilePage() {
  const { orgName } = useParams();
  const [orgData, setOrgData] = useState(null);
  const [pinnedFiles, setPinnedFiles] = useState([]);
  const [storedUser, setStoredUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch organization data based on URL parameter
  useEffect(() => {
    const fetchOrgData = async () => {
      if (!orgName) return;

      try {
        setLoading(true);
        const response = await axios.get(`${API_ROUTER}/get-org/${orgName}`);
        console.log("Organization data:", response.data);
        setOrgData(response.data);

        // If org data includes pinned files, set them
        if (response.data.pinnedFiles) {
          setPinnedFiles(response.data.pinnedFiles);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching organization data:", error);
        setLoading(false);
      }
    };

    fetchOrgData();
  }, [orgName]);

  // Try to get stored user from localStorage
  useEffect(() => {
    const getUserFromStorage = () => {
      const user = localStorage.getItem("user");

      if (user) {
        try {
          const parsedUser = JSON.parse(user);
          console.log("User from localStorage:", parsedUser);
          setStoredUser(parsedUser);
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
    };

    getUserFromStorage();
  }, []);

  // Fetch pinned files when we have user info OR when we have org data
  useEffect(() => {
    const getPinnedFiles = async () => {
      // If we have storedUser with organization info, use that
      if (storedUser?.organization?._id) {
        try {
          const response = await axios.get(
            `${API_ROUTER}/get-pinned-files/${storedUser.organization._id}`
          );
          console.log("Pinned files from user org:", response.data);
          setPinnedFiles(response.data);
        } catch (error) {
          console.error("Error fetching pinned files from user org:", error);
        }
      }
      // If we don't have storedUser but have orgData with ID, use that
      else if (orgData?._id) {
        try {
          const response = await axios.get(
            `${API_ROUTER}/get-pinned-files/${orgData._id}`
          );
          console.log("Pinned files from URL org:", response.data);
          setPinnedFiles(response.data);
        } catch (error) {
          console.error("Error fetching pinned files from URL org:", error);
        }
      }
    };

    // Only proceed if we have either user org data or direct org data
    if (storedUser?.organization?._id || orgData?._id) {
      getPinnedFiles();
    }
  }, [storedUser, orgData]);

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

  // Determine which organization data to use
  const displayOrg = orgData || storedUser?.organization || null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading organization profile...</div>
      </div>
    );
  }

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-cnsc-primary-color text-white flex items-center justify-between px-4 md:px-8 h-auto shadow-md z-50">
        <Link to={"/newsfeed"} className="text-lg ml-4">
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Home Page
        </Link>
        <div className="flex-grow text-center">
          <img
            src="/general/cnsc_codex_ver_2.svg"
            alt="Logo"
            className="h-24 inline"
          />
        </div>
        {storedUser ? (
          <Link to={`/admin/${storedUser.position}`} className="text-lg mr-4">
            <FontAwesomeIcon icon={faUserShield} className="mr-2" />
            Go to Admin Panel
          </Link>
        ) : (
          <Link to={"/"} className="text-lg mr-4">
            <FontAwesomeIcon icon={faUser} className="mr-2" />
            Login
          </Link>
        )}

        <div className="w-6 md:hidden"></div>
      </header>

      <div className="bg-gray-100 min-h-screen mt-20 flex flex-col container mx-auto items-center">
        {/* Profile Section */}
        {displayOrg ? (
          <div className="relative w-full h-auto shadow-lg rounded-lg">
            <div className="w-full h-72 bg-gray-300 rounded-lg"></div>
            <div className="absolute top-46 left-12 transform w-48 h-48 bg-gray-400 rounded-full border-4 border-white">
              <img
                src={
                  displayOrg.logo
                    ? `/${encodeURIComponent(
                        displayOrg.org_name
                      )}/Accreditation/Accreditation/photos/${encodeURIComponent(
                        displayOrg.logo
                      )}`
                    : "/general/default-org-logo.svg"
                }
                className="h-full w-full rounded-full aspect-square object-cover"
                alt="Organization Logo"
                onError={(e) => {
                  e.target.src = "/general/default-org-logo.svg";
                }}
              />
            </div>
            <div className="flex flex-col ml-58 gap-4 p-4">
              <h2 className="text-lg font-bold">
                {displayOrg.org_name || "Organization Name"}
              </h2>
              <p className="text-gray-500">
                {displayOrg.description ||
                  "This is where the description of the org will be displayed."}
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full text-center p-8">
            <h2 className="text-xl font-bold">Organization Not Found</h2>
            <p className="text-gray-500">
              The requested organization could not be found or is not available.
            </p>
          </div>
        )}

        {/* Content Section */}
        {displayOrg && (
          <div className="w-full py-4 grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Posts */}
            <div className="col-span-1 md:col-span-3">
              <PostTemplate orgId={displayOrg._id} />
            </div>

            {/* Sidebar */}
            <div className="col-span-1 flex flex-col gap-4">
              {/* Documents Section */}
              <div className="bg-blue-100 p-4 shadow-lg rounded-lg">
                {/* Pinned Files Section */}
                {pinnedFiles.length > 0 ? (
                  <div>
                    <h4 className="text-md font-semibold mb-2 flex gap-2 items-center">
                      <FontAwesomeIcon
                        icon={faMapPin}
                        className="mr-2 text-red-600"
                      />
                      Pinned Documents
                    </h4>
                    <div className="mb-4 mt-2 h-64 overflow-auto">
                      <div className="grid grid-cols-1 gap-2">
                        {pinnedFiles.map((path, index) => {
                          const file = transformFilePath(path);
                          return (
                            <div
                              key={`pinned-${index}`}
                              className="bg-yellow-50 rounded-lg shadow-sm flex items-center p-2 border border-yellow-400"
                            >
                              <FileRenderer
                                basePath={file.basepath}
                                fileName={file.filename}
                                type={file.category}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-4">
                    <p className="text-gray-500">
                      No pinned documents available
                    </p>
                  </div>
                )}
              </div>
              <EventCalendar orgId={displayOrg._id} />
            </div>
          </div>
        )}
      </div>

      {/* Floating buttons - visible on small screens only */}
      <div className="fixed bottom-4 right-4 flex gap-3 z-50 md:hidden  flex-col">
        <a
          href="#"
          className="flex items-center gap-2 bg-cyan-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm hover:bg-cyan-700"
        >
          <FontAwesomeIcon icon={faFileAlt} className="text-lg" />
          Documents
        </a>
        <a
          href="#"
          className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm hover:bg-orange-600"
        >
          <FontAwesomeIcon icon={faCalendarAlt} className="text-lg" />
          Event Calendar
        </a>
      </div>
    </>
  );
}
