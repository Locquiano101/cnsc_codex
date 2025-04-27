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
    console.log("Updated Accreditation JSON:", editedAccreditation);
    try {
      const response = await axios.put(
        `${API_ROUTER}/process-accreditation-sdu/${editedAccreditation.accreditation_status._id}`,
        editedAccreditation
      );
      console.log("Accreditation update response:", response.data);
      alert("Accreditation updated successfully.");
    } catch (err) {
      console.error(
        "Error updating accreditation:",
        err.response?.data || err.message
      );
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
    <div>
      {/* Updated At (read-only) */}
      <div className="flex gap-2 mb-4 items-center">
        <strong className="min-w-fit mr-4 ">Updated At:</strong>
        <input
          type="text"
          value={new Date(editedAccreditation.updatedAt).toLocaleString()}
          readOnly
          disabled
          className="w-full p-1 border bg-gray-200 cursor-not-allowed"
        />
      </div>
      <div className="grid grid-cols-7 w-full gap-1 mb-4">
        {fields.map(([label, key, span = 1]) => (
          <div
            key={key}
            className={`col-span-${span} border items-center flex bg-gray-50 p-2 rounded`}
          >
            <h1>
              <span className="font-bold">{label}:</span>{" "}
              {editedAccreditation[key] || "—"}
            </h1>
          </div>
        ))}
        {editedAccreditation.accreditation_status && (
          <div className="border p-2 col-span-7 flex justify-around rounded bg-gray-50">
            <h1 className="font-bold">
              Accreditation Status:
              <span className="font-normal ml-2">
                {editedAccreditation.accreditation_status.accreditation_type ||
                  ""}
              </span>
            </h1>
            <h1 className="block mb-2">
              <strong>Overall Status:</strong>
              <span className="font-normal ml-2">
                {editedAccreditation.accreditation_status.over_all_status || ""}
              </span>{" "}
            </h1>
          </div>
        )}
      </div>

      {/* Documents Section (editable) */}
      {documents.length > 0 && (
        <div className="flex flex-col gap-2 ">
          <h1 className="text-center text-xl ">Documents Section</h1>
          {documents.map((doc, index) => (
            <div key={index} className="flex gap-4 border-b ">
              <div className="flex flex-col flex-1">
                <div className="space-x-4 flex justify-between">
                  <h1 className="min-w-fit font-medium">{doc.label}:</h1>
                  <div className="flex gap-4">
                    <label for={`status-${index}`}>
                      <input
                        type="radio"
                        name={`status-${index}`}
                        value="approved"
                        checked={doc.Status === "approved"}
                        onChange={() => handleStatusChange(index, "approved")}
                        className="mr-2"
                      />
                      Approved
                    </label>
                    <label for={`status-${index}`}>
                      <input
                        type="radio"
                        name={`status-${index}`}
                        value="revision"
                        checked={doc.Status === "revision"}
                        onChange={() => handleStatusChange(index, "revision")}
                        className="mr-2"
                      />
                      Approved
                    </label>
                  </div>
                </div>
                {doc.Status === "revision" && (
                  <textarea
                    className="border p-2 w-full h-20"
                    placeholder="Enter revision notes..."
                    value={doc.revision_notes || ""}
                    onChange={(e) =>
                      handleRevisionNoteChange(index, e.target.value)
                    }
                  />
                )}
              </div>

              {/* File Rendering */}
              <div className="flex-1/2">
                <FileRenderer basePath={basePath} fileName={doc.file} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex mt-4">
        <button
          className="mr-2 px-4 py-2 bg-green-500 text-white rounded"
          onClick={handleSave}
        >
          Save Changes
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={goBack}
        >
          Back
        </button>
      </div>
    </div>
  );
}
