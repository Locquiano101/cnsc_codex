import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faUserTie,
  faCloudUploadAlt,
  faClipboardCheck,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import {
  FileUploadComponent,
  OrganizationComponent,
  ReviewComponent,
  EmailConfirmationComponent,
  AdviserComponent,
} from "./register_components";
import { API_ROUTER } from "/src/App.jsx";
import axios from "axios";

// Define accepted file types for each file field
const fileFields = {
  "org logo": { label: "Organization Logo", accept: "photos/*" },
  "Constitution & By-laws": {
    label: "Constitution & By-laws",
    accept: ".pdf,.doc,.docx",
  },
  "Pledge Against Hazing": {
    label: "Pledge Against Hazing",
    accept: ".pdf,.doc,.docx",
  },
  Rosters: { label: "Rosters", accept: ".pdf,.doc,.docx" },
  "President Info Sheet": {
    label: "President Info Sheet",
    accept: ".pdf,.doc,.docx",
  },
  "Financial Report": { label: "Financial Report", accept: ".pdf,.doc,.docx" },
  "Collectible Fees": { label: "Collectible Fees", accept: ".pdf,.doc,.docx" },
  "Commitment Statement": {
    label: "Commitment Statement",
    accept: ".pdf,.doc,.docx",
  },
  Memorandum: { label: "Memorandum", accept: ".pdf,.doc,.docx" },
  "Action Plan": { label: "Action Plan", accept: ".pdf,.doc,.docx" },
};

