import { API_ROUTER } from "../../../../App";
import { useState, useEffect } from "react";
import axios from "axios";
import { Star } from "lucide-react";
import SduAccomplishmentRating from "./accomplishment_rating";

export default function AccomplishmentsTable() {
  const [accomplishments, setAccomplishments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for the rating modal
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [currentAccomplishment, setCurrentAccomplishment] = useState(null);

  useEffect(() => {
    async function getAccomplishmentByOrgID() {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_ROUTER}/accomplishments/`);
        const responseData = response.data;

        // Just store all activities directly without transformation
        const allActivities = [
          ...(responseData.InstitutionalActivity || []),
          ...(responseData.ExternalActivity || []),
          ...(responseData.ProposedActivity || []),
        ];

        console.log("Activities:", allActivities);
        setAccomplishments(allActivities);
      } catch (err) {
        console.error("Error fetching accomplishments:", err);
        setError("Failed to fetch accomplishments data");
      } finally {
        setIsLoading(false);
      }
    }

    getAccomplishmentByOrgID();
  }, []);

  // Format status for display
  function formatStatus(status) {
    if (!status) return "Pending";

    if (status.includes("Approved")) {
      return "Completed";
    } else if (status.includes("Pending")) {
      return "Pending";
    } else {
      return "In Progress";
    }
  }

  const handleScore = (index) => {
    setCurrentAccomplishment(accomplishments[index]);
    setShowRatingModal(true);
  };

  const getScoreColor = (score) => {
    if (!score) return "text-gray-500";
    if (score < 30) return "text-red-500";
    if (score < 70) return "text-yellow-500";
    return "text-green-500";
  };

  const getStatusColor = (status) => {
    if (!status) return "bg-gray-100 text-gray-700";

    const statusLower = status.toLowerCase();
    if (statusLower.includes("approved")) {
      return "bg-green-100 text-green-700";
    } else if (statusLower.includes("pending")) {
      return "bg-yellow-100 text-yellow-700";
    } else if (statusLower.includes("progress")) {
      return "bg-blue-100 text-blue-700";
    } else {
      return "bg-gray-100 text-gray-700";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading accomplishments...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="h-full overflow-y-auto rounded-[24px] relative">
      <table className="w-full bg-white table-auto">
        <thead className="sticky top-0 bg-gray-100 z-10">
          <tr>
            <th className="py-3 px-6 text-left font-semibold text-gray-700">
              Organization
            </th>
            <th className="py-3 px-6 text-left font-semibold text-gray-700">
              Accomplishment Title
            </th>
            <th className="py-3 px-6 text-left font-semibold text-gray-700">
              Score
            </th>
            <th className="py-3 px-6 text-left font-semibold text-gray-700">
              Status
            </th>
            <th className="py-3 px-6 text-center font-semibold text-gray-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {accomplishments.map((item, index) => (
            <tr
              key={item._id || index}
              className="border-b border-gray-200 hover:bg-gray-50"
            >
              <td className="py-4 px-6 text-gray-700 font-medium">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full flex items-center justify-center mr-3">
                    <img
                      src={
                        item.organization?.logo
                          ? `/${item.organization?.org_name}/Accreditation/Accreditation/photos/${item.organization.logo}`
                          : "/placeholder-logo.png"
                      }
                      className="h-full rounded-full aspect-square object-cover"
                      alt={`${
                        item.organization?.org_name || "Organization"
                      } logo`}
                      onError={(e) => {
                        e.target.src = "/placeholder-logo.png";
                        e.target.onerror = null;
                      }}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span>
                      {item.organization?.org_name || "Unknown Organization"}
                    </span>
                    {item.organization?.org_acronym && (
                      <span className="text-xs text-gray-500">
                        {item.organization.org_acronym}
                      </span>
                    )}
                  </div>
                </div>
              </td>
              <td className="py-4 px-6 text-gray-700">
                {item.event_title || item.name || "Untitled Activity"}
              </td>
              <td className="py-4 px-6">
                <span
                  className={`font-medium ${getScoreColor(item.event_score)}`}
                >
                  {item.event_score ? `${item.event_score}%` : "N/A"}
                </span>
              </td>
              <td className="py-4 px-6">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                    item.over_all_status
                  )}`}
                >
                  {formatStatus(item.over_all_status)}
                </span>
              </td>
              <td className="py-4 px-6 text-center">
                <button
                  onClick={() => handleScore(index)}
                  className="text-amber-500 hover:text-amber-700"
                  title="Score"
                >
                  <span className="flex text-xl items-center justify-center gap-2">
                    Rate <Star size={20} />
                  </span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Rating Modal */}
      {showRatingModal && currentAccomplishment && (
        <SduAccomplishmentRating
          accomplishment={currentAccomplishment}
          onClose={() => setShowRatingModal(false)}
        />
      )}
    </div>
  );
}
