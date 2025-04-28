import { useState, useEffect } from "react";
import axios from "axios";
import EditSectionBase from "../../../../components/edit_form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FileRenderer } from "../../../../components/file_renderer";
import LongDateFormat from "../../../../api/formatter";

import {
  ReusableFileUpload,
  ReusableMultiFileUpload,
} from "../../../../components/reusable_file_upload";

function EditInstitutionalAccomplishment({ selectedAccomplishment }) {
  const [basicInfo, setBasicInfo] = useState({
    event_title: selectedAccomplishment.event_title,
    event_description: selectedAccomplishment.event_description,
    event_date: selectedAccomplishment.event_date.split("T")[0], // Format date for input
    organization: selectedAccomplishment.organization._id,
    organization_name: selectedAccomplishment.organization.org_name,
  });
  const basePath = `/${basicInfo.organization_name}/InstitutionalAccomplishment/${basicInfo.event_title}`;
  const [editing, setEditing] = useState({
    narrative_report: false,
    attendance_sheet: false,
    certificate: false,
    photo_documentations: false,
  });

  const [basicEdit, setBasicEdit] = useState({
    event_title: false,
    event_description: false,
    event_date: false,
  });

  const [uploadedFiles, setUploadedFiles] = useState({});

  const fileFields = {
    narrative_report: { label: "Narrative Report", accept: ".pdf,.doc,.docx" },
    attendance_sheet: { label: "Attendance Sheet", accept: ".pdf,.doc,.docx" },
    certificate: {
      label: "Certificate",
      accept: ".pdf,.doc,.docx",
      multiple: true,
    },
    photo_documentations: {
      label: "Photo Documentation",
      accept: "image/*",
      multiple: true,
    },
  };

  const logChange = (message) => {
    console.log(`[EditInstitutional] ${message}`);
  };

  const toggleEdit = (key) => {
    const now = !editing[key];
    setEditing((e) => ({ ...e, [key]: now }));
    logChange(`${now ? "Entered" : "Exited"} edit mode for "${key}".`);
  };

  const toggleBasicEdit = (field) => {
    setBasicEdit((prev) => ({ ...prev, [field]: !prev[field] }));
    if (basicEdit[field]) {
      // Reset to original value if cancelling edit
      setBasicInfo((prev) => ({
        ...prev,
        [field]:
          selectedAccomplishment[field] ||
          (field === "event_date"
            ? selectedAccomplishment[field].split("T")[0]
            : ""),
      }));
    }
  };

  const handleFileChange = (key, files) => {
    const arr = files instanceof FileList ? Array.from(files) : files;
    setUploadedFiles((prev) => ({ ...prev, [key]: arr }));

    if (!arr || arr.length === 0) {
      logChange(`Cleared selection for "${key}".`);
    } else {
      logChange(`Selected ${arr.length} file(s) for "${key}".`);
    }
  };

  const handleUpdate = async () => {
    const formData = new FormData();

    // Append text fields
    formData.append("event_title", basicInfo.event_title);
    formData.append("event_description", basicInfo.event_description);
    formData.append("event_date", basicInfo.event_date);
    formData.append("organization", basicInfo.organization);
    formData.append("activity_type", "Institutional");

    // Metadata
    formData.append("orgFolder", basicInfo.organization_name);
    formData.append("orgDocumentClassification", "InstitutionalAccomplishment");
    formData.append("orgDocumentTitle", basicInfo.event_title);

    // Append files
    Object.entries(uploadedFiles).forEach(([key, files]) => {
      const arr = Array.isArray(files) ? files : [files];
      arr.forEach((file) => {
        if (!file) return;
        const isImage = file.type.startsWith("image/");
        formData.append(isImage ? "photo" : "document", file);
      });
    });

    // File names
    Object.entries(uploadedFiles).forEach(([key, files]) => {
      const arr = Array.isArray(files) ? files : [files];
      arr.forEach((file) => {
        if (!file) return;
        formData.append(key, file.name);
      });
    });

    // Debug
    for (let [key, val] of formData.entries()) {
      console.log(key, val);
    }

    // try {
    //   const { data } = await axios.post(
    //     `${API_ROUTER}/submit-instutional-accomplishment`,
    //     formData,
    //     { headers: { "Content-Type": "multipart/form-data" } }
    //   );
    //   console.log("✅ Submission successful:", data);
    //   alert("Institutional Accomplishment submitted successfully!");
    // } catch (err) {
    //   console.error("❌ Submission failed:", err);
    // }
  };

  const isAnythingEditing =
    Object.values(editing).includes(true) ||
    Object.values(basicEdit).includes(true);

  const renderSection = (key, multiple = false) => {
    const statusKey = `${key}_status`;
    const noteKey = `${key}_note`;

    const status = selectedAccomplishment.documents?.[statusKey] || "Pending";
    const note =
      selectedAccomplishment.documents?.[noteKey] || "Up for checking";

    // Fixed: Adjusted key name for photo_documentations to match backend data structure
    const documentKey =
      key === "photo_documentations" ? "photo_documentation" : key;

    return (
      <div key={key} className="space-y-2">
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
              {/* Fixed: Use the corrected key name and ensure array handling */}
              {(Array.isArray(selectedAccomplishment.documents?.[documentKey])
                ? selectedAccomplishment.documents?.[documentKey]
                : selectedAccomplishment.documents?.[documentKey]
                ? [selectedAccomplishment.documents?.[documentKey]]
                : []
              ).map((f, i) => (
                <FileRenderer key={i} basePath={basePath} fileName={f} />
              ))}
            </div>
          ) : (
            <FileRenderer
              basePath={basePath}
              fileName={selectedAccomplishment.documents?.[documentKey]}
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
    <div className="border h-full p-6 space-y-6 overflow-y-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Edit Institutional Accomplishment
      </h1>

      {/* Basic Information */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Basic Information</h2>

        {/* Event Title */}
        <div>
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Event Title</label>
            <button
              className="text-sm text-blue-600 hover:underline"
              onClick={() => toggleBasicEdit("event_title")}
            >
              {basicEdit.event_title ? "Cancel" : "Edit"}
            </button>
          </div>
          {basicEdit.event_title ? (
            <input
              type="text"
              value={basicInfo.event_title}
              onChange={(e) =>
                setBasicInfo((prev) => ({
                  ...prev,
                  event_title: e.target.value,
                }))
              }
              className="w-full border rounded px-2 py-1"
            />
          ) : (
            <p className="text-gray-800">
              {selectedAccomplishment.event_title}
            </p>
          )}
        </div>

        {/* Event Date */}
        <div>
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Event Date</label>
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
                setBasicInfo((prev) => ({
                  ...prev,
                  event_date: e.target.value,
                }))
              }
              className="w-full border rounded px-2 py-1"
            />
          ) : (
            <p className="text-gray-800">
              {LongDateFormat(selectedAccomplishment.event_date)}
            </p>
          )}
        </div>

        {/* Event Description */}
        <div>
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Event Description</label>
            <button
              className="text-sm text-blue-600 hover:underline"
              onClick={() => toggleBasicEdit("event_description")}
            >
              {basicEdit.event_description ? "Cancel" : "Edit"}
            </button>
          </div>
          {basicEdit.event_description ? (
            <textarea
              rows={3}
              value={basicInfo.event_description}
              onChange={(e) =>
                setBasicInfo((prev) => ({
                  ...prev,
                  event_description: e.target.value,
                }))
              }
              className="w-full border rounded px-2 py-1"
            />
          ) : (
            <p className="text-gray-800 whitespace-pre-line">
              {selectedAccomplishment.event_description}
            </p>
          )}
        </div>
      </div>

      {/* Files Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Uploaded Files</h2>
        <div className="space-y-6">
          {renderSection("narrative_report")}
          {renderSection("attendance_sheet")}
          {renderSection("certificate", true)}
          {renderSection("photo_documentations", true)}
        </div>
      </div>

      {/* Buttons */}
      <div className="w-full h-10 flex justify-end gap-2">
        <div className="h-10 flex justify-end w-fit">
          <button className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow transition-all">
            CANCEL
          </button>
        </div>
        {isAnythingEditing && (
          <div className="h-10 flex justify-end w-fit">
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

function EditExternalAccomplishment({ selectedAccomplishment }) {
  const [basicInfo, setBasicInfo] = useState({
    event_title: selectedAccomplishment.event_title,
    event_description: selectedAccomplishment.event_description,
    event_date: selectedAccomplishment.event_date.split("T")[0], // Format date for input
    organization: selectedAccomplishment.organization._id,
    organization_name: selectedAccomplishment.organization.org_name,
  });
  const basePath = `/${basicInfo.organization_name}/ExternalAccomplishment/${basicInfo.event_title}`;
  const [editing, setEditing] = useState({
    official_invitation: false,
    narrative_report: false,
    liquidation_report: false,
    photo_documentation: false,
    cm063_documents: false,
    echo_seminar_documents: false,
  });

  const [basicEdit, setBasicEdit] = useState({
    event_title: false,
    event_description: false,
    event_date: false,
  });

  const [uploadedFiles, setUploadedFiles] = useState({});

  const fileFields = {
    official_invitation: {
      label: "Official Invitation",
      accept: ".pdf",
    },
    narrative_report: {
      label: "Narrative Report",
      accept: ".pdf",
    },
    liquidation_report: {
      label: "Liquidation Report",
      accept: ".pdf",
    },
    photo_documentation: {
      label: "Photo Documentation",
      accept: "image/*",
      multiple: true,
    },
    cm063_documents: {
      label: "CMO 63 Documents",
      accept: ".pdf",
      multiple: true,
    },
    echo_seminar_documents: {
      label: "Echo Seminar Documents",
      accept: ".pdf",
      multiple: true,
    },
  };

  const logChange = (message) => {
    console.log(`[EditInstitutional] ${message}`);
  };

  const toggleEdit = (key) => {
    const now = !editing[key];
    setEditing((e) => ({ ...e, [key]: now }));
    logChange(`${now ? "Entered" : "Exited"} edit mode for "${key}".`);
  };

  const toggleBasicEdit = (field) => {
    setBasicEdit((prev) => ({ ...prev, [field]: !prev[field] }));
    if (basicEdit[field]) {
      // Reset to original value if cancelling edit
      setBasicInfo((prev) => ({
        ...prev,
        [field]:
          selectedAccomplishment[field] ||
          (field === "event_date"
            ? selectedAccomplishment[field].split("T")[0]
            : ""),
      }));
    }
  };

  const handleFileChange = (key, files) => {
    const arr = files instanceof FileList ? Array.from(files) : files;
    setUploadedFiles((prev) => ({ ...prev, [key]: arr }));

    if (!arr || arr.length === 0) {
      logChange(`Cleared selection for "${key}".`);
    } else {
      logChange(`Selected ${arr.length} file(s) for "${key}".`);
    }
  };

  const handleUpdate = async () => {
    const formData = new FormData();

    // Append text fields
    formData.append("event_title", basicInfo.event_title);
    formData.append("event_description", basicInfo.event_description);
    formData.append("event_date", basicInfo.event_date);
    formData.append("organization", basicInfo.organization);
    formData.append("activity_type", "External");

    // Metadata
    formData.append("orgFolder", basicInfo.organization_name);
    formData.append("orgDocumentClassification", "ExternalAccomplishment");
    formData.append("orgDocumentTitle", basicInfo.event_title);

    // Append files
    Object.entries(uploadedFiles).forEach(([key, files]) => {
      const arr = Array.isArray(files) ? files : [files];
      arr.forEach((file) => {
        if (!file) return;
        const isImage = file.type.startsWith("image/");
        formData.append(isImage ? "photo" : "document", file);
      });
    });

    // File names
    Object.entries(uploadedFiles).forEach(([key, files]) => {
      const arr = Array.isArray(files) ? files : [files];
      arr.forEach((file) => {
        if (!file) return;
        formData.append(key, file.name);
      });
    });

    // Debug
    for (let [key, val] of formData.entries()) {
      console.log(key, val);
    }

    // try {
    //   const { data } = await axios.post(
    //     `${API_ROUTER}/submit-external-accomplishment`,
    //     formData,
    //     { headers: { "Content-Type": "multipart/form-data" } }
    //   );
    //   console.log("✅ Submission successful:", data);
    //   alert("External Accomplishment updated successfully!");
    // } catch (err) {
    //   console.error("❌ Submission failed:", err);
    // }
  };

  const isAnythingEditing =
    Object.values(editing).includes(true) ||
    Object.values(basicEdit).includes(true);

  const renderSection = (key) => {
    if (!fileFields[key]) return null;

    const statusKey = `${key}_status`;
    const noteKey = `${key}_note`;
    const multiple = fileFields[key].multiple || false;

    const status = selectedAccomplishment.documents?.[statusKey] || "Pending";
    const note =
      selectedAccomplishment.documents?.[noteKey] || "Up for checking";

    return (
      <div key={key} className="space-y-2">
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
              {(Array.isArray(selectedAccomplishment.documents?.[key])
                ? selectedAccomplishment.documents?.[key]
                : selectedAccomplishment.documents?.[key]
                ? [selectedAccomplishment.documents?.[key]]
                : []
              ).map((f, i) => (
                <FileRenderer key={i} basePath={basePath} fileName={f} />
              ))}
            </div>
          ) : (
            <FileRenderer
              basePath={basePath}
              fileName={selectedAccomplishment.documents?.[key]}
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
    <div className="border h-full p-6 space-y-6 overflow-y-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Edit External Accomplishment
      </h1>

      {/* Basic Information */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Basic Information</h2>

        {/* Event Title */}
        <div>
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Event Title</label>
            <button
              className="text-sm text-blue-600 hover:underline"
              onClick={() => toggleBasicEdit("event_title")}
            >
              {basicEdit.event_title ? "Cancel" : "Edit"}
            </button>
          </div>
          {basicEdit.event_title ? (
            <input
              type="text"
              value={basicInfo.event_title}
              onChange={(e) =>
                setBasicInfo((prev) => ({
                  ...prev,
                  event_title: e.target.value,
                }))
              }
              className="w-full border rounded px-2 py-1"
            />
          ) : (
            <p className="text-gray-800">
              {selectedAccomplishment.event_title}
            </p>
          )}
        </div>

        {/* Event Date */}
        <div>
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Event Date</label>
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
                setBasicInfo((prev) => ({
                  ...prev,
                  event_date: e.target.value,
                }))
              }
              className="w-full border rounded px-2 py-1"
            />
          ) : (
            <p className="text-gray-800">
              {LongDateFormat(selectedAccomplishment.event_date)}
            </p>
          )}
        </div>

        {/* Event Description */}
        <div>
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Event Description</label>
            <button
              className="text-sm text-blue-600 hover:underline"
              onClick={() => toggleBasicEdit("event_description")}
            >
              {basicEdit.event_description ? "Cancel" : "Edit"}
            </button>
          </div>
          {basicEdit.event_description ? (
            <textarea
              rows={3}
              value={basicInfo.event_description}
              onChange={(e) =>
                setBasicInfo((prev) => ({
                  ...prev,
                  event_description: e.target.value,
                }))
              }
              className="w-full border rounded px-2 py-1"
            />
          ) : (
            <p className="text-gray-800 whitespace-pre-line">
              {selectedAccomplishment.event_description}
            </p>
          )}
        </div>
      </div>

      {/* Files Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Uploaded Files</h2>
        <div className="space-y-6">
          {renderSection("official_invitation")}
          {renderSection("narrative_report")}
          {renderSection("liquidation_report")}
          {renderSection("photo_documentation")}
          {renderSection("cm063_documents")}
          {renderSection("echo_seminar_documents")}
        </div>
      </div>

      {/* Buttons */}
      <div className="w-full h-10 flex justify-end gap-2">
        <div className="h-10 flex justify-end w-fit">
          <button className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow transition-all">
            CANCEL
          </button>
        </div>
        {isAnythingEditing && (
          <div className="h-10 flex justify-end w-fit">
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

function EditProposedPlanAccomplishment({ selectedAccomplishment }) {
  const [basicInfo, setBasicInfo] = useState({
    event_title: selectedAccomplishment.event_title,
    event_description: selectedAccomplishment.event_description,
    event_date: selectedAccomplishment.event_date.split("T")[0], // Format date for input
    organization: selectedAccomplishment.organization._id,
    organization_name: selectedAccomplishment.organization.org_name,
  });
  const basePath = `/${basicInfo.organization_name}/ProposedActivity/${basicInfo.event_title}`;
  const [editing, setEditing] = useState({
    approved_proposal: false,
    resolution: false,
    attendance_sheet: false,
    narrative_report: false,
    financial_report: false,
    evaluation_summary: false,
    photo_documentation: false,
    sample_evaluations: false,
  });

  const [basicEdit, setBasicEdit] = useState({
    event_title: false,
    event_description: false,
    event_date: false,
  });

  const [uploadedFiles, setUploadedFiles] = useState({});

  const fileFields = {
    approved_proposal: { label: "Approved Proposal", accept: ".pdf" },
    resolution: { label: "Resolution", accept: ".pdf" },
    attendance_sheet: { label: "Attendance Sheet", accept: ".pdf" },
    narrative_report: { label: "Narrative Report", accept: ".pdf" },
    financial_report: { label: "Financial Report", accept: ".pdf" },
    evaluation_summary: { label: "Evaluation Summary", accept: ".pdf" },
    photo_documentation: {
      label: "Photo Documentation",
      accept: "image/*",
      multiple: true,
    },
    sample_evaluations: {
      label: "Sample Evaluations",
      accept: ".pdf",
      multiple: true,
    },
  };

  const logChange = (message) => {
    console.log(`[EditProposedPlan] ${message}`);
  };

  const toggleEdit = (key) => {
    const now = !editing[key];
    setEditing((e) => ({ ...e, [key]: now }));
    logChange(`${now ? "Entered" : "Exited"} edit mode for "${key}".`);
  };

  const toggleBasicEdit = (field) => {
    setBasicEdit((prev) => ({ ...prev, [field]: !prev[field] }));
    if (basicEdit[field]) {
      // Reset to original value if cancelling edit
      setBasicInfo((prev) => ({
        ...prev,
        [field]:
          selectedAccomplishment[field] ||
          (field === "event_date"
            ? selectedAccomplishment[field].split("T")[0]
            : ""),
      }));
    }
  };

  const handleFileChange = (key, files) => {
    const arr = files instanceof FileList ? Array.from(files) : files;
    setUploadedFiles((prev) => ({ ...prev, [key]: arr }));

    if (!arr || arr.length === 0) {
      logChange(`Cleared selection for "${key}".`);
    } else {
      logChange(`Selected ${arr.length} file(s) for "${key}".`);
    }
  };

  const handleUpdate = async () => {
    const formData = new FormData();

    // Append text fields
    formData.append("event_title", basicInfo.event_title);
    formData.append("event_description", basicInfo.event_description);
    formData.append("event_date", basicInfo.event_date);
    formData.append("organization", basicInfo.organization);
    formData.append("activity_type", "ProposedPlan");

    // Metadata
    formData.append("orgFolder", basicInfo.organization_name);
    formData.append("orgDocumentClassification", "ProposedPlanAccomplishment");
    formData.append("orgDocumentTitle", basicInfo.event_title);

    // Append files
    Object.entries(uploadedFiles).forEach(([key, files]) => {
      const arr = Array.isArray(files) ? files : [files];
      arr.forEach((file) => {
        if (!file) return;
        const isImage = file.type.startsWith("image/");
        formData.append(isImage ? "photo" : "document", file);
      });
    });

    // File names
    Object.entries(uploadedFiles).forEach(([key, files]) => {
      const arr = Array.isArray(files) ? files : [files];
      arr.forEach((file) => {
        if (!file) return;
        formData.append(key, file.name);
      });
    });

    // Debug
    for (let [key, val] of formData.entries()) {
      console.log(key, val);
    }

    // try {
    //   const { data } = await axios.post(
    //     `${API_ROUTER}/submit-proposed-plan-accomplishment`,
    //     formData,
    //     { headers: { "Content-Type": "multipart/form-data" } }
    //   );
    //   console.log("✅ Submission successful:", data);
    //   alert("Proposed Plan Accomplishment updated successfully!");
    // } catch (err) {
    //   console.error("❌ Submission failed:", err);
    // }
  };

  const isAnythingEditing =
    Object.values(editing).includes(true) ||
    Object.values(basicEdit).includes(true);

  const renderSection = (key) => {
    if (!fileFields[key]) return null;

    const statusKey = `${key}_status`;
    const noteKey = `${key}_note`;
    const multiple = fileFields[key].multiple || false;

    const status = selectedAccomplishment.documents?.[statusKey] || "Pending";
    const note =
      selectedAccomplishment.documents?.[noteKey] || "Up for checking";

    return (
      <div key={key} className="space-y-2">
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
              {(Array.isArray(selectedAccomplishment.documents?.[key])
                ? selectedAccomplishment.documents?.[key]
                : selectedAccomplishment.documents?.[key]
                ? [selectedAccomplishment.documents?.[key]]
                : []
              ).map((f, i) => (
                <FileRenderer key={i} basePath={basePath} fileName={f} />
              ))}
            </div>
          ) : (
            <FileRenderer
              basePath={basePath}
              fileName={selectedAccomplishment.documents?.[key]}
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
    <div className="border h-full p-6 space-y-6 overflow-y-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Edit Proposed Plan Accomplishment
      </h1>

      {/* Basic Information */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Basic Information</h2>

        {/* Event Title */}
        <div>
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Event Title</label>
            <button
              className="text-sm text-blue-600 hover:underline"
              onClick={() => toggleBasicEdit("event_title")}
            >
              {basicEdit.event_title ? "Cancel" : "Edit"}
            </button>
          </div>
          {basicEdit.event_title ? (
            <input
              type="text"
              value={basicInfo.event_title}
              onChange={(e) =>
                setBasicInfo((prev) => ({
                  ...prev,
                  event_title: e.target.value,
                }))
              }
              className="w-full border rounded px-2 py-1"
            />
          ) : (
            <p className="text-gray-800">
              {selectedAccomplishment.event_title}
            </p>
          )}
        </div>

        {/* Event Date */}
        <div>
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Event Date</label>
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
                setBasicInfo((prev) => ({
                  ...prev,
                  event_date: e.target.value,
                }))
              }
              className="w-full border rounded px-2 py-1"
            />
          ) : (
            <p className="text-gray-800">
              {LongDateFormat(selectedAccomplishment.event_date)}
            </p>
          )}
        </div>

        {/* Event Description */}
        <div>
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Event Description</label>
            <button
              className="text-sm text-blue-600 hover:underline"
              onClick={() => toggleBasicEdit("event_description")}
            >
              {basicEdit.event_description ? "Cancel" : "Edit"}
            </button>
          </div>
          {basicEdit.event_description ? (
            <textarea
              rows={3}
              value={basicInfo.event_description}
              onChange={(e) =>
                setBasicInfo((prev) => ({
                  ...prev,
                  event_description: e.target.value,
                }))
              }
              className="w-full border rounded px-2 py-1"
            />
          ) : (
            <p className="text-gray-800 whitespace-pre-line">
              {selectedAccomplishment.event_description}
            </p>
          )}
        </div>
      </div>

      {/* Files Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Uploaded Files</h2>
        <div className="space-y-6">
          {renderSection("approved_proposal")}
          {renderSection("resolution")}
          {renderSection("attendance_sheet")}
          {renderSection("narrative_report")}
          {renderSection("financial_report")}
          {renderSection("evaluation_summary")}
          {renderSection("photo_documentation")}
          {renderSection("sample_evaluations")}
        </div>
      </div>

      {/* Buttons */}
      <div className="w-full h-10 flex justify-end gap-2">
        <div className="h-10 flex justify-end w-fit">
          <button className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow transition-all">
            CANCEL
          </button>
        </div>
        {isAnythingEditing && (
          <div className="h-10 flex justify-end w-fit">
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

export default function RandomTest({ selectedAccomplishment }) {
  console.log("selected Accomplishment");
  console.log(selectedAccomplishment);

  const activityType = selectedAccomplishment.activity_type;

  return (
    <>
      {activityType === "Institutional" && (
        <EditInstitutionalAccomplishment
          selectedAccomplishment={selectedAccomplishment}
        />
      )}
      {activityType === "External" && (
        <EditExternalAccomplishment
          selectedAccomplishment={selectedAccomplishment}
        />
      )}
      {activityType === "Proposed Plan" && (
        <EditProposedPlanAccomplishment
          selectedAccomplishment={selectedAccomplishment}
        />
      )}
    </>
  );
}
