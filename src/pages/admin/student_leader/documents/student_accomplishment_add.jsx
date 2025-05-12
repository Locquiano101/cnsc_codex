import { useEffect, useState } from "react";
import { API_ROUTER } from "../../../../App";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeftLong, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import {
  ReusableFileUpload,
  ReusableMultiFileUpload,
} from "../../../../components/reusable_file_upload";

const textFields = [
  { label: "Event Title", id: "event_title", type: "text" },
  { label: "Event Description", id: "event_description", type: "textarea" },
  { label: "Event Date", id: "event_date", type: "date" },
];

// Notification Component
const Notification = ({ type, message, onClose }) => {
  const bgColor = type === "success" ? "bg-green-100" : "bg-red-100";
  const textColor = type === "success" ? "text-green-700" : "text-red-700";
  const icon = type === "success" ? faCheckCircle : null;

  return (
    <div
      className={`p-4 ${bgColor} ${textColor} rounded-lg shadow-sm flex justify-between items-center mb-4`}
    >
      <div className="flex items-center">
        {icon && <FontAwesomeIcon icon={icon} className="mr-2" />}
        <span>{message}</span>
      </div>
      <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
        &times;
      </button>
    </div>
  );
};

function StudentAddAccomplishedInstitutional() {
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);
  const [formDataState, setFormDataState] = useState({
    event_title: "",
    event_description: "",
    event_date: "",
    activity_type: "Institutional Activity",
    over_all_status: "Pending",
    event_status: "Pending",
  });

  const fileFields = {
    narrative_report: {
      label: "Narrative Report",
      accept: ".pdf,.doc,.docx",
    },
    official_invitation: {
      label: "Official Invitation",
      accept: ".pdf,.doc,.docx",
    },
    liquidation_report: {
      label: "Liquidation Report",
      accept: ".pdf,.doc,.docx",
    },
    cm063_documents: {
      label: "CMO 63 Documents",
      accept: ".pdf,.doc,.docx",
      multiple: true,
    },
    photo_documentation: {
      label: "Photo Documentation",
      accept: "image/*",
      multiple: true,
    },
  };

  const singleFileFields = {
    narrative_report: fileFields.narrative_report,
    official_invitation: fileFields.official_invitation,
    liquidation_report: fileFields.liquidation_report,
  };

  const multipleFileFields = {
    cm063_documents: fileFields.cm063_documents,
    photo_documentation: fileFields.photo_documentation,
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDataState((prev) => ({ ...prev, [name]: value }));
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
      [fieldKey]: fileFields[fieldKey].multiple ? Array.from(files) : files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setNotification(null);

    const formData = new FormData();

    // Append text fields
    Object.entries(formDataState).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // Append file binaries
    Object.entries(uploadedFiles).forEach(([fieldKey, fileOrFiles]) => {
      const files = Array.isArray(fileOrFiles) ? fileOrFiles : [fileOrFiles];
      files.forEach((file) => {
        if (!file) return;
        const isImage = file.type.startsWith("image/");
        const formKey = isImage ? "photo" : "document";
        formData.append(formKey, file);
      });
    });

    // Append file names
    Object.entries(uploadedFiles).forEach(([fieldKey, fileOrFiles]) => {
      const files = Array.isArray(fileOrFiles) ? fileOrFiles : [fileOrFiles];
      files.forEach((file) => {
        formData.append(`documents[${fieldKey}]`, file.name);
      });
    });

    try {
      const { data } = await axios.post(
        `${API_ROUTER}/submit-instutional-accomplishment`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setNotification({
        type: "success",
        message: "Submission successful!",
      });

      // Reset form after successful submission
      setFormDataState({
        event_title: "",
        event_description: "",
        event_date: "",
        activity_type: "Institutional Activity",
        over_all_status: "Pending",
        event_status: "Pending",
      });
      setUploadedFiles({});
    } catch (error) {
      console.error("Submission error:", error);
      setNotification({
        type: "error",
        message: error.message || "Submission failed. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="w-full h-full overflow-auto">
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Activity Information
          </h2>
          <div className="space-y-4">
            {textFields.map(({ label, id, type }) => (
              <div key={id}>
                <label
                  htmlFor={id}
                  className="block mb-2 text-gray-700 font-medium"
                >
                  {label} <span className="text-red-500">*</span>
                </label>
                {type === "textarea" ? (
                  <textarea
                    id={id}
                    name={id}
                    value={formDataState[id]}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Required Documents
          </h2>
          <ReusableFileUpload
            fields={singleFileFields}
            onFileChange={handleFileChange}
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Additional Files
          </h2>
          <ReusableMultiFileUpload
            fields={multipleFileFields}
            onFileChange={handleFileChange}
          />
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-blue-600 text-white px-6 py-3 rounded-lg text-base font-medium transition ${
              isSubmitting
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit Activity"}
          </button>
        </div>
      </form>
    </div>
  );
}

function StudentAddAccomplishedExternal() {
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [formDataState, setFormDataState] = useState({
    event_title: "",
    event_description: "",
    event_date: "",
    organization: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      try {
        const user = JSON.parse(userString);
        if (user?.organization?._id) {
          const orgId = user.organization._id;
          const orgName = user.organization.org_name;
          setFormDataState((prev) => ({
            ...prev,
            organization: orgId,
            organization_name: orgName,
          }));
        }
      } catch (err) {
        console.error("Failed parsing user from storage:", err);
      }
    }
  }, []);

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

  const singleFileFields = {
    official_invitation: fileFields.official_invitation,
    narrative_report: fileFields.narrative_report,
    liquidation_report: fileFields.liquidation_report,
  };

  const multipleFileFields = {
    photo_documentation: fileFields.photo_documentation,
    cm063_documents: fileFields.cm063_documents,
    echo_seminar_documents: fileFields.echo_seminar_documents,
  };

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDataState((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input changes
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
    setIsSubmitting(true);
    setNotification(null);

    const formData = new FormData();

    // 1) Append text fields
    Object.entries(formDataState).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append("activity_type", "External");

    formData.append("orgFolder", formDataState.organization_name);
    formData.append("orgDocumentClassification", "ExternalAccomplishment");
    formData.append("orgDocumentTitle", formDataState.event_title);

    // 2) Append file binaries
    Object.entries(uploadedFiles).forEach(([fieldKey, fileOrFiles]) => {
      const files = Array.isArray(fileOrFiles) ? fileOrFiles : [fileOrFiles];
      files.forEach((file) => {
        if (!file) return;
        const isImage = file.type.startsWith("image/");
        const formKey = isImage ? "photo" : "document";
        formData.append(formKey, file);
      });
    });

    // 3) Append file names
    Object.entries(uploadedFiles).forEach(([fieldKey, fileOrFiles]) => {
      const files = Array.isArray(fileOrFiles) ? fileOrFiles : [fileOrFiles];
      files.forEach((file) => {
        formData.append(fieldKey, file.name);
      });
    });

    try {
      const { data } = await axios.post(
        `${API_ROUTER}/submit-external-accomplishment`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setNotification({
        type: "success",
        message: "External activity submitted successfully!",
      });

      // Reset form after successful submission
      setFormDataState({
        event_title: "",
        event_description: "",
        event_date: "",
        organization: formDataState.organization,
        organization_name: formDataState.organization_name,
      });
      setUploadedFiles({});
    } catch (error) {
      console.error("Submission failed:", error);
      setNotification({
        type: "error",
        message: error.message || "Submission failed. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
      // Scroll to top to show notification
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="w-full px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Add External Accomplished Activity
      </h1>

      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Activity Information
          </h2>
          <div className="space-y-4">
            {textFields.map(({ label, id, type }) => (
              <div key={id}>
                <label
                  htmlFor={id}
                  className="block mb-2 text-gray-700 font-medium"
                >
                  {label} <span className="text-red-500">*</span>
                </label>
                {type === "textarea" ? (
                  <textarea
                    id={id}
                    name={id}
                    value={formDataState[id]}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Required Documents
          </h2>
          <ReusableFileUpload
            fields={singleFileFields}
            onFileChange={handleFileChange}
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Additional Files
          </h2>
          <ReusableMultiFileUpload
            fields={multipleFileFields}
            onFileChange={handleFileChange}
          />
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-blue-600 text-white px-6 py-3 rounded-lg text-base font-medium transition ${
              isSubmitting
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit Activity"}
          </button>
        </div>
      </form>
    </div>
  );
}

function StudentAddAccomplishedProposal() {
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [formDataState, setFormDataState] = useState({
    event_title: "",
    event_description: "",
    event_date: "",
    organization: "",
    organization_name: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      try {
        const user = JSON.parse(userString);
        if (user?.organization?._id) {
          const orgId = user.organization._id;
          const orgName = user.organization.org_name;
          setFormDataState((prev) => ({
            ...prev,
            organization: orgId,
            organization_name: orgName,
          }));
        }
      } catch (err) {
        console.error("Failed parsing user from storage:", err);
      }
    }
  }, []);

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

  const singleFileFields = {
    approved_proposal: fileFields.approved_proposal,
    resolution: fileFields.resolution,
    attendance_sheet: fileFields.attendance_sheet,
    narrative_report: fileFields.narrative_report,
    financial_report: fileFields.financial_report,
    evaluation_summary: fileFields.evaluation_summary,
  };

  const multipleFileFields = {
    photo_documentation: fileFields.photo_documentation,
    sample_evaluations: fileFields.sample_evaluations,
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDataState((prev) => ({ ...prev, [name]: value }));
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
      [fieldKey]: fileFields[fieldKey].multiple ? Array.from(files) : files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setNotification(null);

    const formData = new FormData();

    // 1) Append text fields
    Object.entries(formDataState).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append("activity_type", "Proposed Plan");

    formData.append("orgFolder", formDataState.organization_name);
    formData.append("orgDocumentClassification", "ProposedActivity");
    formData.append("orgDocumentTitle", formDataState.event_title);

    // 2) Append file binaries
    Object.entries(uploadedFiles).forEach(([fieldKey, fileOrFiles]) => {
      const files = Array.isArray(fileOrFiles) ? fileOrFiles : [fileOrFiles];
      files.forEach((file) => {
        if (!file) return;
        const isImage = file.type.startsWith("image/");
        const formKey = isImage ? "photo" : "document";
        formData.append(formKey, file);
      });
    });

    // 3) Append file names
    Object.entries(uploadedFiles).forEach(([fieldKey, fileOrFiles]) => {
      const files = Array.isArray(fileOrFiles) ? fileOrFiles : [fileOrFiles];
      files.forEach((file) => {
        formData.append(fieldKey, file.name);
      });
    });

    try {
      const { data } = await axios.post(
        `${API_ROUTER}/submit-proposed-accomplishment`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setNotification({
        type: "success",
        message: "Action plan submitted successfully!",
      });

      // Reset form after successful submission
      setFormDataState({
        event_title: "",
        event_description: "",
        event_date: "",
        organization: formDataState.organization,
        organization_name: formDataState.organization_name,
      });
      setUploadedFiles({});
    } catch (error) {
      console.error("Submission failed:", error);
      setNotification({
        type: "error",
        message: error.message || "Submission failed. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
      // Scroll to top to show notification
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="w-full  px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Add Accomplished Action Plan
      </h1>

      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Activity Information
          </h2>
          <div className="space-y-4">
            {textFields.map(({ label, id, type }) => (
              <div key={id}>
                <label
                  htmlFor={id}
                  className="block mb-2 text-gray-700 font-medium"
                >
                  {label} <span className="text-red-500">*</span>
                </label>
                {type === "textarea" ? (
                  <textarea
                    id={id}
                    name={id}
                    value={formDataState[id]}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Required Documents
          </h2>
          <ReusableFileUpload
            fields={singleFileFields}
            onFileChange={handleFileChange}
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Additional Files
          </h2>
          <ReusableMultiFileUpload
            fields={multipleFileFields}
            onFileChange={handleFileChange}
          />
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-blue-600 text-white px-6 py-3 rounded-lg text-base font-medium transition ${
              isSubmitting
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit Activity"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function AddStudentAccomplishmentReport({ onBack }) {
  const [formType, setFormType] = useState("institutional_activity");

  const tabs = [
    { key: "institutional_activity", label: "Institutional Activity" },
    { key: "external_activity", label: "External Activity" },
    { key: "accomplishment", label: "Action Plan" },
  ];

  return (
    <div className="flex flex-col w-full h-full  ">
      <div className="  flex justify-between">
        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-800 font-medium mb-4"
        >
          <FontAwesomeIcon icon={faLeftLong} className="mr-2" /> Back
        </button>

        {/* Tabs */}
        <div className="flex items-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFormType(tab.key)}
              className={`px-4 py-2 rounded-md transition-colors ${
                formType === tab.key
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-y-auto">
        {formType === "institutional_activity" && (
          <StudentAddAccomplishedInstitutional />
        )}
        {formType === "external_activity" && <StudentAddAccomplishedExternal />}
        {formType === "accomplishment" && <StudentAddAccomplishedProposal />}
      </div>
    </div>
  );
}
