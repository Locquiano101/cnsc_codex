import React, { useEffect, useState } from "react";
import { API_ROUTER } from "../../../../App";
import axios from "axios";
import {
  ReusableFileUpload,
  ReusableMultiFileUpload,
} from "../../../../components/reusable_file_upload";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FileRenderer } from "../../../../components/file_renderer";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { PopUp } from "../../../../components/pop-ups";

const fileFields = {
  proposal_document: { label: "Proposal", accept: ".pdf,.doc,.docx" },
  notice_document: { label: "Notice of Meeting", accept: ".pdf,.doc,.docx" },
  minutes_document: { label: "Meeting Minutes", accept: ".pdf,.doc,.docx" },
  photo_documentations: {
    label: "Photo Documentations",
    accept: "image/*",
    multiple: true,
  },
  resolution_document: {
    label: "Resolution Document",
    accept: ".pdf,.doc,.docx",
    multiple: true,
  },
};

export default function EditProposalStudentSection(selectedProposal) {
  // Basic info state
  const [basicInfo, setBasicInfo] = useState({
    title: selectedProposal.selectedProposal.title,
    description: selectedProposal.selectedProposal.description,
    event_date: selectedProposal.selectedProposal.event_date.slice(0, 10), // YYYY-MM-DD
  });
  const [showPopup, setShowPopup] = useState(false);

  // File-editing state
  const [editing, setEditing] = useState({
    proposal_document: false,
    notice_document: false,
    minutes_document: false,
    photo_documentations: false,
    resolution_document: false,
  });
  const [basicEdit, setBasicEdit] = useState({
    title: false,
    event_date: false,
    description: false,
  });
  const [newFiles, setNewFiles] = useState({});

  const logChange = (message) => {
    console.log(`[EditProposal] ${message}`);
  };

  const handleCancel = () => {
    setBasicInfo({
      title: selectedProposal.selectedProposal.title,
      description: selectedProposal.selectedProposal.description,
      event_date: selectedProposal.selectedProposal.event_date.slice(0, 10),
    });

    setEditing({
      proposal_document: false,
      notice_document: false,
      minutes_document: false,
      photo_documentations: false,
      resolution_document: false,
    });

    setBasicEdit({
      title: false,
      event_date: false,
      description: false,
    });

    setNewFiles({});
    window.location.reload();
    logChange("Cancelled editing and reverted to original data.");
  };

  const toggleEdit = (key) => {
    const now = !editing[key];
    setEditing((e) => ({ ...e, [key]: now }));
    logChange(`${now ? "Entered" : "Exited"} edit mode for "${key}".`);
  };

  const handleFileChange = (key, files) => {
    // if the browser gives you a FileList, turn it into a real Array
    const arr = files instanceof FileList ? Array.from(files) : files;
    setNewFiles((nf) => ({ ...nf, [key]: arr }));

    if (!arr || (Array.isArray(arr) && arr.length === 0)) {
      logChange(`Cleared selection for "${key}".`);
    } else {
      const cnt = Array.isArray(arr) ? arr.length : 1;
      logChange(`Selected ${cnt} file(s) for "${key}".`);
    }
  };

  const handleUpdate = async () => {
    const updatedMeeting = Object.entries(
      selectedProposal.selectedProposal.meeting
    ).reduce((acc, [key, orig]) => {
      acc[key] =
        newFiles[key] && newFiles[key].length > 0 ? newFiles[key] : orig;
      return acc;
    }, {});

    const updatedProposal = {
      ...selectedProposal.selectedProposal,
      title: basicInfo.title,
      description: basicInfo.description,
      event_date: new Date(basicInfo.event_date).toISOString(),
      meeting: updatedMeeting,
    };

    const imageExts = ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"];

    const formData = new FormData();
    formData.append("title", updatedProposal.title);
    formData.append("description", updatedProposal.description);
    formData.append("event_date", updatedProposal.event_date);
    formData.append("organization_id", updatedProposal.organization._id);
    formData.append("orgFolder", updatedProposal.organization.org_name);
    formData.append("orgDocumentClassification", "Proposals");
    formData.append("orgDocumentTitle", updatedProposal.title);

    // Track which fields were updated
    const updatedFields = [];

    // Handle files properly
    Object.entries(newFiles).forEach(([fieldName, fileOrArr]) => {
      // Skip if there's no file to update
      if (!fileOrArr || (Array.isArray(fileOrArr) && fileOrArr.length === 0)) {
        return;
      }

      // Add this field to updated fields list
      updatedFields.push(fieldName);

      const files = Array.isArray(fileOrArr) ? fileOrArr : [fileOrArr];

      files.forEach((file) => {
        if (!(file instanceof File)) return;

        const ext = file.name.split(".").pop().toLowerCase();
        const isImage = imageExts.includes(ext);

        // Add file to the appropriate collection (photo or document)
        formData.append(isImage ? "photo" : "document", file);

        // Add the original filename so we can match it on the server
        formData.append(`${fieldName}_filename`, file.name);
      });
    });

    // Add each updated field to the formData
    updatedFields.forEach((field) => {
      formData.append("updated_fields", field);
    });

    // Log what we're sending for debugging
    console.log("Updated fields:", updatedFields);
    for (let [key, val] of formData.entries()) {
      console.log("→", key, val);
    }

    try {
      const res = await axios.post(
        `${API_ROUTER}/update-proposal-student/${updatedProposal._id}`,
        formData
      );
      console.log("✅ Update success:", res.data);
      setShowPopup(true);
    } catch (err) {
      console.error("❌ Update failed:", err);
      console.error("Error details:", err.response?.data || err.message);
    }
  };

  const basePath = `/${selectedProposal.selectedProposal.organization.org_name}/Proposals/${basicInfo.title}`;

  const isAnythingEditing =
    Object.values(editing).includes(true) ||
    Object.values(basicEdit).includes(true);

  const toggleBasicEdit = (field) => {
    setBasicEdit((prev) => ({ ...prev, [field]: !prev[field] }));

    // Optional: revert value when cancelled
    if (basicEdit[field]) {
      setBasicInfo((b) => ({
        ...b,
        [field]: selectedProposal.selectedProposal[field],
      }));
    }
  };
  const handleClosePopup = () => {
    setShowPopup(false);
    window.location.reload(); // or navigate somewhere
  };
  const renderSection = (key, multiple = false) => {
    const statusKey = `${key}_status`;
    const noteKey = `${key}_note`;

    const status =
      selectedProposal.selectedProposal.meeting[statusKey] || "Pending";
    const note =
      selectedProposal.selectedProposal.meeting[noteKey] || "Up for checking";

    return (
      <div key={key} className="">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <h3 className="font-medium">
              {fileFields[key].label}{" "}
              <span className="text-sm text-gray-500">({status})</span>
            </h3>
            <span className="text-xs text-gray-600 italic">Note: {note}</span>
          </div>
          <button
            className="text-sm text-blue-600 hover:underline flex items-center"
            onClick={() => toggleEdit(key)}
          >
            <FontAwesomeIcon icon={faEdit} className="mr-1" />
            {editing[key] ? "Cancel" : "Edit"}
          </button>
        </div>

        {!editing[key] ? (
          multiple ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {selectedProposal.selectedProposal.meeting[key]?.map((f, i) => (
                <FileRenderer key={i} basePath={basePath} fileName={f} />
              ))}
            </div>
          ) : (
            <FileRenderer
              basePath={basePath}
              fileName={selectedProposal.selectedProposal.meeting[key]}
            />
          )
        ) : multiple ? (
          <ReusableMultiFileUpload
            fields={{ [key]: fileFields[key] }}
            onFileChange={handleFileChange}
          />
        ) : (
          <ReusableFileUpload
            fields={{ [key]: fileFields[key] }}
            onFileChange={handleFileChange}
          />
        )}
      </div>
    );
  };

  return (
    <div className="border bg-white h-11/12 p-6 space-y-6 overflow-y-auto">
      {showPopup && (
        <PopUp
          title="Success!"
          text="Your Proposal has been revised"
          ButtonText="Confirm"
          onClose={handleClosePopup}
        />
      )}
      <h1 className="text-2xl font-bold mb-6">Edit Proposal</h1>
      {/* Basic Information (now editable) */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Basic Information</h2>
        <div className="flex flex-wrap gap-8 ">
          {/* Title */}
          <div className="flex-1 rounded shadow-gray-500 shadow p-4">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium">Title</label>
              <button
                className="text-sm text-blue-600 hover:underline"
                onClick={() => toggleBasicEdit("title")}
              >
                {basicEdit.title ? "Cancel" : "Edit"}
              </button>
            </div>
            {basicEdit.title ? (
              <input
                type="text"
                value={basicInfo.title}
                onChange={(e) =>
                  setBasicInfo((b) => ({ ...b, title: e.target.value }))
                }
                className="w-full border rounded px-2 py-1"
              />
            ) : (
              <p className="text-gray-800">{basicInfo.title}</p>
            )}
          </div>

          {/* Event Date */}
          <div className="flex-1 rounded shadow-gray-500 shadow  p-4">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium">Event Date</label>
              <button
                className="text-sm text-blue-600 hover:underline"
                onClick={() => toggleBasicEdit("event_date")}
              >
                {basicEdit.event_date ? "Cancel" : "Edit"}
              </button>
            </div>
            {basicEdit.event_date ? (
              <input
                type="date"
                value={basicInfo.event_date}
                onChange={(e) =>
                  setBasicInfo((b) => ({ ...b, event_date: e.target.value }))
                }
                className="w-full border rounded px-2 py-1"
              />
            ) : (
              <p className="text-gray-800">{basicInfo.event_date}</p>
            )}
          </div>

          {/* Description */}
          <div className="flex-1 rounded shadow-gray-500 shadow p-4">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium">Description</label>
              <button
                className="text-sm text-blue-600 hover:underline"
                onClick={() => toggleBasicEdit("description")}
              >
                {basicEdit.description ? "Cancel" : "Edit"}
              </button>
            </div>
            {basicEdit.description ? (
              <textarea
                rows={3}
                value={basicInfo.description}
                onChange={(e) =>
                  setBasicInfo((b) => ({ ...b, description: e.target.value }))
                }
                className="w-full border rounded px-2 py-1"
              />
            ) : (
              <p className="text-gray-800 whitespace-pre-line">
                {basicInfo.description}
              </p>
            )}
          </div>
        </div>
      </div>
      {/* Meeting Documents */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Meeting Documents</h2>
        <div className="space-y-6">
          {renderSection("proposal_document")}
          {renderSection("notice_document")}
          {renderSection("minutes_document")}
          {renderSection("photo_documentations", true)}
          {renderSection("resolution_document", true)}
        </div>
      </div>

      {/* Update button */}
      <div className=" w-full h-10 flex justify-end gap-2">
        {
          <div className=" h-10 flex justify-end w-fit">
            <button
              onClick={handleCancel}
              className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow transition-all"
            >
              CANCEL
            </button>
          </div>
        }
        {isAnythingEditing && (
          <div className=" h-10 flex justify-end w-fit">
            <button
              onClick={handleUpdate}
              className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow transition-all"
            >
              UPDATE
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
