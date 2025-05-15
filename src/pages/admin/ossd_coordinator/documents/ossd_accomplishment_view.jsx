import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faPencil,
  faFilter,
  faChevronDown,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { API_ROUTER } from "../../../../App";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LongDateFormat } from "../../../../api/formatter";
import AccomplishmentEditOSSD from "./ossd_accomplishment_edit";

function OSSDAccomplishmentReportTable({
  activityFilter,
  setActivityFilter,
  accomplishmentsData,
  refreshData,
}) {
  // Add state for dropdown visibility
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedAccomplishment, setSelectedAccomplishment] = useState(null);

  // Add ref for handling outside clicks
  const dropdownRef = useRef(null);

  // Process and flatten the nested data structure
  const processActivities = () => {
    let allActivities = [];

    // Process Institutional Activities
    if (
      accomplishmentsData.Institutional &&
      Array.isArray(accomplishmentsData.Institutional)
    ) {
      const institutional = accomplishmentsData.Institutional.map((item) => ({
        ...item,
        activity_type: "Institutional",
        event_status: item.over_all_status || "N/A",
      }));
      allActivities = [...allActivities, ...institutional];
    }

    // Process External Activities
    if (
      accomplishmentsData.External &&
      Array.isArray(accomplishmentsData.External)
    ) {
      const external = accomplishmentsData.External.map((item) => ({
        ...item,
        activity_type: "External",
        event_status: item.over_all_status || "N/A",
      }));
      allActivities = [...allActivities, ...external];
    }

    // Process Proposed Activities
    if (
      accomplishmentsData.Proposed &&
      Array.isArray(accomplishmentsData.Proposed)
    ) {
      const proposed = accomplishmentsData.Proposed.map((item) => ({
        ...item,
        activity_type: "Proposed Action Plan",
        event_status: item.over_all_status || "N/A",
      }));
      allActivities = [...allActivities, ...proposed];
    }

    return allActivities;
  };

  // Get all activities
  const allActivities = processActivities();

  // Filter activities based on selected filter
  const filteredActivities =
    activityFilter === "All"
      ? allActivities
      : allActivities.filter((a) => a.activity_type === activityFilter);

  // Add effect to close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowFilterDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filterOptions = [
    "All",
    "Proposed Action Plan",
    "Institutional",
    "External",
  ];

  const handleView = (activity) => {
    setSelectedAccomplishment(activity);
    setViewModalOpen(true);
  };

  const handleEdit = (activity) => {
    setSelectedAccomplishment(activity);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedAccomplishment(null);
    // Refresh data after edit
    if (refreshData) refreshData();
  };

  const handleCloseViewModal = () => {
    setViewModalOpen(false);
    setSelectedAccomplishment(null);
  };

  return (
    <div className="shadow-lg inset-shadow-gray-300 h-full ">
      <div className="bg-[#1e4976] text-white p-3 flex justify-between items-center">
        <h1 className="font-medium">Accomplishments</h1>
        <div className="flex gap-2">
          {/* Dropdown filter */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center gap-1 bg-white text-[#1e4976] px-3 py-1 rounded"
            >
              <FontAwesomeIcon icon={faFilter} size="sm" />
              <span>Filter Accomplishments: {activityFilter}</span>
              <FontAwesomeIcon icon={faChevronDown} size="sm" />
            </button>

            {showFilterDropdown && (
              <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                {filterOptions.map((type) => (
                  <button
                    key={type}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      activityFilter === type
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      setActivityFilter(type);
                      setShowFilterDropdown(false);
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">
                Event Title
              </th>
              <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">
                Activity Type
              </th>
              <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">
                Organization
              </th>
              <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">
                Event Date
              </th>
              <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">
                Event Description
              </th>
              <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">
                Status
              </th>
              <th className="p-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredActivities.length > 0 ? (
              filteredActivities.map(
                (activity, index) => (
                  console.log(activity),
                  (
                    <tr
                      key={activity._id || index}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                        {activity.event_title ?? "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold">
                          {activity.activity_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold">
                          {activity.organization.org_name}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold">
                          {activity.event_date
                            ? LongDateFormat(new Date(activity.event_date))
                            : "N/A"}
                        </span>
                      </td>
                      <td
                        className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate"
                        title={activity.event_description}
                      >
                        {activity.event_description ?? "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            activity.event_status === "Approved by the Adviser"
                              ? "bg-blue-100 text-blue-700"
                              : activity.event_status === "Approved by the Dean"
                              ? "bg-blue-100 text-blue-700"
                              : activity.event_status ===
                                "Approved by the OSSD Coordinator"
                              ? "bg-green-100 text-green-700"
                              : activity.event_status === "Pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {activity.event_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <div className="flex justify-center space-x-2">
                          <button
                            className="p-1.5 bg-[#17a2b8] hover:bg-[#138496] text-white rounded-full transition-colors duration-150 shadow-sm"
                            onClick={() => handleView(activity)}
                            title="View Details"
                          >
                            <FontAwesomeIcon icon={faEye} size="sm" />
                          </button>
                          <button
                            className="p-1.5 bg-[#dc3545] hover:bg-[#c82333] text-white rounded-full transition-colors duration-150 shadow-sm"
                            onClick={() => handleEdit(activity)}
                            title="Edit"
                          >
                            <FontAwesomeIcon icon={faPencil} size="sm" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )
              )
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-10 text-center text-sm text-gray-500 italic"
                >
                  No accomplishments found matching the selected filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {selectedAccomplishment && (
        <EditModal
          isOpen={editModalOpen}
          onClose={handleCloseEditModal}
          accomplishment={selectedAccomplishment}
        />
      )}

      {/* View Modal */}
      {selectedAccomplishment && (
        <ViewModal
          isOpen={viewModalOpen}
          onClose={handleCloseViewModal}
          accomplishment={selectedAccomplishment}
        />
      )}
    </div>
  );
}

export default function OssdAccomplishmentView({ storedUser }) {
  const [activityFilter, setActivityFilter] = useState("All");
  const [showAddForm, setShowAddForm] = useState(false);
  const [accomplishmentsData, setAccomplishmentsData] = useState({
    Institutional: [],
    External: [],
    Proposed: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllAccomplishments = async () => {
    // Validate storedUser
    if (!storedUser || (Array.isArray(storedUser) && storedUser.length === 0)) {
      setError("No organizations provided.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Extract organization IDs - handle both array and single object case
      const organizationIds = Array.isArray(storedUser)
        ? storedUser.map((org) => org._id)
        : [storedUser._id];

      // Call the API endpoint with the organization IDs
      const response = await axios.post(
        `${API_ROUTER}/get-accomplishments-ossd`,
        {
          organizationIds,
        }
      );

      // Set the accomplishments from the response
      const transformedData = {
        Institutional: response.data?.InstitutionalActivity || [],
        External: response.data?.ExternalActivity || [],
        Proposed: response.data?.ProposedActivity || [],
      };

      // Set the accomplishments with transformed data
      setAccomplishmentsData(transformedData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching accomplishments:", err);
      setError(
        err.response?.data?.message || "Failed to fetch accomplishments"
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAccomplishments();
  }, [storedUser]);

  if (!storedUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading user data...
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading accomplishments...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <OSSDAccomplishmentReportTable
      activityFilter={activityFilter}
      setActivityFilter={setActivityFilter}
      accomplishmentsData={accomplishmentsData}
      refreshData={fetchAllAccomplishments}
    />
  );
}
