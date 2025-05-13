import { useState } from "react";
import axios from "axios";
import { API_ROUTER } from "../../../../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FileRenderer } from "../../../../components/file_renderer";

import { PopUp } from "../../../../components/pop-ups";

export default function EditAccomplishmentSection({
  user,
  accomplishment,
  onBack,
}) {
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({ visible: false, title: "", text: "" });

  const basePath = `/${accomplishment.organization.org_name}/Accomplishments/${accomplishment.event_title}`;

  // Initialize statuses based on available documents
  const initialStatus = {
    narrative: accomplishment.documents?.narrative_report ? "pending" : null,
    attendance: accomplishment.documents?.attendance_sheet ? "pending" : null,
    documentation:
      accomplishment.documents?.photo_documentation?.length > 0
        ? "pending"
        : null,
    certificate:
      accomplishment.documents?.certificate?.length > 0 ? "pending" : null,
  };

  const initialNotes = {
    narrative: "",
    attendance: "",
    documentation: "",
    certificate: "",
  };

  const [docStatus, setDocStatus] = useState(initialStatus);
  const [revisionNotes, setRevisionNotes] = useState(initialNotes);

  // Updated to match the actual document structure
  const documentsConfig = [
    {
      key: "narrative",
      label: "Narrative Report",
      files: accomplishment.documents?.narrative_report
        ? [accomplishment.documents.narrative_report]
        : [],
    },
    {
      key: "attendance",
      label: "Attendance Sheet",
      files: accomplishment.documents?.attendance_sheet
        ? [accomplishment.documents.attendance_sheet]
        : [],
    },
    {
      key: "documentation",
      label: "Photo Documentation",
      files: accomplishment.documents?.photo_documentation || [],
    },
    {
      key: "certificate",
      label: "Certificates",
      files: accomplishment.documents?.certificate || [],
    },
  ];

  const isAllApproved = () => {
    // Only check statuses for documents that exist
    const statuses = Object.entries(docStatus)
      .filter(([key, status]) => status !== null)
      .map(([key, status]) => status);

    // If no documents exist, return false
    if (statuses.length === 0) return false;

    // Check if all existing documents are approved
    return statuses.every((status) => status === "approved");
  };

  const handleChange = (key, type, value) => {
    if (type === "status") setDocStatus((prev) => ({ ...prev, [key]: value }));
    else setRevisionNotes((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Filter out null statuses (for non-existent documents)
    const statusEntries = Object.entries(docStatus)
      .filter(([key, status]) => status !== null)
      .flatMap(([key, status]) => [
        [`${key}_status`, status],
        [`${key}_notes`, revisionNotes[key]],
      ]);

    const body = {
      accomplishmentId: accomplishment._id,
      overall_status: isAllApproved()
        ? "Approved by the Adviser"
        : "Revision from the Adviser",
      ...Object.fromEntries(statusEntries),
    };

    try {
      const res = await axios.put(
        `${API_ROUTER}/update-accomplishment-adviser/${accomplishment._id}`,
        body
      );
      setPopup({
        visible: true,
        title: "Change Submitted",
        text: "Your changes have been submitted successfully.",
      });
    } catch (err) {
      setPopup({
        visible: true,
        title: "Error",
        text: err.response?.data?.message || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6 bg-white p-4">
      {popup.visible && (
        <PopUp
          {...popup}
          onClose={() => setPopup((p) => ({ ...p, visible: false }))}
        />
      )}

      <h2 className="text-2xl font-bold text-center">
        Accomplishment: {accomplishment.event_title}
      </h2>
      <p className="text-lg">
        Activity Type: {accomplishment.activity_type} <br />
        Description: {accomplishment.event_description} <br />
        Event Date:{" "}
        {new Date(accomplishment.event_date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

      {documentsConfig.map(({ key, label, files }) => (
        <section key={key} className="border p-4">
          <h3 className="font-semibold mb-2">{label}</h3>
          {files.length > 0 ? (
            <div>
              <div className="flex flex-col gap-6">
                <div className="flex items-center flex-1 gap-4 border p-2">
                  <div className="flex">
                    <label className="mr-4 flex items-center">
                      <input
                        type="radio"
                        name={`${key}Status`}
                        value="approved"
                        checked={docStatus[key] === "approved"}
                        onChange={() => handleChange(key, "status", "approved")}
                        className="mr-1"
                      />
                      Approved
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name={`${key}Status`}
                        value="revision"
                        checked={docStatus[key] === "revision"}
                        onChange={() => handleChange(key, "status", "revision")}
                        className="mr-1"
                      />
                      Revision
                    </label>
                  </div>
                  <div className="flex-1">
                    {docStatus[key] === "revision" && (
                      <textarea
                        className="w-full border p-2"
                        rows={3}
                        placeholder="Reason for revision"
                        value={revisionNotes[key]}
                        onChange={(e) =>
                          handleChange(key, "note", e.target.value)
                        }
                      />
                    )}
                  </div>
                </div>
                <div className="flex-1 flex overflow-auto">
                  {files.map((file, i) => (
                    <FileRenderer key={i} basePath={basePath} fileName={file} />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="italic text-sm">None</p>
          )}
        </section>
      ))}

      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 rounded ${
            isAllApproved()
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-yellow-500 hover:bg-yellow-600 text-white"
          }`}
        >
          {loading
            ? "Submitting..."
            : isAllApproved()
            ? "Approve"
            : "Send Revision"}
        </button>
      </div>
    </form>
  );
}
