import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faPen,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { API_ROUTER } from "../../../../../App";
import { FileRenderer } from "../../../../../components/file_renderer";

export default function SduProposalApprovalEdit({ user, proposal, onClose }) {
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
        ? "Approved by the SDU"
        : "Revision from the SDU",
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
      // Close the popup after successful submission
      setTimeout(() => {
        onClose();
      }, 2000);
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

  // Simple popup component for notifications
  function PopUp({ visible, title, text, onClose }) {
    if (!visible) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
        <div className="bg-white rounded-lg p-6 max-w-sm mx-auto shadow-lg">
          <h3 className="font-bold text-lg mb-2">{title}</h3>
          <p>{text}</p>
          <div className="mt-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
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
        <section key={key} className="border p-4 rounded">
          <h3 className="font-semibold mb-2">{label}</h3>
          {files.length > 0 && files[0] ? (
            <div>
              <div className="flex flex-col gap-4">
                <div className="flex border items-center gap-4 p-2">
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name={`${key}Status`}
                        value="approved"
                        checked={docStatus[key] === "approved"}
                        onChange={() => handleChange(key, "status", "approved")}
                        className="form-radio"
                      />
                      <span>Approved</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name={`${key}Status`}
                        value="revision"
                        checked={docStatus[key] === "revision"}
                        onChange={() => handleChange(key, "status", "revision")}
                        className="form-radio"
                      />
                      <span>Revision</span>
                    </label>
                  </div>
                  <div className="flex-1">
                    {docStatus[key] === "revision" && (
                      <textarea
                        className="w-full border p-2 rounded"
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
                <div className="flex-1 flex flex-wrap overflow-auto bg-gray-50 p-2 rounded">
                  {files.map((file, i) => (
                    <div
                      key={i}
                      className="text-sm p-2 border m-1 rounded bg-white"
                    >
                      <FileRenderer
                        key={i}
                        basePath={basePath}
                        fileName={file}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="italic text-sm text-gray-500">None</p>
          )}
        </section>
      ))}

      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Cancel
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
