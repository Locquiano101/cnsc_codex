import axios from "axios";
import React, { useState, useEffect } from "react";
import { API_ROUTER } from "../../../../App";
import { FileRenderer } from "../../../../components/file_renderer";

export default function ProcessAccreditationSection({
  selectedAccreditation,
  goBack,
}) {
  console.log(selectedAccreditation);
  const [editedAccreditation, setEditedAccreditation] = useState(null);
  const basePath = `/${selectedAccreditation.org_name}/Accreditation/Accreditation`;

  useEffect(() => {
    if (selectedAccreditation) {
      setEditedAccreditation(selectedAccreditation);
    }
  }, [selectedAccreditation]);

  if (!editedAccreditation) return null;

  const computeOverallStatus = (docs) =>
    docs.every((d) => d.Status === "approved")
      ? "Accredited"
      : "Revision Required";

  const handleStatusChange = (index, newStatus) => {
    const docs = getDocumentsArray();
    const updatedDocs = docs.map((doc, idx) =>
      idx === index ? { ...doc, Status: newStatus } : doc
    );
    updateDocumentsArray(updatedDocs);
  };

  const handleRevisionNoteChange = (index, newNote) => {
    const docs = getDocumentsArray();
    const updatedDocs = docs.map((doc, idx) =>
      idx === index ? { ...doc, revision_notes: newNote } : doc
    );
    updateDocumentsArray(updatedDocs);
  };

  const getDocumentsArray = () => {
    return (
      editedAccreditation.documents_and_status ||
      (editedAccreditation.accreditation_status &&
        editedAccreditation.accreditation_status.documents_and_status) ||
      []
    );
  };

  const updateDocumentsArray = (updatedDocs) => {
    setEditedAccreditation((prev) => {
      const newOverall = computeOverallStatus(updatedDocs);

      if (prev.documents_and_status) {
        return {
          ...prev,
          documents_and_status: updatedDocs,
          accreditation_status: {
            ...prev.accreditation_status,
            over_all_status: newOverall,
          },
        };
      }

      if (prev.accreditation_status?.documents_and_status) {
        return {
          ...prev,
          accreditation_status: {
            ...prev.accreditation_status,
            documents_and_status: updatedDocs,
            over_all_status: newOverall,
          },
        };
      }

      return {
        ...prev,
        accreditation_status: {
          documents_and_status: updatedDocs,
          over_all_status: newOverall,
        },
      };
    });
  };

  const handleSave = async () => {
    try {
      const payload = editedAccreditation;
      await axios.put(
        `${API_ROUTER}/process-accreditation-sdu/${payload.accreditation_status._id}`,
        payload
      );
      alert("Accreditation updated successfully.");
      window.location.reload(); // Reloads the entire page
    } catch (error) {
      console.error("Error updating accreditation:", error);
      alert("Failed to update accreditation.");
    }
  };

  const documents = getDocumentsArray();

  const fields = [
    ["Organization Name", "org_name", "4"],
    ["Organization Acronym", "org_acronym", "3"],
    ["Organization Class", "org_class", "3"],
    ["Organization President", "org_president", "4"],
    ["Organization Email", "org_email", "6"],
    ["Adviser Department", "adviser_department", "6"],
    ["Adviser Name", "adviser_name", "3"],
    ["Adviser Email", "adviser_email", "4"],
  ];

  return (
    <div className="px-8 py-6 space-y-6 bg-white rounded shadow-md">
      {/* Timestamp */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Last Updated:
        </label>
        <input
          type="text"
          value={new Date(editedAccreditation.updatedAt).toLocaleString()}
          readOnly
          disabled
          className="w-full p-2 border border-gray-300 bg-gray-100 rounded text-sm text-gray-600"
        />
      </div>

      {/* Organization Info */}
      <div className="grid grid-cols-12 gap-4">
        {fields.map(([label, key, span = "4"]) => (
          <div
            key={key}
            className={`col-span-${span} bg-gray-50 border border-gray-200 p-3 rounded`}
          >
            <label className="block text-xs font-medium text-gray-500">
              {label}
            </label>
            <div className="text-sm font-semibold text-gray-800">
              {editedAccreditation[key] || "—"}
            </div>
          </div>
        ))}
      </div>

      {/* Accreditation Status */}
      {editedAccreditation.accreditation_status && (
        <div className="grid grid-cols-2 gap-6 p-4 bg-gray-50 border rounded">
          <div>
            <label className="text-sm font-medium text-gray-500">
              Accreditation Type
            </label>
            <div className="text-base font-semibold text-gray-800 mt-1">
              {editedAccreditation.accreditation_status.accreditation_type ||
                ""}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">
              Overall Status
            </label>
            <div className="text-base font-semibold text-gray-800 mt-1">
              {editedAccreditation.accreditation_status.over_all_status || ""}
            </div>
          </div>
        </div>
      )}

      {/* Documents Section */}
      {documents.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-center text-gray-800">
            Documents Section
          </h2>
          {documents.map((doc, index) => (
            <div
              key={index}
              className="p-4 bg-white border border-gray-200 rounded shadow-sm space-y-3"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-700">{doc.label}</h3>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-1 text-sm text-green-700 font-medium">
                    <input
                      type="radio"
                      name={`status-${index}`}
                      value="approved"
                      checked={doc.Status === "approved"}
                      onChange={() => handleStatusChange(index, "approved")}
                    />
                    Approved
                  </label>
                  <label className="flex items-center gap-1 text-sm text-yellow-700 font-medium">
                    <input
                      type="radio"
                      name={`status-${index}`}
                      value="revision"
                      checked={doc.Status === "revision"}
                      onChange={() => handleStatusChange(index, "revision")}
                    />
                    Revision
                  </label>
                </div>
              </div>
              {doc.Status === "revision" && (
                <textarea
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                  placeholder="Enter revision notes..."
                  value={doc.revision_notes || ""}
                  onChange={(e) =>
                    handleRevisionNoteChange(index, e.target.value)
                  }
                />
              )}
              <div className="mt-4">
                <FileRenderer basePath={basePath} fileName={doc.file} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-end gap-4 pt-4 border-t">
        <button
          onClick={goBack}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded shadow"
        >
          Back
        </button>
        <button
          onClick={handleSave}
          className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded shadow"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
