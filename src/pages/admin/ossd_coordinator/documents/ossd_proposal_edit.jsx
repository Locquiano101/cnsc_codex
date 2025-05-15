import React, { useState, useEffect } from "react";
import axios from "axios";
import { FileRenderer } from "../../../../components/file_renderer";
import { PopUp } from "../../../../components/pop-ups";
import { API_ROUTER } from "../../../../App";

export default function EditProposalOSSDSection({ user, proposal, onBack }) {
  console.log("Proposal data:", proposal);
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({ visible: false, title: "", text: "" });

  const basePath = `/${proposal.organization.org_name}/Proposals/${proposal.title}`;

  // Initialize with values from API if they exist
  const initialStatus = {
    proposal: proposal.meeting.proposal_document_status || "pending",
    notice: proposal.meeting.notice_document_status || "pending",
    minutes: proposal.meeting.minutes_document_status || "pending",
    resolution: proposal.meeting.resolution_document_status || "pending",
    photo: proposal.meeting.photo_documentations_status || "pending",
  };

  const initialNotes = {
    proposal: proposal.meeting.proposal_document_note || "",
    notice: proposal.meeting.notice_document_note || "",
    minutes: proposal.meeting.minutes_document_note || "",
    resolution: proposal.meeting.resolution_document_note || "",
    photo: proposal.meeting.photo_documentations_note || "",
  };

  const [docStatus, setDocStatus] = useState(initialStatus);
  const [revisionNotes, setRevisionNotes] = useState(initialNotes);

  // Debug logging to see what's being initialized
  useEffect(() => {
    console.log("Initial Status:", initialStatus);
    console.log("Initial Notes:", initialNotes);
  }, []);

  const documentsConfig = [
    {
      key: "proposal",
      label: "Proposal Document",
      files: [proposal.meeting.proposal_document],
    },
    {
      key: "notice",
      label: "Notice Document",
      files: [proposal.meeting.notice_document],
    },
    {
      key: "minutes",
      label: "Minutes Document",
      files: [proposal.meeting.minutes_document],
    },
    {
      key: "resolution",
      label: "Resolution Documents",
      files: proposal.meeting.resolution_document || [],
    },
    {
      key: "photo",
      label: "Meeting's Photo Documentations",
      files: proposal.meeting.photo_documentations || [],
    },
  ];

  const isAllApproved = () =>
    Object.values(docStatus).every((status) => status === "approved");

  const handleChange = (key, type, value) => {
    if (type === "status") {
      setDocStatus((prev) => ({ ...prev, [key]: value }));
      // Clear revision notes if status changed to approved
      if (value === "approved") {
        setRevisionNotes((prev) => ({ ...prev, [key]: "" }));
      }
    } else {
      setRevisionNotes((prev) => ({ ...prev, [key]: value }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Create payload with appropriate field names
    const body = {
      proposalId: proposal._id,
      approval_status: isAllApproved()
        ? "Approved by the OSSD Coordinator"
        : "Revision from the OSSD Coordinator",
      meeting: {
        ...proposal.meeting,
        proposal_document_status: docStatus.proposal,
        notice_document_status: docStatus.notice,
        minutes_document_status: docStatus.minutes,
        resolution_document_status: docStatus.resolution,
        photo_documentations_status: docStatus.photo,
        proposal_document_note: revisionNotes.proposal,
        notice_document_note: revisionNotes.notice,
        minutes_document_note: revisionNotes.minutes,
        resolution_document_note: revisionNotes.resolution,
        photo_documentations_note: revisionNotes.photo,
      },
    };

    console.log("Submitting body:", body);

    try {
      const res = await axios.put(
        `${API_ROUTER}/update-proposals-adviser/${proposal._id}`,
        body
      );
      setPopup({
        visible: true,
        title: "Change Submitted",
        text: "Your changes have been submitted successfully.",
        ButtonText: "Confirm",
      });
    } catch (err) {
      setPopup({
        visible: true,
        title: "Error",
        text: err.response?.data?.message || "Something went wrong.",
        ButtonText: "Confirm",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      {popup.visible && (
        <PopUp
          {...popup}
          onClose={() => setPopup((p) => ({ ...p, visible: false }))}
        />
      )}
      <h2 className="text-2xl font-bold text-center">
        Proposal Title: {proposal.title}
      </h2>

      <p className="text-lg mb-4">
        Organization: {proposal.organization.org_name} <br />
        Description: {proposal.description} <br />
        Event Date:{" "}
        {new Date(proposal.event_date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

      {documentsConfig.map(({ key, label, files }) => (
        <section key={key} className="mb-4 flex flex-col">
          {files.length > 0 && files[0] ? (
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold">{label}</h3>
              <div className="flex bg-gray-200 items-start shadow-lg p-2 rounded-lg flex-1 gap-4">
                <div className="flex-1">
                  <div className="flex">
                    <label className="mr-4">
                      <input
                        type="radio"
                        name={`${key}Status`}
                        value="approved"
                        checked={docStatus[key] === "approved"}
                        onChange={() => handleChange(key, "status", "approved")}
                        className="mr-2"
                      />
                      Approved
                    </label>
                    <label>
                      <input
                        type="radio"
                        name={`${key}Status`}
                        value="revision"
                        checked={docStatus[key] === "revision"}
                        className="mr-2"
                        onChange={() => handleChange(key, "status", "revision")}
                      />
                      Revision
                    </label>
                  </div>
                  <div className="flex-1">
                    {/* Always show textarea if there are notes or status is revision */}
                    {(docStatus[key] === "revision" || revisionNotes[key]) && (
                      <div className="mt-2">
                        <textarea
                          className="w-full rounded bg-gray-50 p-4"
                          rows={3}
                          placeholder="Reason for revision"
                          value={revisionNotes[key]}
                          onChange={(e) =>
                            handleChange(key, "note", e.target.value)
                          }
                        />
                        {docStatus[key] !== "revision" &&
                          revisionNotes[key] && (
                            <p className="text-amber-600 text-sm mt-1">
                              Previous revision note displayed. Status is now
                              approved.
                            </p>
                          )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1/2 flex shrink-0 overflow-auto">
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
              : "bg-red-400 text-white"
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
