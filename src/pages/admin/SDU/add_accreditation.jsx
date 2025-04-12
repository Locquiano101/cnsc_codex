import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ProcessAccreditation({
  selectedAccreditation,
  goBack,
}) {
  const [editedAccreditation, setEditedAccreditation] = useState(null);
  const navigate = useNavigate();

  // When the component mounts or when selectedAccreditation changes, initialize state.
  useEffect(() => {
    if (selectedAccreditation) {
      console.log("Initial JSON:", selectedAccreditation);
      setEditedAccreditation(selectedAccreditation);
    }
  }, [selectedAccreditation]);

  // If no accreditation is selected, return null.
  if (!editedAccreditation) return null;

  // Update any top-level fields.
  const handleChange = (field, value) => {
    setEditedAccreditation((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Update nested fields (for properties inside accreditation_status).
  const handleNestedChange = (parent, field, value) => {
    setEditedAccreditation((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value,
      },
    }));
  };

  // Determines if the passed filename is an image.
  const isImageFile = (filename) => /\.(jpg|jpeg|png|gif)$/i.test(filename);

  // Get the documents array, whether located at the top level or nested inside accreditation_status.
  const getDocumentsArray = () => {
    return (
      editedAccreditation.documents_and_status ||
      (editedAccreditation.accreditation_status &&
        editedAccreditation.accreditation_status.documents_and_status) ||
      []
    );
  };

  // Helper function to update the documents array in state.
  const updateDocumentsArray = (updatedDocs) => {
    if (editedAccreditation.documents_and_status) {
      setEditedAccreditation((prev) => ({
        ...prev,
        documents_and_status: updatedDocs,
      }));
    } else if (
      editedAccreditation.accreditation_status &&
      editedAccreditation.accreditation_status.documents_and_status
    ) {
      setEditedAccreditation((prev) => ({
        ...prev,
        accreditation_status: {
          ...prev.accreditation_status,
          documents_and_status: updatedDocs,
        },
      }));
    }
  };

  // Handle the change of status for a document.
  // This function immediately updates the corresponding document's status in our state.
  const handleStatusChange = (index, newStatus) => {
    const docs = getDocumentsArray();
    const updatedDocs = docs.map((doc, idx) =>
      idx === index ? { ...doc, Status: newStatus } : doc
    );
    updateDocumentsArray(updatedDocs);
  };

  // Handle updating the revision note for a document.
  const handleRevisionNoteChange = (index, newNote) => {
    const docs = getDocumentsArray();
    const updatedDocs = docs.map((doc, idx) =>
      idx === index ? { ...doc, revision_notes: newNote } : doc
    );
    updateDocumentsArray(updatedDocs);
  };

  // Save function: for this example, it simply logs the edited accreditation.
  const handleSave = () => {
    console.log("Updated Accreditation JSON:", editedAccreditation);
    // Add API call or further logic to persist data if needed.
  };

  // Use a safe version of the organization name in case it is missing.
  const safeOrgName = editedAccreditation.org_name || "";
  const documents = getDocumentsArray();

  return (
    <div className="p-4 border rounded-lg bg-gray-100 shadow-md">
      {/* Top-Level Fields */}
      <div className="mb-4">
        <label className="block mb-2">
          <strong>Adviser Name:</strong>
          <input
            type="text"
            value={editedAccreditation.adviser_name || ""}
            onChange={(e) => handleChange("adviser_name", e.target.value)}
            className="w-full p-1 border"
          />
        </label>

        <label className="block mb-2">
          <strong>Adviser Email:</strong>
          <input
            type="text"
            value={editedAccreditation.adviser_email || ""}
            onChange={(e) => handleChange("adviser_email", e.target.value)}
            className="w-full p-1 border"
          />
        </label>

        <label className="block mb-2">
          <strong>Adviser Department:</strong>
          <input
            type="text"
            value={editedAccreditation.adviser_department || ""}
            onChange={(e) => handleChange("adviser_department", e.target.value)}
            className="w-full p-1 border"
          />
        </label>

        <label className="block mb-2">
          <strong>Organization Name:</strong>
          <input
            type="text"
            value={editedAccreditation.org_name || ""}
            onChange={(e) => handleChange("org_name", e.target.value)}
            className="w-full p-1 border"
          />
        </label>

        <label className="block mb-2">
          <strong>Organization Acronym:</strong>
          <input
            type="text"
            value={editedAccreditation.org_acronym || ""}
            onChange={(e) => handleChange("org_acronym", e.target.value)}
            className="w-full p-1 border"
          />
        </label>

        <label className="block mb-2">
          <strong>Organization President:</strong>
          <input
            type="text"
            value={editedAccreditation.org_president || ""}
            onChange={(e) => handleChange("org_president", e.target.value)}
            className="w-full p-1 border"
          />
        </label>

        <label className="block mb-2">
          <strong>Organization Class:</strong>
          <input
            type="text"
            value={editedAccreditation.org_class || ""}
            onChange={(e) => handleChange("org_class", e.target.value)}
            className="w-full p-1 border"
          />
        </label>

        <label className="block mb-2">
          <strong>Organization Email:</strong>
          <input
            type="text"
            value={editedAccreditation.org_email || ""}
            onChange={(e) => handleChange("org_email", e.target.value)}
            className="w-full p-1 border"
          />
        </label>

        <label className="block mb-2">
          <strong>Logo File Name:</strong>
          <input
            type="text"
            value={editedAccreditation.logo || ""}
            onChange={(e) => handleChange("logo", e.target.value)}
            className="w-full p-1 border"
          />
        </label>
      </div>

      {/* Accreditation Status Section */}
      {editedAccreditation.accreditation_status && (
        <div className="mb-4 border p-2">
          <h2 className="font-bold mb-2">Accreditation Status</h2>
          <label className="block mb-2">
            <strong>Accreditation Type:</strong>
            <input
              type="text"
              value={
                editedAccreditation.accreditation_status.accreditation_type ||
                ""
              }
              onChange={(e) =>
                handleNestedChange(
                  "accreditation_status",
                  "accreditation_type",
                  e.target.value
                )
              }
              className="w-full p-1 border"
            />
          </label>
          <label className="block mb-2">
            <strong>Overall Status:</strong>
            <input
              type="text"
              value={
                editedAccreditation.accreditation_status.over_all_status || ""
              }
              onChange={(e) =>
                handleNestedChange(
                  "accreditation_status",
                  "over_all_status",
                  e.target.value
                )
              }
              className="w-full p-1 border"
            />
          </label>
        </div>
      )}

      {/* Documents Section */}
      {documents && documents.length > 0 && (
        <div className="mb-4">
          {documents.map((doc, index) => (
            <div key={index} className="flex flex-col gap-2 border-b pb-2">
              <div className="flex items-center gap-2">
                <span className="w-1/3 font-medium">{doc.label}:</span>
                <div className="border p-2 w-2/3">
                  <label className="mr-4">
                    <input
                      type="radio"
                      name={`status-${index}`}
                      value="approved"
                      checked={doc.Status === "approved"}
                      onChange={() => handleStatusChange(index, "approved")}
                    />
                    Approved
                  </label>
                  <label>
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
              {/* When a document is marked as "revision", show a textarea for revision notes */}
              {doc.Status === "revision" && (
                <textarea
                  className="border p-2 w-full h-20"
                  placeholder="Enter revision notes..."
                  value={doc.revisionNotes || ""}
                  onChange={(e) =>
                    handleRevisionNoteChange(index, e.target.value)
                  }
                />
              )}
              <div className="flex items-center gap-2">
                <span className="w-1/3 font-medium">File:</span>
                <div className="w-2/3">
                  {doc.file ? (
                    isImageFile(doc.file) ? (
                      <img
                        src={`/${safeOrgName}/Accreditation/photos/${doc.file}`}
                        alt={doc.label}
                        className="max-w-[150px] rounded"
                      />
                    ) : (
                      <a
                        href={`/${safeOrgName}/Accreditation/documents/${doc.file}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline"
                      >
                        View Document
                      </a>
                    )
                  ) : (
                    "No File"
                  )}
                </div>
              </div>
              <hr />
            </div>
          ))}
        </div>
      )}

      {/* Created At Field */}
      <div className="mb-4">
        <label className="block mb-2">
          <strong>Created At:</strong>
          <input
            type="text"
            value={new Date(editedAccreditation.createdAt).toLocaleString()}
            readOnly
            className="w-full p-1 border bg-gray-200"
          />
        </label>
      </div>

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
