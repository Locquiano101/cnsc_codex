import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faP,
  faPencil,
  faPlus,
  faFilter,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import AddStudentAccomplishmentReport from "./student_accomplishment_add";
import { LongDateFormat, LongDateFormatVer2 } from "../../../../api/formatter";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ROUTER } from "../../../../App";
import RandomTest from "./student_accomplishment_edit";

function StudentAccomplishmentReportTable({
  activityFilter,
  setActivityFilter,
  filteredActivities,
  onAdd,
  onEdit,
}) {
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const dropdownRef = useRef(null);

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

  const filterOptions = ["All", "Proposed", "Institutional", "External"];

  return (
    <div className="font-sans border-b-cnsc-blue-color p-5 h-screen">
      <div className="bg-[#222222] text-white p-3 flex justify-between items-center">
        <h1 className="font-bold text-18">Accomplishments</h1>
        <div className="flex gap-2">
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center gap-1 bg-white text-[#1e4977] px-3 py-1 rounded text-sm"
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
                        ? "bg-blue-50 text-blue-700"
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

          <button
            className="flex items-center gap-1 bg-[#fd7e14] text-white px-3 py-1 rounded text-sm"
            onClick={onAdd}
          >
            <FontAwesomeIcon icon={faPlus} size="sm" />
            Add Accomplishment
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b px-7">
                Event Title
              </th>
              <th className="p-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b px-7">
                Accomplishment Type
              </th>
              <th className="p-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b px-7">
                Event Date
              </th>
              <th className="p-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b px-7">
                Event Description
              </th>
              <th className="p-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b px-7">
                Status
              </th>
              <th className="p-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b px-7">
                Last Update
              </th>
              <th className="p-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider border-b px-7">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredActivities.length > 0 ? (
              filteredActivities.map((activity, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-7 py-4 whitespace-nowrap text-sm font-normal text-gray-800">
                    {activity.event_title ?? "N/A"}
                  </td>
                  <td className="px-7 py-4 whitespace-nowrap text-sm text-gray-700">
                    <span className="px-2 inline-flex text-xs leading-5 font-normal">
                      {activity.activity_type}
                    </span>
                  </td>
                  <td className="px-7 py-4 whitespace-nowrap text-sm text-gray-700">
                    <span className="px-2 inline-flex text-xs leading-5 font-normal">
                      {LongDateFormat(new Date(activity.event_date))}
                    </span>
                  </td>
                  <td
                    className="px-7 py-4 text-sm text-gray-700 max-w-xs truncate font-normal"
                    title={activity.event_description}
                  >
                    {activity.event_description ?? "N/A"}
                  </td>

                  <td className="px-7 py-4 whitespace-nowrap text-sm text-gray-700">
                    {activity.over_all_status ? (
                      <span className="flex items-center">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                            activity.over_all_status ===
                            "Approved by the Adviser"
                              ? "bg-blue-100 text-Blue-700"
                              : activity.over_all_status ===
                                "Approved by the Dean"
                              ? "bg-blue-100 text-blue-700"
                              : activity.over_all_status ===
                                "Approved by the OSSD Coordinator"
                              ? "bg-green-100 text-green-700"
                              : activity.over_all_status === "Pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {activity.over_all_status}
                        </span>
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-gray-300 mr-2"></span>
                        <span className="text-gray-500 font-normal">N/A</span>
                      </span>
                    )}
                  </td>
                  <td className="px-7 py-4 whitespace-nowrap text-sm text-gray-700">
                    <span className="px-2 inline-flex text-xs leading-5 font-normal">
                      {LongDateFormatVer2(new Date(activity.updatedAt))}
                    </span>
                  </td>
                  <td className="px-7 py-4 whitespace-nowrap text-sm font-bold">
                    <div className="flex justify-center space-x-2">
                      <button
                        className="p-1.5 bg-[#17a2b8] hover:bg-[#138497] text-white rounded-full transition-colors duration-150 shadow-sm"
                        onClick={() => console.log("View", activity)}
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
                  colSpan="5"
                  className="px-7 py-10 text-center text-sm text-gray-500 italic font-normal"
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

export default function StudentAccomplishmentsTableView({ user }) {
  const [editingAccomplishment, setEditingAccomplishment] = useState(null);
  const [activityFilter, setActivityFilter] = useState("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [fileData, setFileData] = useState({});
  const [accomplishmentsList, setAccomplishmentsList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

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

    getAccomplishmentByOrgID();
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (fieldName, file) => {
    setFileData((prev) => ({
      ...prev,
      [fieldName]: file,
    }));
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    console.log("File Data:", fileData);
    setIsAddModalOpen(false);
    setFormData({});
    setFileData({});
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    console.log("Editing accomplishment:", editingAccomplishment);
    console.log("Updated Form Data:", formData);
    console.log("Updated File Data:", fileData);
    setIsEditModalOpen(false);
    setEditingAccomplishment(null);
    setFormData({});
    setFileData({});
  };

  const filteredActivities =
    activityFilter === "All"
      ? accomplishmentsList || []
      : (accomplishmentsList || []).filter(
          (a) => a.activity_type === activityFilter
        );

  const handleAddAccomplishment = () => {
    setFormData({});
    setFileData({});
    setIsAddModalOpen(true);
  };

  const handleEditAccomplishment = (activity) => {
    setEditingAccomplishment(activity);
    setFormData({
      title: activity.title || "",
      description: activity.description || "",
      activity_type: activity.activity_type || "",
    });
    setIsEditModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setFormData({});
    setFileData({});
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingAccomplishment(null);
    setFormData({});
    setFileData({});
  };

  if (!user) {
    return (
      <div className="font-sans flex items-center justify-center h-screen">
        Loading user data...
      </div>
    );
  }

  if (loading) {
    return (
      <div className="font-sans flex items-center justify-center h-screen">
        Loading accomplishments...
      </div>
    );
  }

  if (error) {
    return (
      <div className="font-sans flex items-center justify-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="h-full font-sans">
      <StudentAccomplishmentReportTable
        activityFilter={activityFilter}
        setActivityFilter={setActivityFilter}
        filteredActivities={filteredActivities}
        onAdd={handleAddAccomplishment}
        onEdit={handleEditAccomplishment}
      />

      {isAddModalOpen && (
        <Modal isOpen={isAddModalOpen} onClose={closeAddModal}>
          <div className="bg-white p-4 w-full rounded-lg h-full overflow-y-auto font-sans">
            <h2 className="text-xl font-bold mb-4">Add New Accomplishment</h2>
            <AddStudentAccomplishmentReport
              user={user}
              onSubmit={handleAddSubmit}
              onBack={closeAddModal}
              formDataState={formData}
              handleChange={handleChange}
              handleFileChange={handleFileChange}
              isModal={true}
            />
          </div>
        </Modal>
      )}

      {isEditModalOpen && editingAccomplishment && (
        <Modal isOpen={isEditModalOpen} onClose={closeEditModal}>
          <div className="bg-white rounded-lg w-full h-full overflow-y-auto font-sans">
            <RandomTest
              selectedAccomplishment={editingAccomplishment}
              onSubmit={handleEditSubmit}
              onClose={() => setIsEditing(false)}
              onBack={closeEditModal}
              formDataState={formData}
              handleChange={handleChange}
              handleFileChange={handleFileChange}
              isModal={true}
            />
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur z-50 flex items-center justify-center font-sans">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden h-11/12 w-3/4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 18L18 7M7 7l12 12"
            />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
}
