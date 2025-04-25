import { useEffect, useState } from "react";
import PopUp from "../../../../components/pop-ups";
import {
  ReusableFileUpload,
  ReusableMultiFileUpload,
} from "../../../../components/reusable_file_upload";
import { API_ROUTER } from "../../../../App";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeftLong } from "@fortawesome/free-solid-svg-icons";

const textFields = [
  { label: "Event Title", id: "event_title", type: "text" },
  { label: "Event Description", id: "event_description", type: "textarea" },
  { label: "Event Date", id: "event_date", type: "date" },
];

function StudentAddAccomplishedInstitutional() {
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [formDataState, setFormDataState] = useState({
    event_title: "",
    event_description: "",
    event_date: "",
    organization: "", // Added for payload metadata
  });

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      try {
        const user = JSON.parse(userString);
        const orgId = user.organization?._id || "";

        setFormDataState((prev) => ({
          ...prev,
          organization: orgId,
        }));
      } catch (err) {
        console.error("Failed parsing user from storage:", err);
      }
    }
  }, []);
  const fileFields = {
    narrative_report: {
      label: "Narrative Report",
      accept: ".pdf,.doc,.docx",
    },
    attendance_sheet: {
      label: "Attendance Sheet",
      accept: ".pdf,.doc,.docx",
    },
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

  const singleFileFields = {
    narrative_report: fileFields.narrative_report,
    attendance_sheet: fileFields.attendance_sheet,
  };
  const multipleFileFields = {
    certificate: fileFields.certificate,
    photo_documentations: fileFields.photo_documentations,
  };

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

  const handleSubmit = async (e) => {
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

    // Debug
    for (let [key, value] of formData.entries()) {
      console.table(`${key}:`, value);
    }

    try {
      const { data } = await axios.post(
        `${API_ROUTER}/submit-instutional-accomplishment`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log("Server response:", data);
      alert("submission Succesful!");
    } catch (error) {
      console.error("Submission error:", error);
      // optionally show error popup here
    }
  };

  return (
    <section>
      <h1 className="text-2xl font-bold text-black text-center mb-4">
        Add Institutional Collaboration Activity
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6 h-1/2 overflow-y-auto">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-black">
            Activity Information
          </h2>
          {textFields.map(({ label, id, type }) => (
            <div key={id}>
              <label htmlFor={id} className="block mb-1 text-black font-medium">
                {label} <span className="text-red-500">*</span>
              </label>
              {type === "textarea" ? (
                <textarea
                  id={id}
                  name={id}
                  value={formDataState[id]}
                  onChange={handleChange}
                  className="w-full border border-black rounded-lg p-3 focus:ring-2 focus:ring-black"
                  rows={4}
                  required
                />
              ) : (
                <input
                  type={type}
                  id={id}
                  name={id}
                  value={formDataState[id]}
                  onChange={handleChange}
                  className="w-full border border-black rounded-lg p-3 focus:ring-2 focus:ring-black"
                  required
                />
              )}
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-lg font-semibold text-black mb-2">Documents</h2>
          <div className="border border-black p-4 rounded-md">
            <ReusableFileUpload
              fields={singleFileFields}
              onFileChange={handleFileChange}
            />
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-black mb-2">
            Additional Files
          </h2>
          <div className="border border-black p-4 rounded-md">
            <ReusableMultiFileUpload
              fields={multipleFileFields}
              onFileChange={handleFileChange}
            />
          </div>
        </div>

        <div className="text-right">
          <button type="submit" className="px-4 py-2 border ">
            Submit
          </button>
        </div>
      </form>
    </section>
  );
}

function StudentAddAccomplishedExternal() {
  const [formData, setFormData] = useState({
    event_title: "",
    event_description: "",
    event_date: "",
    organization_name: "",
  });
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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
      [fieldKey]: Array.isArray(files) ? files : [files],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const payload = new FormData();

      // 1) Append actual form data
      Object.entries(formData).forEach(([key, value]) => {
        payload.append(key, value);
      });

      payload.append("activity_type", "institutional");

      // 3) Append uploaded files and their metadata
      Object.entries(uploadedFiles).forEach(([fieldKey, fileOrFiles]) => {
        const files = Array.isArray(fileOrFiles) ? fileOrFiles : [fileOrFiles];

        files.forEach((file) => {
          if (!file) return;

          console.log("Checking file:", file);
          if (!(file instanceof File)) {
            console.error(`Invalid file object in ${fieldKey}:`, file);
            throw new Error(`Invalid file format for ${fieldKey}`);
          }

          payload.append(fieldKey, file, file.name);
          payload.append(
            `${fieldKey}_metadata`,
            JSON.stringify({
              name: file.name,
              type: file.type,
              size: file.size,
              lastModified: file.lastModified,
            })
          );
        });
      });

      // 4) Console log everything
      console.log("Form submission payload:");
      for (let [key, value] of payload.entries()) {
        console.log(`${key}:`, value);
      }

      setSubmitSuccess(true);

      // Reset form
      setFormData({
        event_title: "",
        event_description: "",
        event_date: "",
      });
      setUploadedFiles({});
    } catch (error) {
      console.error("Submission failed:", error);
      setSubmitError(
        error.message || "Failed to prepare form data. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const textFields = [
    { label: "Event Title", id: "event_title", type: "text" },
    { label: "Event Description", id: "event_description", type: "textarea" },
    { label: "Event Date", id: "event_date", type: "date" },
    { label: "Organization Name", id: "organization_name", type: "text" },
  ];

  const singleFileFields = {
    official_invitation: { label: "Official Invitation", accept: ".pdf" },
    narrative_report: { label: "Narrative Report", accept: ".pdf" },
    liquidation_report: { label: "Liquidation Report", accept: ".pdf" },
  };

  const multipleFileFields = {
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

  return (
    <div>
      <h1 className="text-2xl font-bold text-black text-center">
        Add External Accomplished Activity
      </h1>

      {submitSuccess && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
          Activity submitted successfully!
        </div>
      )}

      {submitError && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          Error: {submitError}
        </div>
      )}

      <section>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-black">
              Activity Information
            </h2>
            {textFields.map(({ label, id, type }) => (
              <div key={id}>
                <label
                  htmlFor={id}
                  className="block mb-1 text-black font-medium"
                >
                  {label} <span className="text-red-500">*</span>
                </label>
                {type === "textarea" ? (
                  <textarea
                    id={id}
                    name={id}
                    value={formData[id] || ""}
                    onChange={handleChange}
                    className="w-full border border-black rounded-lg p-3 focus:ring-2 focus:ring-black"
                    rows={4}
                    required
                  />
                ) : (
                  <input
                    type={type}
                    id={id}
                    name={id}
                    value={formData[id] || ""}
                    onChange={handleChange}
                    className="w-full border border-black rounded-lg p-3 focus:ring-2 focus:ring-black"
                    required
                  />
                )}
              </div>
            ))}
          </div>

          <div>
            <h2 className="text-lg font-semibold text-black mb-2">Documents</h2>
            <div className="border border-black p-4 rounded-md">
              <ReusableFileUpload
                fields={singleFileFields}
                onFileChange={handleFileChange}
              />
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-black mb-2">
              Additional Files
            </h2>
            <div className="border border-black p-4 rounded-md">
              <ReusableMultiFileUpload
                fields={multipleFileFields}
                onFileChange={handleFileChange}
              />
            </div>
          </div>

          <div className="text-right">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-black text-white px-6 py-2 rounded-md text-base font-medium transition ${
                isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-800"
              }`}
            >
              {isSubmitting ? "Submitting..." : "Submit Activity"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function StudentAddAccomplishedProposal() {
  const [formData, setFormData] = useState({
    event_title: "",
    event_description: "",
    event_date: "",
    organization: "",
  });
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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
      [fieldKey]: Array.isArray(files) ? files : [files],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const formDataToSend = new FormData();

      // Append text fields
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      // Append files
      Object.entries(uploadedFiles).forEach(([fieldKey, files]) => {
        files.forEach((file, index) => {
          formDataToSend.append(`${fieldKey}[${index}]`, file, file.name);
        });
      });

      // API call - replace with your actual endpoint
      const response = await fetch("/api/proposal-activities", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const result = await response.json();
      console.log("Submission successful:", result);
      setSubmitSuccess(true);

      // Reset form
      setFormData({
        event_title: "",
        event_description: "",
        event_date: "",
        organization: "",
      });
      setUploadedFiles({});
    } catch (error) {
      console.error("Submission failed:", error);
      setSubmitError(error.message || "Failed to submit form");
    } finally {
      setIsSubmitting(false);
    }
  };

  const textFields = [
    { label: "Event Title", id: "event_title", type: "text" },
    { label: "Event Description", id: "event_description", type: "textarea" },
    { label: "Event Date", id: "event_date", type: "date" },
    { label: "Organization", id: "organization", type: "text" },
  ];

  const singleFileFields = {
    approved_proposal: { label: "Approved Proposal", accept: ".pdf" },
    resolution: { label: "Resolution", accept: ".pdf" },
    attendance_sheet: { label: "Attendance Sheet", accept: ".pdf" },
    narrative_report: { label: "Narrative Report", accept: ".pdf" },
    financial_report: { label: "Financial Report", accept: ".pdf" },
    evaluation_summary: { label: "Evaluation Summary", accept: ".pdf" },
  };

  const multipleFileFields = {
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

  return (
    <section>
      <h1 className="text-2xl font-bold text-gray-800 text-center flex-grow">
        Add Accomplished Action Plan
      </h1>

      {submitSuccess && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
          Accomplishment submitted successfully!
        </div>
      )}

      {submitError && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          Error: {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-700">
            Accomplishment Information
          </h2>
          {textFields.map(({ label, id, type }) => (
            <div key={id}>
              <label
                htmlFor={id}
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                {label} <span className="text-red-500">*</span>
              </label>
              {type === "textarea" ? (
                <textarea
                  id={id}
                  name={id}
                  value={formData[id] || ""}
                  onChange={handleChange}
                  className="w-full border border-black rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
                  rows={4}
                  required
                />
              ) : (
                <input
                  type={type}
                  id={id}
                  name={id}
                  value={formData[id] || ""}
                  onChange={handleChange}
                  className="w-full border border-black rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
                  required
                />
              )}
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Documents
            </h2>
            <div className="border border-black p-4 rounded-md">
              <ReusableFileUpload
                fields={singleFileFields}
                onFileChange={handleFileChange}
              />
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Additional Files
            </h2>
            <div className="border border-black p-4 rounded-md">
              <ReusableMultiFileUpload
                fields={multipleFileFields}
                onFileChange={handleFileChange}
              />
            </div>
          </div>
        </div>

        <div className="text-right">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-blue-600 text-white px-6 py-2 rounded-md text-base font-medium transition ${
              isSubmitting
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit Accomplishment"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default function StudentAccreditationAdd({ onBack }) {
  const [formType, setFormType] = useState("institutional_activity"); // Add this state

  const tabs = [
    { key: "institutional_activity", label: "Institutional Activity" },
    { key: "external_activity", label: "External Activity" },
    { key: "accomplishment", label: "Action Plan" },
  ];

  return (
    <section className="flex flex-col bg-gray-50 border h-full space-y-4">
      {/* Back + Tab selector */}
      <div className="flex items-center justify-between mb-8">
        <div className="border-red-600 border-2 rounded-lg flex space-x-4 p-2">
          <button
            onClick={onBack}
            className="text-blue-600 hover:text-blue-800"
          >
            <FontAwesomeIcon icon={faLeftLong} /> Back
          </button>
        </div>

        <div className="border-red-600 flex items-center gap-4">
          <h1>choose a form</h1>
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setFormType(t.key)}
              className={
                formType === t.key
                  ? "px-4 py-2 bg-blue-600 text-white rounded-lg"
                  : "px-4 py-2 bg-gray-100 text-gray-700 rounded-lg"
              }
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Form Section */}
      <div className="overflow-y-auto p-4 border h-full">
        {formType === "institutional_activity" && (
          <StudentAddAccomplishedInstitutional />
        )}
        {formType === "external_activity" && <StudentAddAccomplishedExternal />}
        {formType === "accomplishment" && <StudentAddAccompplishedProposal />}
      </div>
    </section>
  );
}
