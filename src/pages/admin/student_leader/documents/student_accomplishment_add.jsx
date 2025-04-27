import { useEffect, useState } from "react";
import PopUp from "../../../../components/pop-ups";
import {
  ReusableFileUpload,
  ReusableMultiFileUpload,
} from "../../../../components/reusable_file_upload";
import { API_ROUTER } from "../../../../App";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeftLong, faOilCan } from "@fortawesome/free-solid-svg-icons";

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
        const user = JSON.parse(userString); // Parse first!

        console.log(user);
        if (user?.organization?._id) {
          const orgId = user.organization._id;
          const orgName = user.organization.org_name;

          console.log("Organization ID:", orgId, orgName);

          setFormDataState((prev) => ({
            ...prev,
            organization: orgId,
            organization_name: orgName,
          }));
        } else {
          console.warn("Organization ID is missing from user data");
        }
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
    formData.append("activity_type", "Instutional");

    // 2) metadata
    formData.append("orgFolder", formDataState.organization_name);
    formData.append("orgDocumentClassification", "InstutionalAccomplishment");
    formData.append("orgDocumentTitle", formDataState.event_title);

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
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [formDataState, setFormDataState] = useState({
    event_title: "",
    event_description: "",
    event_date: "",
    organization: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      try {
        const user = JSON.parse(userString); // Parse first!

        console.log(user);
        if (user?.organization?._id) {
          const orgId = user.organization._id;
          const orgName = user.organization.org_name;

          console.log("Organization ID:", orgId, orgName);

          setFormDataState((prev) => ({
            ...prev,
            organization: orgId,
            organization_name: orgName,
          }));
        } else {
          console.warn("Organization ID is missing from user data");
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

  const textFields = [
    { label: "Event Title", id: "event_title", type: "text" },
    { label: "Event Description", id: "event_description", type: "textarea" },
    { label: "Event Date", id: "event_date", type: "date" },
  ];

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
    setSubmitError(null);
    setSubmitSuccess(false);

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

    // Debug
    for (let [key, value] of formData.entries()) {
      console.table(`${key}:`, value);
    }

    try {
      // Assuming you have a route for external accomplishments
      const { data } = await axios.post(
        `${API_ROUTER}/submit-external-accomplishment`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log("Server response:", data);
      setSubmitSuccess(true);

      // Reset form after successful submission
      setFormDataState({
        event_title: "",
        event_description: "",
        event_date: "",
        organization_name: "",
      });
      setUploadedFiles({});
    } catch (error) {
      console.error("Submission failed:", error);
      setSubmitError(
        error.message || "Submission failed. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section>
      <h1 className="text-2xl font-bold text-black text-center mb-4">
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
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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
        } else {
          console.warn("Organization ID is missing from user data");
        }
      } catch (err) {
        console.error("Failed parsing user from storage:", err);
      }
    }
  }, []);

  const textFields = [
    { label: "Event Title", id: "event_title", type: "text" },
    { label: "Event Description", id: "event_description", type: "textarea" },
    { label: "Event Date", id: "event_date", type: "date" },
  ];

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
    setSubmitError(null);
    setSubmitSuccess(false);

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

    // Debug
    for (let [key, value] of formData.entries()) {
      console.table(`${key}:`, value);
    }

    try {
      // Assuming you have a route for external accomplishments
      const { data } = await axios.post(
        `${API_ROUTER}/submit-proposed-accomplishment`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log("Server response:", data);
      setSubmitSuccess(true);
    } catch (error) {
      console.error("Submission failed:", error);
      setSubmitError(
        error.message || "Submission failed. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <section className="p-4">
      <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
        Add Accomplished Action Plan
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

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
        <div className="space-y-4 bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-black">
            Activity Information
          </h2>
          {textFields.map(({ label, id, type }) => (
            <div key={id} className="mb-4">
              <label htmlFor={id} className="block mb-1 text-black font-medium">
                {label} <span className="text-red-500">*</span>
              </label>
              {type === "textarea" ? (
                <textarea
                  id={id}
                  name={id}
                  value={formDataState[id]}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-black mb-4">Documents</h2>
          <div className="border border-gray-200 p-4 rounded-md">
            <ReusableFileUpload
              fields={singleFileFields}
              onFileChange={handleFileChange}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-black mb-4">
            Additional Files
          </h2>
          <div className="border border-gray-200 p-4 rounded-md">
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
            className={`bg-blue-600 text-white px-6 py-2 rounded-md text-base font-medium transition ${
              isSubmitting
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit Activity"}
          </button>
        </div>
      </form>
    </section>
  );
}
export default function AddStudentAccomplishmentReport({ onBack }) {
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
        {formType === "accomplishment" && <StudentAddAccomplishedProposal />}
      </div>
    </section>
  );
}
