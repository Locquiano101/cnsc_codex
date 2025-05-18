import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faPencil,
  faFilter,
  faChevronDown,
  faX,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { API_ROUTER } from "../../../../App";
import axios from "axios";
import { LongDateFormat } from "../../../../api/formatter";
import AccomplishmentEditAdviser from "./adviser_accomplishment_edit";

// Modal component for editing accomplishments
function EditModal({ isOpen, onClose, accomplishment }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-xl font-semibold">Edit Accomplishment</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className="overflow-y-auto p-4 flex-grow">
          <AccomplishmentEditAdviser
            selectedAccomplishment={accomplishment}
            onBack={onClose}
          />
        </div>
      </div>
    </div>
  );
}

// View Modal component for viewing accomplishment details
function ViewModal({ isOpen, onClose, accomplishment }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-xs flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Accomplishment Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Event Title
                </h3>
                <p className="text-base">
                  {accomplishment.event_title || "N/A"}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Activity Type
                </h3>
                <p className="text-base">
                  {accomplishment.activity_type || "N/A"}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Event Date
                </h3>
                <p className="text-base">
                  {accomplishment.event_date
                    ? LongDateFormat(new Date(accomplishment.event_date))
                    : "N/A"}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    accomplishment.over_all_status === "Approved by the Adviser"
                      ? "bg-green-100 text-green-700"
                      : accomplishment.over_all_status ===
                        "Approved by the Dean"
                      ? "bg-blue-100 text-blue-700"
                      : accomplishment.over_all_status ===
                        "Approved by the OSSD Coordinator"
                      ? "bg-blue-100 text-blue-700"
                      : accomplishment.over_all_status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {accomplishment.over_all_status}
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Event Description
              </h3>
              <p className="text-base whitespace-pre-wrap">
                {accomplishment.event_description || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdviserAccomplishmentReportTable({
  activityFilter,
  setActivityFilter,
  filteredActivities,
  onEdit,
  onView,
}) {
  // Add state for dropdown visibility
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Add ref for handling outside clicks
  const dropdownRef = useRef(null);

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
    "Institutional Activity",
    "External Activity",
  ];

  return (
    <div className=" border-b-cnsc-blue-color h-screen shadow-md p-7 ">
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
              <span>Filter: {activityFilter}</span>
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
              filteredActivities.map((activity, index) => (
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
                        activity.over_all_status === "Approved by the Adviser"
                          ? "bg-green-100 text-green-700"
                          : activity.over_all_status === "Approved by the Dean"
                          ? "bg-blue-100 text-blue-700"
                          : activity.over_all_status ===
                            "Approved by the OSSD Coordinator"
                          ? "bg-blue-100 text-blue-700"
                          : activity.over_all_status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {activity.over_all_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <div className="flex justify-center space-x-2">
                      <button
                        className="p-1.5 bg-[#17a2b8] hover:bg-[#138496] text-white rounded-full transition-colors duration-150 shadow-sm"
                        onClick={() => onView(activity)}
                        title="View Details"
                      >
                        <FontAwesomeIcon icon={faEye} size="sm" />
                      </button>
                      <button
                        className="p-1.5 bg-[#dc3545] hover:bg-[#c82333] text-white rounded-full transition-colors duration-150 shadow-sm"
                        onClick={() => onEdit(activity)}
                        title="Edit"
                      >
                        <FontAwesomeIcon icon={faPencil} size="sm" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
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
    </div>
  );
}

export default function AdviserAccomplishmentsTableView({ user }) {
  const [activityFilter, setActivityFilter] = useState("All");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAccomplishment, setSelectedAccomplishment] = useState(null);
  const [accomplishmentsList, setAccomplishmentsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && user.organization && user.organization._id) {
      getAccomplishmentByOrgID();
    }
  }, [user]);

  // Define the function for fetching accomplishments
  async function getAccomplishmentByOrgID() {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_ROUTER}/accomplishments/${user.organization._id}`
      );
      const {
        InstitutionalActivity = [],
        ExternalActivity = [],
        ProposedActivity = [],
      } = response.data;

      const allActivities = [
        ...InstitutionalActivity,
        ...ExternalActivity,
        ...ProposedActivity,
      ];

      setAccomplishmentsList(allActivities);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch accomplishments data");
    } finally {
      setLoading(false);
    }
  }

  const handleViewAccomplishment = (accomplishment) => {
    setSelectedAccomplishment(accomplishment);
    setShowViewModal(true);
  };

  const handleEditAccomplishment = (accomplishment) => {
    setSelectedAccomplishment(accomplishment);
    setShowEditForm(true);
  };

  const handleCloseModal = () => {
    setShowAddForm(false);
    setShowEditForm(false);
    setShowViewModal(false);
    setSelectedAccomplishment(null);

    // Refresh the list after edits
    if (user && user.organization) {
      getAccomplishmentByOrgID();
    }
  };

  // Filter activities based on selected filter
  const filteredActivities =
    activityFilter === "All"
      ? accomplishmentsList || []
      : (accomplishmentsList || []).filter(
          (a) => a.activity_type === activityFilter
        );

  const handleAddAccomplishment = () => {
    setShowAddForm(true);
  };

  if (!user) {
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
    <div className="relative">
      {/* Main Table View */}
      <AdviserAccomplishmentReportTable
        activityFilter={activityFilter}
        setActivityFilter={setActivityFilter}
        filteredActivities={filteredActivities}
        onEdit={handleEditAccomplishment}
        onView={handleViewAccomplishment}
      />

      {/* View Modal */}
      {showViewModal && selectedAccomplishment && (
        <ViewModal
          isOpen={showViewModal}
          onClose={handleCloseModal}
          accomplishment={selectedAccomplishment}
        />
      )}

      {/* Edit Form Modal */}
      {showEditForm && selectedAccomplishment && (
        <EditModal
          isOpen={showEditForm}
          onClose={handleCloseModal}
          accomplishment={selectedAccomplishment}
        />
      )}

      {/* Add Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Add New Accomplishment</h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
              {/* Add form component should be placed here */}
              {/* <AccomplishmentAddAdviser user={user} onBack={handleCloseModal} /> */}
              <div className="text-center py-8 text-gray-500">
                Add accomplishment form component should be implemented here
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
