import React, { useState } from "react";
import axios from "axios";
import { FileRenderer } from "../../../../components/file_renderer";
import PopUp from "../../../../components/pop-ups";
import { API_ROUTER } from "../../../../App";

export default function EditProposalAdviserSection({ user, proposal, onBack }) {
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({ visible: false, title: "", text: "" });

  const basePath = `/${proposal.organization.org_name}/Proposals/${proposal.title}`;

  const initialStatus = {
    proposal: "pending",
    notice: "pending",
    minutes: "pending",
    resolution: "pending",
    photo: "pending",
  };
  const initialNotes = {
    proposal: "",
    notice: "",
    minutes: "",
    resolution: "",
    photo: "",
  };

  const [docStatus, setDocStatus] = useState(initialStatus);
  const [revisionNotes, setRevisionNotes] = useState(initialNotes);

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
    if (type === "status") setDocStatus((prev) => ({ ...prev, [key]: value }));
    else setRevisionNotes((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const body = {
      proposalId: proposal._id,
      approval_status: isAllApproved()
        ? "Approved by the Adviser"
        : "Revision from the Adviser",
      meeting: {
        ...proposal.meeting,
        ...Object.fromEntries(
          Object.keys(docStatus).flatMap((key) => [
            [`${key}_document_status`, docStatus[key]],
            [`${key}_document_note`, revisionNotes[key]],
          ])
        ),
      },
    };

    try {
      const res = await axios.put(
        `${API_ROUTER}/update-proposals-adviser/${proposal._id}`,
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
        Proposal Title: {proposal.title}
      </h2>
      <p className="text-lg">
        Description: {proposal.description} <br />
        Event Date:{" "}
        {new Date(proposal.event_date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

      {documentsConfig.map(({ key, label, files }) => (
        <section key={key} className="">
          <h3 className="font-semibold">{label}</h3>
          {files.length > 0 && files[0] ? (
            <div className="space-y-2">
              <div className="flex gap-12">
                <div className="flex-1">
                  {files.map((file, i) => (
                    <FileRenderer key={i} basePath={basePath} fileName={file} />
                  ))}
                </div>
                <div className="flex-1">
                  <label className="mr-4">
                    <input
                      type="radio"
                      name={`${key}Status`}
                      value="approved"
                      checked={docStatus[key] === "approved"}
                      onChange={() => handleChange(key, "status", "approved")}
                    />
                    Approved
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={`${key}Status`}
                      value="revision"
                      checked={docStatus[key] === "revision"}
                      onChange={() => handleChange(key, "status", "revision")}
                    />
                    Revision
                  </label>
                </div>
              </div>
              {docStatus[key] === "revision" && (
                <textarea
                  className="w-full mt-2 border p-2"
                  rows={3}
                  placeholder="Reason for revision"
                  value={revisionNotes[key]}
                  onChange={(e) => handleChange(key, "note", e.target.value)}
                />
              )}
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
              : "bg-gray-200 text-black"
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
