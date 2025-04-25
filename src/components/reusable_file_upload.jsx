import { useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCloudUploadAlt,
  faFile,
  faPlus,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";

export const ReusableFileUpload = ({ fields, onFileChange }) => {
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [dragOverKey, setDragOverKey] = useState(null);

  const handleFileUpdate = (key, files) => {
    if (!files || !files[0]) {
      // Handle deletion/reset
      setUploadedFiles((prev) => {
        const newFiles = { ...prev };
        delete newFiles[key];
        return newFiles;
      });
      onFileChange?.(key, null);
      return;
    }

    const file = files[0];
    setUploadedFiles((prev) => ({
      ...prev,
      [key]: file,
    }));
    onFileChange?.(key, files);
  };

  const handleDrop = useCallback(
    (e, key) => {
      e.preventDefault();
      setDragOverKey(null);
      const files = e.dataTransfer.files;
      handleFileUpdate(key, files);
    },
    [onFileChange]
  );

  const handleFileInputChange = (key, e) => {
    handleFileUpdate(key, e.target.files);
  };

  const handleDelete = (key) => {
    handleFileUpdate(key, null);
  };
  const triggerFileInput = (key) => {
    const input = document.getElementById(`file-input-${key}`);
    if (input) input.click();
  };

  const isImage = (file) => file && file.type.startsWith("image/");

  const getPreviewUrl = (file) => URL.createObjectURL(file);

  return (
    <div>
      {Object.entries(fields).map(([key, { label, accept }]) => {
        const file = uploadedFiles[key];
        const isDragging = dragOverKey === key;
        const isDisabled = Boolean(file);

        return (
          <div key={key} className="flex items-center gap-2 py-2">
            <label className=" text-sm  font-medium flex-1 text-gray-700">
              {label}
            </label>
            {!file ? (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOverKey(key);
                }}
                onDragLeave={() => setDragOverKey(null)}
                onDrop={(e) => handleDrop(e, key)}
                onClick={() => !isDisabled && triggerFileInput(key)}
                className={`flex flex-col flex-1/2 items-center justify-center w-full h-24 border-3 border-dashed rounded-lg transition cursor-pointer ${
                  isDragging ? "border-blue-500 bg-blue-50" : ""
                }`}
              >
                <FontAwesomeIcon
                  icon={faCloudUploadAlt}
                  className="text-3xl text-blue-500 mb-2"
                />
                <p className="text-gray-700 text-sm text-center">
                  Drag & drop or{" "}
                  <span className="text-blue-600 underline">
                    click to upload
                  </span>
                </p>
                <input
                  id={`file-input-${key}`}
                  type="file"
                  accept={accept}
                  disabled={isDisabled}
                  onChange={(e) => handleFileInputChange(key, e)}
                  className="hidden"
                />
              </div>
            ) : (
              <div className=" flex items-center flex-1/2  justify-between space-x-4  p-3 ">
                {isImage(file) ? (
                  <img
                    src={getPreviewUrl(file)}
                    alt={file.name}
                    className="w-16 h-16 object-cover rounded shadow"
                  />
                ) : (
                  <div className="text-gray-600 text-sm truncate max-w-xs">
                    📄 {file.name}
                  </div>
                )}
                <button
                  onClick={() => handleDelete(key)}
                  className="text-red-500 hover:text-red-700"
                  title="Delete file"
                >
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export const ReusableMultiFileUpload = ({ fields, onFileChange }) => {
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [dragOverKey, setDragOverKey] = useState(null);

  // Merge new files with existing ones
  const handleFileUpdate = (key, files) => {
    const newFiles = files && files.length ? Array.from(files) : [];
    setUploadedFiles((prev) => {
      const combined = [...(prev[key] || []), ...newFiles];
      onFileChange?.(key, combined);
      return { ...prev, [key]: combined };
    });
  };

  const handleDrop = useCallback((e, key) => {
    e.preventDefault();
    setDragOverKey(null);
    handleFileUpdate(key, e.dataTransfer.files);
  }, []);

  const handleFileInputChange = (key, e) => {
    handleFileUpdate(key, e.target.files);
  };

  // Delete a specific file
  const handleDelete = (key, index) => {
    setUploadedFiles((prev) => {
      const newArray = (prev[key] || []).filter((_, i) => i !== index);
      onFileChange?.(key, newArray);
      return { ...prev, [key]: newArray };
    });
  };

  // Programmatically open file selector
  const triggerFileInput = (key) => {
    const input = document.getElementById(`file-input-multiple-${key}`);
    if (input) input.click();
  };

  const isImage = (file) => file?.type.startsWith("image/");
  const getPreviewUrl = (file) => URL.createObjectURL(file);

  return (
    <div>
      {Object.entries(fields).map(([key, { label, accept }]) => {
        const filesArray = uploadedFiles[key] || [];
        const isDragging = dragOverKey === key;

        return (
          <div key={key} className="flex flex-col gap-2 py-2">
            <label className="text-sm font-medium text-gray-700">{label}</label>

            <div className="flex flex-wrap gap-1 justify-between border border-dashed rounded p-2">
              {/* Existing file previews */}
              {filesArray.map((file, index) => (
                <div key={index} className="relative flex-shrink-0">
                  {isImage(file) ? (
                    <img
                      src={getPreviewUrl(file)}
                      alt={file.name}
                      className="h-32 w-auto rounded-lg object-cover"
                    />
                  ) : (
                    <div className=" w-36 border flex flex-col items-center justify-center p-4 h-full">
                      <FontAwesomeIcon
                        icon={faFile}
                        className="text-2xl text-black"
                      />
                      <h1>{file.name}</h1>
                    </div>
                  )}
                  <button
                    onClick={() => handleDelete(key, index)}
                    className="absolute top-2 right-3 text-red-500 hover:text-red-700"
                    title="Delete file"
                  >
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                </div>
              ))}

              {/* Add more files card */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOverKey(key);
                }}
                onDragLeave={() => setDragOverKey(null)}
                onDrop={(e) => handleDrop(e, key)}
                onClick={() => triggerFileInput(key)}
                className={`flex-shrink-0 w-42 h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition ${
                  isDragging ? "border-blue-500 bg-blue-50" : ""
                }`}
              >
                <FontAwesomeIcon
                  icon={faPlus}
                  className="text-2xl text-gray-500 mb-1"
                />
                <p className="text-gray-500 text-xs text-center">Add files</p>
                <input
                  id={`file-input-multiple-${key}`}
                  type="file"
                  accept={accept}
                  multiple
                  onChange={(e) => handleFileInputChange(key, e)}
                  className="hidden"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
