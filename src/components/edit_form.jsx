import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import {
  ReusableFileUpload,
  ReusableMultiFileUpload,
} from "./reusable_file_upload";

import { FileRenderer } from "./file_renderer";
import axios from "axios";
import { API_ROUTER } from "../App";
import { data } from "react-router-dom";

export default function EditSectionBase({
  selectedData,
  apiUpdateRoute,
  fileFields,
  documentClassification,
  title = "Edit Section",
}) {
  console.log(selectedData);

  const [basicInfo, setBasicInfo] = useState({
    title: selectedData.title,
    description: selectedData.description,
    event_date: selectedData.event_date.slice(0, 10),
  });

  const [editingFiles, setEditingFiles] = useState(
    Object.keys(fileFields).reduce((acc, key) => ({ ...acc, [key]: false }), {})
  );
  const [basicEdit, setBasicEdit] = useState({
    title: false,
    event_date: false,
    description: false,
  });
  const [newFiles, setNewFiles] = useState({});

  const basePath = `/${selectedData.organization.org_name}/${documentClassification}/${basicInfo.title}`;
  const isAnythingEditing =
    Object.values(editingFiles).includes(true) ||
    Object.values(basicEdit).includes(true);

  const toggleBasicEdit = (field) => {
    setBasicEdit((prev) => ({ ...prev, [field]: !prev[field] }));
    if (basicEdit[field]) {
      setBasicInfo((prev) => ({ ...prev, [field]: selectedData[field] }));
    }
  };

  const toggleEditFile = (key) => {
    setEditingFiles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleFileChange = (key, files) => {
    const arr = files instanceof FileList ? Array.from(files) : files;
    setNewFiles((prev) => ({ ...prev, [key]: arr }));
  };

  const handleUpdate = async () => {
    const updatedMeeting = Object.entries(selectedData.meeting).reduce(
      (acc, [key, orig]) => {
        acc[key] =
          newFiles[key] && newFiles[key].length > 0 ? newFiles[key] : orig;
        return acc;
      },
      {}
    );

    const updatedData = {
      ...selectedData,
      title: basicInfo.title,
      description: basicInfo.description,
      event_date: new Date(basicInfo.event_date).toISOString(),
      meeting: updatedMeeting,
    };

    const formData = new FormData();
    formData.append("title", updatedData.title);
    formData.append("description", updatedData.description);
    formData.append("event_date", updatedData.event_date);
    formData.append("organization_id", updatedData.organization._id);
    formData.append("orgFolder", updatedData.organization.org_name);
    formData.append("orgDocumentClassification", documentClassification);
    formData.append("orgDocumentTitle", updatedData.title);

    Object.entries(updatedMeeting).forEach(([field, fileOrArr]) => {
      const files = Array.isArray(fileOrArr) ? fileOrArr : [fileOrArr];
      files.forEach((file) => {
        if (!(file instanceof File)) return;
        const ext = file.name.split(".").pop().toLowerCase();
        const isImage = [
          "jpg",
          "jpeg",
          "png",
          "gif",
          "bmp",
          "webp",
          "svg",
        ].includes(ext);

        formData.append(isImage ? "photo" : "document", file);
        formData.append(field, file.name);
      });
    });

    // try {
    //   const res = await axios.post(
    //     `${API_ROUTER}/${apiUpdateRoute}/${updatedData._id}`,
    //     formData
    //   );
    //   console.log("✅ Update successful:", res.data);
    // } catch (err) {
    //   console.error("❌ Update failed:", err);
    // }
  };

  const renderSection = (key, multiple = false) => {
    const statusKey = `${key}_status`;
    const noteKey = `${key}_note`;

    const status = selectedData.meeting[statusKey] || "Pending";
    const note = selectedData.meeting[noteKey] || "Up for checking";

    return (
      <div key={key} className="space-y-2">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium">
              {fileFields[key].label}{" "}
              <span className="text-sm text-gray-500">({status})</span>
            </h3>
            <p className="text-xs italic text-gray-600">Note: {note}</p>
          </div>
          <button
            className="text-sm text-blue-600 hover:underline flex items-center"
            onClick={() => toggleEditFile(key)}
          >
            <FontAwesomeIcon icon={faEdit} className="mr-1" />
            {editingFiles[key] ? "Cancel" : "Edit"}
          </button>
        </div>

        {!editingFiles[key] ? (
          multiple ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {selectedData.meeting[key]?.map((f, idx) => (
                <FileRenderer key={idx} basePath={basePath} fileName={f} />
              ))}
            </div>
          ) : (
            <FileRenderer
              basePath={basePath}
              fileName={selectedData.meeting[key]}
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
    <div className="p-6 border h-full overflow-y-auto space-y-6">
      <h1 className="text-2xl font-bold">{title}</h1>

      {/* Basic Information */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Basic Information</h2>

        {["title", "event_date", "description"].map((field) => (
          <div key={field}>
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium capitalize">
                {field.replace("_", " ")}
              </label>
              <button
                className="text-sm text-blue-600 hover:underline"
                onClick={() => toggleBasicEdit(field)}
              >
                {basicEdit[field] ? "Cancel" : "Edit"}
              </button>
            </div>

            {basicEdit[field] ? (
              field === "description" ? (
                <textarea
                  rows={3}
                  value={basicInfo[field]}
                  onChange={(e) =>
                    setBasicInfo((b) => ({ ...b, [field]: e.target.value }))
                  }
                  className="w-full border rounded px-2 py-1"
                />
              ) : (
                <input
                  type={field === "event_date" ? "date" : "text"}
                  value={basicInfo[field]}
                  onChange={(e) =>
                    setBasicInfo((b) => ({ ...b, [field]: e.target.value }))
                  }
                  className="w-full border rounded px-2 py-1"
                />
              )
            ) : (
              <p className="text-gray-800 whitespace-pre-line">
                {basicInfo[field]}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Meeting Documents */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Meeting Documents</h2>
        <div className="space-y-6">
          {Object.entries(fileFields).map(([key, { multiple }]) =>
            renderSection(key, multiple)
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-2">
        <button className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg">
          Cancel
        </button>
        {isAnythingEditing && (
          <button
            onClick={handleUpdate}
            className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
          >
            Update
          </button>
        )}
      </div>
    </div>
  );
}
