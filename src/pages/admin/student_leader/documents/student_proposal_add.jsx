import { useEffect, useState } from "react";
import { PopUp } from "../../../../components/pop-ups";
import {
  ReusableFileUpload,
  ReusableMultiFileUpload,
} from "../../../../components/reusable_file_upload";
import { API_ROUTER } from "../../../../App";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownLeftAndUpRightToCenter,
  faLeftLong,
} from "@fortawesome/free-solid-svg-icons";

// All file fields.
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

// Split single vs multiple for your reusable components
const singleFileFields = {
  proposal_document: fileFields.proposal_document,
  notice_document: fileFields.notice_document,
  minutes_document: fileFields.minutes_document,
};

const multipleFileFields = {
  photo_documentations: fileFields.photo_documentations,
  resolution_document: fileFields.resolution_document,
};
// Your text fields
const documentDataFields = [
  { label: "Title", id: "title", type: "text" },
  { label: "Event Date", id: "event_date", type: "date" },
  { label: "Description", id: "description", type: "textarea" },
];

export default function ProposalSubmitionStudentSection({ onBack }) {
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [showPopup, setShowPopup] = useState(false);

  const [formDataState, setFormDataState] = useState({
    organization_id: "",
    organizationName: "",
    title: "",
    event_date: "",
    description: "",
  });

  const handleClosePopup = () => {
    setShowPopup(false);
    window.location.reload(); // or navigate somewhere
  };

  // on mount, grab org._id from localStorage → user.organization._id
  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      try {
        const user = JSON.parse(userString);
        const orgId = user.organization?._id || "";
        const orgName = user.organization?.org_name || "";

        setFormDataState((prev) => ({
          ...prev,
          organization_id: orgId,
          organizationName: orgName,
        }));
      } catch (err) {
        console.error("Failed parsing user from storage:", err);
      }
    }
  }, []);

  // handle text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDataState((prev) => ({ ...prev, [name]: value }));
  };

  // handle file inputs (single vs multiple)
  const handleFileChange = (fieldKey, files) => {
    if (!files || files.length === 0) {
      setUploadedFiles((prev) => {
        const copy = { ...prev };
        delete copy[fieldKey];
        return copy;
      });
      return;
    }
    setUploadedFiles((prev) => ({
      ...prev,
      [fieldKey]: fileFields[fieldKey].multiple ? Array.from(files) : files[0],
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // 1) text fields
    Object.entries(formDataState).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // 2) metadata
    formData.append("orgFolder", formDataState.organizationName);
    formData.append("orgDocumentClassification", "Proposals");
    formData.append("orgDocumentTitle", formDataState.title);

    // 3A) append file binaries
    Object.entries(uploadedFiles).forEach(([fieldKey, fileOrFiles]) => {
      const files = Array.isArray(fileOrFiles) ? fileOrFiles : [fileOrFiles];
      files.forEach((file) => {
        if (!file) return;
        const isImage = file.type.startsWith("image/");
        const formKey = isImage ? "photo" : "document";
        formData.append(formKey, file);
      });
    });

    // 3B) append file names
    Object.entries(uploadedFiles).forEach(([fieldKey, fileOrFiles]) => {
      const files = Array.isArray(fileOrFiles) ? fileOrFiles : [fileOrFiles];
      files.forEach((file) => {
        formData.append(fieldKey, file.name);
      });
    });

    try {
      const { data } = await axios.post(
        `${API_ROUTER}/submit-proposals`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log("Server response:", data);
      setShowPopup(true);
    } catch (error) {
      console.error("Submission error:", error);
      // optionally show error popup here
    }
  };

  return (
    <div className="w-3/4 h-11/12 mx-auto shadow-xl rounded-2xl bg-white flex flex-col   ">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b bg-blue-50 rounded-t-2xl">
        <button
          className="text-blue-600 hover:text-blue-800 transition "
          onClick={onBack}
        >
          <FontAwesomeIcon icon={faLeftLong} className="text-xl" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800 text-center flex-grow">
          Proposal Submission
        </h1>
        <span className="w-6" />
      </div>

      {/* Scrollable Form */}
      <form
        onSubmit={onSubmit}
        className="overflow-y-auto flex-grow px-6 py-6 space-y-8 "
      >
        {/* Proposal Info */}
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Proposal Information
          </h2>
          <div className="flex flex-col sm:grid-cols-2 gap-6">
            {documentDataFields.map(({ label, id, type }) => (
              <div key={id}>
                <label
                  htmlFor={id}
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  {label} <span className="text-red-500">*</span>
                </label>
                {type === "textarea" ? (
                  <textarea
                    id={id}
                    name={id}
                    value={formDataState[id]}
                    onChange={handleChange}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    required
                  />
                ) : (
                  <input
                    type={type}
                    id={id}
                    name={id}
                    value={formDataState[id]}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    required
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* File Uploads */}
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Documents
            </h2>
            <div className="border border-gray-200 bg-gray-50 p-4 rounded-lg shadow-sm">
              <ReusableFileUpload
                fields={singleFileFields}
                onFileChange={handleFileChange}
              />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Additional Files
            </h2>
            <div className="border border-gray-200 bg-gray-50 p-4 rounded-lg shadow-sm">
              <ReusableMultiFileUpload
                fields={multipleFileFields}
                onFileChange={handleFileChange}
              />
            </div>
          </div>
        </div>

        {showPopup && (
          <PopUp
            title="Success!"
            text="Your form has been submitted."
            ButtonText="Okay"
            onClose={handleClosePopup}
          />
        )}
        {/* Submit */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-base font-semibold shadow-md transition"
          >
            Submit Proposal
          </button>
        </div>
      </form>
    </div>
  );
}
