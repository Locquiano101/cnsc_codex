import axios from "axios";
import { FileRenderer } from "../../../../components/file_renderer";
import React, { useState, useEffect } from "react";
import { API_ROUTER } from "../../../../App";
import PopUp from "../../../../components/pop-ups";

export default function EditProposalAdviserSection({ user, proposal, onBack }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // NEW: popup state
  const [popup, setPopup] = useState({
    visible: false,
    title: "",
    text: "",
  });
  const isAllApproved = () => {
    return Object.values(docStatus).every((status) => status === "approved");
  };
  console.log(user);
  console.log(proposal);

  const basePath = `/${proposal.organization.org_name}/Proposals/${proposal.title}/`;

  const {
    proposal_document,
    notice_document,
    minutes_document,
    resolution_document = [],
    photo_documentations = [],
  } = proposal.meeting;

  const [docStatus, setDocStatus] = useState({
    proposal: "pending",
    notice: "pending",
    minutes: "pending",
    resolution: "pending",
    photo: "pending",
  });

  const [revisionNotes, setRevisionNotes] = useState({
    proposal: "",
    notice: "",
    minutes: "",
    resolution: "",
    photo: "",
  });

  const handleStatusChange = (key, status) => {
    setDocStatus((prev) => ({ ...prev, [key]: status }));
    setIsEditing(true);
  };

  const handleNoteChange = (key, value) => {
    setRevisionNotes((prev) => ({ ...prev, [key]: value }));
    setIsEditing(true);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const result = {
      proposalId: proposal._id,

      approval_status: isAllApproved()
        ? "Approved by the Adviser"
        : "Revision from the Adviser",

      meeting: {
        proposal_document: proposal.meeting.proposal_document,
        proposal_document_status: docStatus.proposal,
        proposal_document_note: revisionNotes.proposal,
        notice_document: proposal.meeting.notice_document,
        notice_document_status: docStatus.notice,
        notice_document_note: revisionNotes.notice,
        minutes_document: proposal.meeting.minutes_document,
        minutes_document_status: docStatus.minutes,
        minutes_document_note: revisionNotes.minutes,
        resolution_document: proposal.meeting.resolution_document,
        photo_documentations: proposal.meeting.photo_documentations,
      },
    };

    console.log("Done editing:", result);

    // OPTIONAL: send to API if needed
    axios
      .put(`${API_ROUTER}/update-proposals-adviser/${proposal._id}`, result)
      .then((res) => {
        setPopup({
          visible: true,
          title: "Change Submitted",
          text: "Your changes have been submitted successfully.",
        });

        console.log("Submitted:", res.data);
      })
      .catch((err) => {
        setPopup({
          visible: true,
          title: "Error",
          text: err.response?.data?.message || "Something went wrong.",
        });
        console.error("Submit error:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <form onSubmit={onSubmit}>
      {/* 1) PopUp */}
      {popup.visible && (
        <PopUp
          title={popup.title}
          text={popup.text}
          onClose={() => setPopup({ ...popup, visible: false })}
        />
      )}
      <div className="  space-y-4 overflow-autoflex-col items-center px-20 pt-10 bg-white rounded-2xl ">
        <div className="flex flex-wrap gap-4">
          <h2 className="text-2xl font-bold">
            Proposal Title: {proposal.title}
          </h2>
          <h2 className="text-lg ">
            Proposal description: {proposal.description}
          </h2>
        </div>

        {/* Proposal Document */}
        <section>
          {proposal_document ? (
            <div className="flex flex-col">
              <div className="flex items-center justify-start gap-12 w-full">
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Proposal Document:</h3>
                  <FileRenderer
                    basePath={basePath}
                    fileName={proposal_document}
                  />
                </div>
                <div className="flex-1">
                  <label className="mr-4">
                    <input
                      type="radio"
                      name="proposalStatus"
                      value="approved"
                      checked={docStatus.proposal === "approved"}
                      onChange={() =>
                        handleStatusChange("proposal", "approved")
                      }
                    />
                    Approved
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="proposalStatus"
                      value="revision"
                      checked={docStatus.proposal === "revision"}
                      onChange={() =>
                        handleStatusChange("proposal", "revision")
                      }
                    />
                    Revision
                  </label>
                </div>
              </div>
              {docStatus.proposal === "revision" && (
                <textarea
                  className="w-full mt-2 border p-2"
                  rows={3}
                  placeholder="Reason for revision"
                  value={revisionNotes.proposal}
                  onChange={(e) => handleNoteChange("proposal", e.target.value)}
                />
              )}
            </div>
          ) : (
            <p className="italic text-sm">None</p>
          )}
        </section>

        <hr />

        {/* Notice Document */}
        <section>
          {notice_document ? (
            <div className="flex flex-col">
              <div className="flex items-center justify-start gap-12 w-full">
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Notice Document:</h3>
                  <FileRenderer
                    basePath={basePath}
                    fileName={notice_document}
                  />
                </div>
                <div className="flex-1">
                  <label className="mr-4">
                    <input
                      type="radio"
                      name="noticeStatus"
                      value="approved"
                      checked={docStatus.notice === "approved"}
                      onChange={() => handleStatusChange("notice", "approved")}
                    />
                    Approved
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="noticeStatus"
                      value="revision"
                      checked={docStatus.notice === "revision"}
                      onChange={() => handleStatusChange("notice", "revision")}
                    />
                    Revision
                  </label>
                </div>
              </div>
              {docStatus.notice === "revision" && (
                <textarea
                  className="w-full mt-2 border p-2"
                  rows={3}
                  placeholder="Reason for revision"
                  value={revisionNotes.notice}
                  onChange={(e) => handleNoteChange("notice", e.target.value)}
                />
              )}
            </div>
          ) : (
            <p className="italic text-sm">None</p>
          )}
        </section>

        <hr />

        {/* Minutes Document */}
        <section>
          {minutes_document ? (
            <div className="flex flex-col">
              <div className="flex items-center justify-start gap-12 w-full">
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Minutes Document:</h3>
                  <FileRenderer
                    basePath={basePath}
                    fileName={minutes_document}
                  />
                </div>
                <div className="flex-1">
                  <label className="mr-4">
                    <input
                      type="radio"
                      name="minutesStatus"
                      value="approved"
                      checked={docStatus.minutes === "approved"}
                      onChange={() => handleStatusChange("minutes", "approved")}
                    />
                    Approved
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="minutesStatus"
                      value="revision"
                      checked={docStatus.minutes === "revision"}
                      onChange={() => handleStatusChange("minutes", "revision")}
                    />
                    Revision
                  </label>
                </div>
              </div>
              {docStatus.minutes === "revision" && (
                <textarea
                  className="w-full mt-2 border p-2"
                  rows={3}
                  placeholder="Reason for revision"
                  value={revisionNotes.minutes}
                  onChange={(e) => handleNoteChange("minutes", e.target.value)}
                />
              )}
            </div>
          ) : (
            <p className="italic text-sm">None</p>
          )}
        </section>

        <hr />

        {/* Resolution Documents */}
        <section>
          {resolution_document.length > 0 ? (
            <div className="flex flex-col">
              <div className="flex items-center justify-start gap-12 w-full">
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Resolution Documents:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {resolution_document.map((file, i) => (
                      <li key={i}>
                        <FileRenderer basePath={basePath} fileName={file} />
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex-1">
                  <label className="mr-4">
                    <input
                      type="radio"
                      name="resolutionStatus"
                      value="approved"
                      checked={docStatus.resolution === "approved"}
                      onChange={() =>
                        handleStatusChange("resolution", "approved")
                      }
                    />
                    Approved
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="resolutionStatus"
                      value="revision"
                      checked={docStatus.resolution === "revision"}
                      onChange={() =>
                        handleStatusChange("resolution", "revision")
                      }
                    />
                    Revision
                  </label>
                </div>
              </div>
              {docStatus.resolution === "revision" && (
                <textarea
                  className="w-full mt-2 border p-2"
                  rows={3}
                  placeholder="Reason for revision"
                  value={revisionNotes.resolution}
                  onChange={(e) =>
                    handleNoteChange("resolution", e.target.value)
                  }
                />
              )}
            </div>
          ) : (
            <p className="italic text-sm">None</p>
          )}
        </section>
        <hr />
        {/* Photo Documentations - default layout */}
        <section>
          <div className="flex justify-between gap-12  items-center">
            <div className="flex-1">
              <h3 className="font-semibold">Meeting's Photo Documentations</h3>
            </div>
            <div className="flex-1">
              <label className="mr-4">
                <input
                  type="radio"
                  name="photoStatus"
                  value="approved"
                  checked={docStatus.photo === "approved"}
                  onChange={() => handleStatusChange("photo", "approved")}
                />
                Approved
              </label>
              <label>
                <input
                  type="radio"
                  name="photoStatus"
                  value="revision"
                  checked={docStatus.photo === "revision"}
                  onChange={() => handleStatusChange("photo", "revision")}
                />
                Revision
              </label>
            </div>
          </div>
          {docStatus.photo === "revision" && (
            <textarea
              className="w-full mt-2 border p-2"
              rows={3}
              placeholder="Reason for revision"
              value={revisionNotes.photo}
              onChange={(e) => handleNoteChange("photo", e.target.value)}
            />
          )}
          {photo_documentations.length > 0 ? (
            <div className="flex overflow-x-auto space-x-4 p-2">
              {photo_documentations.map((file, i) => (
                <FileRenderer key={i} basePath={basePath} fileName={file} />
              ))}
            </div>
          ) : (
            <p className="italic text-sm">None</p>
          )}
        </section>
        {/* Done Editing Button */}
        <div className="flex items-center  justify-end gap-4 mt-4">
          <button
            type="button"
            onClick={onBack}
            disabled={loading}
            className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 transition disabled:opacity-50"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 rounded transition disabled:opacity-50 ${
              isAllApproved()
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            {loading ? (
              <span className="flex items-center">
                <span className="border-4 border-blue-500 border-t-transparent rounded-full w-5 h-5 animate-spin mr-2" />
                Submitting...
              </span>
            ) : isAllApproved() ? (
              "Approve"
            ) : (
              "Send Revision"
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
