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
import AddStudentAccomplishedActionPlan from "./student_accomplishment_add";
import LongDateFormat from "../../../../api/formatter";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ROUTER } from "../../../../App";

function StudentAccomplishmentReportTable({
  activityFilter,
  setActivityFilter,
  filteredActivities,
  onAdd,
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
    <div className=" max-h-[500px] border-b-cnsc-blue-color shadow-md h-110">
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

          {/* Add button */}
          <button
            className="flex items-center gap-1 bg-[#fd7e14] text-white px-3 py-1 rounded"
            onClick={onAdd}
          >
            <FontAwesomeIcon icon={faPlus} size="sm" />
            Add Accomplishment
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white ">
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
                  key={index}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                    {activity.event_title ?? "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold ">
                      {activity.activity_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold ">
                      {LongDateFormat(new Date(activity.event_date))}
                    </span>
                  </td>
                  <td
                    className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate"
                    title={activity.event_description}
                  >
                    {activity.event_description ?? "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {activity.event_status ? (
                      <span className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                        <span>{activity.event_status}</span>
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-gray-300 mr-2"></span>
                        <span className="text-gray-500">N/A</span>
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <div className="flex justify-center space-x-2">
                      <button
                        className="p-1.5 bg-[#17a2b8] hover:bg-[#138496] text-white rounded-full transition-colors duration-150 shadow-sm"
                        onClick={() => console.log("View", activity)}
                        title="View Details"
                      >
                        <FontAwesomeIcon icon={faEye} size="sm" />
                      </button>
                      <button
                        className="p-1.5 bg-[#dc3545] hover:bg-[#c82333] text-white rounded-full transition-colors duration-150 shadow-sm"
                        onClick={() => console.log("Edit", activity)}
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

export default function StudentAccomplishmentsTableView({ user }) {
  const [activityFilter, setActivityFilter] = useState("All");
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({});
  const [fileData, setFileData] = useState({});
  const [accomplishmentsList, setAccomplishmentsList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  console.log(user);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    console.log("File Data:", fileData);
    // Submit to API here
    setShowAddForm(false); // return to table view after submission
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
    <div>
      {showAddForm ? (
        <AddStudentAccomplishedActionPlan
          onSubmit={handleSubmit}
          onBack={() => setShowAddForm(false)}
          formDataState={formData}
          handleChange={handleChange}
          handleFileChange={handleFileChange}
        />
      ) : (
        <StudentAccomplishmentReportTable
          activityFilter={activityFilter}
          setActivityFilter={setActivityFilter}
          filteredActivities={filteredActivities}
          onAdd={handleAddAccomplishment}
        />
      )}
    </div>
  );
}
