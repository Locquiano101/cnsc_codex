import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_ROUTER } from "../../../App";
import AccreditationDetail from "./add_accreditation";

// List view: shows a table of accreditations.
function AccreditationListView({ accreditations, onView }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="px-4 py-2">Organization Name</th>
            <th className="px-4 py-2">Accreditation Type</th>
            <th className="px-4 py-2">Overall Status</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {accreditations.map((acc) => (
            <tr key={acc._id} className="border-b">
              <td className="px-4 py-2">{acc.org_name}</td>
              <td className="px-4 py-2">
                {acc.accreditation_status?.accreditation_type || "N/A"}
              </td>
              <td className="px-4 py-2">
                {acc.accreditation_status?.over_all_status || "N/A"}
              </td>
              <td className="px-4 py-2">
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => onView(acc)}
                >
                  <FontAwesomeIcon icon={faEye} className="mr-2" />
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Main component controlling the entire accreditation list feature.
export default function AccreditationList() {
  const [accreditations, setAccreditations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAccreditation, setSelectedAccreditation] = useState(null);
  const [activeContent, setActiveContent] = useState("list");

  useEffect(() => {
    const fetchAccreditations = async () => {
      try {
        const response = await axios.get(`${API_ROUTER}/get-accreditation`);
        setAccreditations(response.data.accreditations);
      } catch (err) {
        console.error("Error fetching accreditations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAccreditations();
  }, []);

  // Function triggered when a user clicks "View" in the table.
  const handleView = (acc) => {
    setSelectedAccreditation(acc);
    setActiveContent("detail");
  };

  // Function to return back to the list view.
  const handleBack = () => {
    setSelectedAccreditation(null);
    setActiveContent("list");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold text-center mb-4">
        STUDENT ORGANIZATION ACCREDITATION
      </h1>
      {activeContent === "detail" ? (
        <AccreditationDetail
          selectedAccreditation={selectedAccreditation}
          goBack={handleBack}
        />
      ) : (
        <AccreditationListView
          accreditations={accreditations}
          onView={handleView}
        />
      )}
    </div>
  );
}
