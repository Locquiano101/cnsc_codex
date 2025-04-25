import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

import { API_ROUTER } from "../../../../App";
import ProcessAccreditationSection from "./edit";

export default function AccreditationTableSection() {
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

  const handleView = (acc) => {
    setSelectedAccreditation(acc);
    setActiveContent("Edit");
  };

  const handleBack = () => {
    setSelectedAccreditation(null);
    setActiveContent("list");
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-600">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-2xl p-6 space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Student Organization Accreditation
        </h1>

        {activeContent === "Edit" ? (
          <ProcessAccreditationSection
            selectedAccreditation={selectedAccreditation}
            goBack={handleBack}
          />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full text-sm text-gray-800">
              <thead className="bg-gray-100 text-xs uppercase tracking-wide text-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left">Organization Name</th>
                  <th className="px-6 py-3 text-left">Accreditation Type</th>
                  <th className="px-6 py-3 text-left">Overall Status</th>
                  <th className="px-6 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {accreditations.length > 0 ? (
                  accreditations.map((acc) => (
                    <tr
                      key={acc._id}
                      className="border-t border-gray-200 hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 font-medium">{acc.org_name}</td>
                      <td className="px-6 py-4">
                        {acc.accreditation_status?.accreditation_type || "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            acc.accreditation_status?.over_all_status ===
                            "Accredited"
                              ? "bg-green-100 text-green-700"
                              : acc.accreditation_status?.over_all_status ===
                                "Pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {acc.accreditation_status?.over_all_status || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition"
                          onClick={() => handleView(acc)}
                          title="View Accreditation"
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center px-6 py-8 text-gray-400 italic"
                    >
                      No accreditation records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        <div></div>
      </div>
    </div>
  );
}