export default function RegisterSection() {
  // Define the step labels
  const steps = [
    "Organization",
    "Adviser",
    "File Upload",
    "Review",
    "Email confirmation",
  ];

  // Define state for the current registration step, organization form, and documents.
  const [registrationStep, setRegistrationStep] = useState(0);
  const [orgFormData, setOrgFormData] = useState({});
  const [documentFormData, setDocumentFormData] = useState({});

  // Handlers for advancing steps in the registration process.
  const handleNext = () => {
    if (registrationStep < steps.length - 1) {
      setRegistrationStep((prev) => prev + 1);
    }
  };

  // Handle organization information form submission.
  const handleOrgInfoSubmit = (e) => {
    e.preventDefault();
    console.log("Organization Data:", orgFormData);
    handleNext();
  };

  // Handle file upload submission.
  const handleFileUploadSubmit = (uploadedFiles) => {
    setDocumentFormData(uploadedFiles);
    console.log("Uploaded files:", uploadedFiles);
    handleNext();
  };

  // Allow editing organization information.
  const handleEdit = () => setRegistrationStep(0);

  // Stub for file name update logic.
  const handleFileNameUpdate = (key, fileName) => {
    // Your implementation if the file name needs to be updated.
  };

  // Final submission function after email confirmation.
  const handleFinalSubmit = async () => {
    const formDataToSubmit = new FormData();

    // Append organization and adviser text fields.
    formDataToSubmit.append("org_username", orgFormData.organizationUsername);
    formDataToSubmit.append("org_password", orgFormData.organizationPassword);
    formDataToSubmit.append("adviser_username", orgFormData.adviserUsername);
    formDataToSubmit.append("adviser_password", orgFormData.adviserPassword);
    formDataToSubmit.append("org_name", orgFormData.organizationName);
    formDataToSubmit.append("org_email", orgFormData.organizationEmail);
    formDataToSubmit.append("org_acronym", orgFormData.organizationAcronym);
    formDataToSubmit.append("org_class", orgFormData.classification);
    formDataToSubmit.append("org_president", orgFormData.organizationPresident);

    // Classification-specific fields.
    if (orgFormData.classification === "Local") {
      formDataToSubmit.append("department", orgFormData.department);
      formDataToSubmit.append("course", orgFormData.course);
    } else if (orgFormData.classification === "System-wide") {
      formDataToSubmit.append("specialization", orgFormData.specialization);
    }

    formDataToSubmit.append("adviser_name", orgFormData.adviserName);
    formDataToSubmit.append("adviser_email", orgFormData.adviserEmail);
    formDataToSubmit.append(
      "adviser_department",
      orgFormData.adviserDepartment
    );

    if (orgFormData.accreditation_type) {
      formDataToSubmit.append(
        "accreditation_type",
        orgFormData.accreditation_type
      );
    }

    // Additional fields.
    formDataToSubmit.append("orgFolder", orgFormData.organizationName);
    formDataToSubmit.append("orgDocumentClassification", "Accreditation");

    // Append files from documentFormData.
    Object.entries(documentFormData).forEach(([key, file]) => {
      if (file && file.type) {
        if (file.type.startsWith("image/")) {
          formDataToSubmit.append("photo", file);
          console.log("Photo appended:", key);
        } else if (
          file.type === "application/pdf" ||
          file.type === "application/msword" ||
          file.type ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
          formDataToSubmit.append("document", file);
          console.log("Document appended:", key);
        } else {
          formDataToSubmit.append(key, file);
          console.log("Other file appended:", key);
        }
        // Optionally include the file name.
        formDataToSubmit.append(`${key}`, file.name);
      }
    });

    // Debug log for form data entries.
    for (let [key, value] of formDataToSubmit.entries()) {
      console.log(key, value);
    }
    console.log("Final Org Form Data:", orgFormData);

    // Submit the data using axios.
    try {
      const response = await axios.post(
        `${API_ROUTER}/accredit`,
        formDataToSubmit,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (response.status === 200) {
        console.log("Submitted successfully!");
        alert("Submission successful!");
      } else {
        console.error("Submission error", response);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  // Handle email confirmation and proceed with final submission.
  const handleEmailConfirmation = (code) => {
    console.log("Entered confirmation code:", code);
    // Assume confirmation is successful and then submit final data.
    handleFinalSubmit();
  };

  // Handler to re-send the confirmation email.
  const handleResendEmail = () => {
    console.log("Resending confirmation email...");
    // Implement your email re-send logic (API call, etc.)
  };

  // Define the icons for each registration step.
  const stepIcons = [
    <FontAwesomeIcon icon={faUsers} className="text-2xl" />,
    <FontAwesomeIcon icon={faUserTie} className="text-2xl" />,
    <FontAwesomeIcon icon={faCloudUploadAlt} className="text-2xl" />,
    <FontAwesomeIcon icon={faClipboardCheck} className="text-2xl" />,
    <FontAwesomeIcon icon={faEnvelope} className="text-2xl" />,
  ];

  return (
    <div className="min-h-screen bg-[#E6E6E6] ">
      {/* Header */}
      <div className="h-auto px-8 flex items-center bg-cnsc-primary-color">
        <img src="/general/cnsc_codex_ver_2.png" className="h-16" alt="logo" />
        <p className="text-white text-xl ml-4">Register Organization</p>
      </div>

      {/* Progress Bar */}
      <div className="relative container mx-auto py-8 w-[80%] pb-7">
        {/* Base horizontal line */}
        <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-300"></div>
        {/* Completed portion overlay */}
        <div
          className="absolute top-1/2 left-0 h-2 bg-green-500"
          style={{ width: `${(registrationStep / (steps.length - 1)) * 100}%` }}
        ></div>
        {/* Circles with icons */}
        <div className="relative flex justify-between items-center">
          {steps.map((step, index) => {
            const isCompleted = index < registrationStep;
            const isActive = index === registrationStep;
            let circleColor = "bg-gray-400";
            if (isCompleted) {
              circleColor = "bg-green-500";
            } else if (isActive) {
              circleColor = "bg-teal-500";
            }
            return (
              <div key={index} className="flex flex-col relative items-center">
                {/* Circle with Font Awesome icon */}
                <div
                  className={`h-15 w-15 rounded-full flex items-center justify-center text-white font-semibold border-2 border-white ${circleColor}`}
                >
                  {stepIcons[index]}
                </div>
                {/* Label shown below the circle */}
                <span className="absolute -bottom-8 w-100 mt-2 text-xs text-center font-bold">
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Render the component for the current registration step */}
      {registrationStep === 0 && (
        <OrganizationComponent
          formData={orgFormData}
          onChange={setOrgFormData}
          handleSubmit={handleOrgInfoSubmit}
        />
      )}
      {registrationStep === 1 && (
        <AdviserComponent
          formData={orgFormData}
          onChange={setOrgFormData}
          handleSubmit={handleOrgInfoSubmit}
          onReturn={() => setRegistrationStep(0)}
        />
      )}
      {registrationStep === 2 && (
        <FileUploadComponent
          fields={fileFields}
          initialFiles={documentFormData}
          handleSubmit={handleFileUploadSubmit}
          onReturn={() => setRegistrationStep(1)}
        />
      )}
      {registrationStep === 3 && (
        <ReviewComponent
          formData={orgFormData}
          uploadedFiles={documentFormData}
          onEdit={handleEdit}
          onFileNameUpdate={handleFileNameUpdate}
          onFinalSubmit={() => setRegistrationStep(4)}
        />
      )}
      {registrationStep === 4 && (
        <EmailConfirmationComponent
          email={orgFormData.organizationEmail}
          onConfirm={handleEmailConfirmation}
          onResend={handleResendEmail}
        />
      )}
    </div>
  );
}
