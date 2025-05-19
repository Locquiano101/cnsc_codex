import { useState, useEffect } from "react";
import axios from "axios";
import { API_ROUTER } from "../../../../../App";
import { faPen, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SduAccomplishmentApprovalEdit from "./edit";

// Helper function for date formatting
function LongDateFormat(date) {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function PopupModal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-xs">
      <div className="relative bg-white rounded-lg shadow-lg w-3/4 max-h-[90vh] overflow-auto">
        <div className="absolute top-4 right-4">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function SDuAccomplishmentsTable({ editAccomplishment }) {
  const [accomplishmentsList, setAccomplishmentsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch accomplishments data
    const fetchAccomplishments = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_ROUTER}/system-wide-accomplishments`
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
    };

    fetchAccomplishments();
  }, []);

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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Accomplishments</h1>

      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Event Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Organization
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Activity Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Event Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {accomplishmentsList.length > 0 ? (
              accomplishmentsList.map((activity, index) => (
                <tr key={activity._id || index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {activity.event_title || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {activity.organization?.org_name || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {activity.activity_type || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {activity.event_date
                      ? LongDateFormat(new Date(activity.event_date))
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        activity.over_all_status === "Approved by the Adviser"
                          ? "bg-green-100 text-green-800"
                          : activity.over_all_status === "Approved by the Dean"
                          ? "bg-blue-100 text-blue-800"
                          : activity.over_all_status ===
                            "Approved by the OSSD Coordinator"
                          ? "bg-blue-100 text-blue-800"
                          : activity.over_all_status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {activity.over_all_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {activity.event_description || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    <button
                      className="p-1.5 bg-[#17a2b8] hover:bg-[#138496] text-white rounded-full"
                      title="View"
                      onClick={() => editAccomplishment(activity)}
                    >
                      <FontAwesomeIcon icon={faPen} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-4 text-center text-sm text-gray-500 italic"
                >
                  No accomplishments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function SduAccomplishmentApprovalSection() {
  const [selectedAccomplishment, setselectedAccomplishment] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditAccomplishment = (accomplishment) => {
    setselectedAccomplishment(accomplishment);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    // Optionally refresh the proposal list here
  };

  return (
    <>
      <SDuAccomplishmentsTable editAccomplishment={handleEditAccomplishment} />

      <PopupModal isOpen={isEditModalOpen} onClose={handleCloseModal}>
        {selectedAccomplishment && (
          <SduAccomplishmentApprovalEdit
            selectedAccomplishment={selectedAccomplishment}
            onBack={handleCloseModal}
          />
        )}
      </PopupModal>
    </>
  );
}
