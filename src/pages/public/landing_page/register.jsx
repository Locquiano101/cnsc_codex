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

  // Icons for each step
  const stepIcons = [
    faUsers,
    faUserTie,
    faCloudUploadAlt,
    faClipboardCheck,
    faEnvelope,
  ];

  // State
  const [registrationStep, setRegistrationStep] = useState(0);
  const [orgFormData, setOrgFormData] = useState({});
  const [documentFormData, setDocumentFormData] = useState({});

  // Handlers
  const handleNext = () => {
    if (registrationStep < steps.length - 1) {
      setRegistrationStep((prev) => prev + 1);
    }
  };

  const handleOrgInfoSubmit = (e) => {
    e.preventDefault();
    console.log("Organization Data:", orgFormData);
    handleNext();
  };

  const handleFileUploadSubmit = (uploadedFiles) => {
    setDocumentFormData(uploadedFiles);
    console.log("Uploaded files:", uploadedFiles);
    handleNext();
  };

  const handleEdit = () => setRegistrationStep(0);

  const handleFileNameUpdate = (key, fileName) => {
    // Your logic if needed
  };

  // Final submission function
  const handleFinalSubmit = async () => {
    const formDataToSubmit = new FormData();
    formDataToSubmit.append("org_username", orgFormData.organizationUsername);
    formDataToSubmit.append("org_password", orgFormData.organizationPassword);
    formDataToSubmit.append("adviser_username", orgFormData.adviserUsername);
    formDataToSubmit.append("adviser_password", orgFormData.adviserPassword);
    formDataToSubmit.append("org_name", orgFormData.organizationName);
    formDataToSubmit.append("org_email", orgFormData.organizationEmail);
    formDataToSubmit.append("org_acronym", orgFormData.organizationAcronym);
    formDataToSubmit.append("org_class", orgFormData.classification);
    formDataToSubmit.append("org_president", orgFormData.organizationPresident);

    // Classification-specific fields
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

    // Additional fields
    formDataToSubmit.append("orgFolder", orgFormData.organizationName);
    formDataToSubmit.append("orgDocumentClassification", "Accreditation");

    // Append files
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
        // Optionally include the file name
        formDataToSubmit.append(`${key}`, file.name);
      }
    });

    // Debug
    for (let [key, value] of formDataToSubmit.entries()) {
      console.log(key, value);
    }
    console.log("Final Org Form Data:", orgFormData);

    // Post with Axios
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

  const handleEmailConfirmation = (code) => {
    console.log("Entered confirmation code:", code);
    // Assume confirmation is successful
    handleFinalSubmit();
  };

  const handleResendEmail = () => {
    console.log("Resending confirmation email...");
    // Logic to resend
  };

  return (
    <div className="min-h-screen bg-[#E6E6E6]">
      {/* Header */}
      <div className="h-auto px-8 flex items-center bg-[#1C4060]">
        <img src="/general/cnsc_codex_ver_2.png" className="h-16" alt="logo" />
        <p className="text-white text-xl ml-4">Register Organization</p>
      </div>

      {/* ────────── PROGRESS BAR ────────── */}
      <div className="flex justify-center mt-8">
        {/* 
            Use a simple flex container with some gap 
            and NO flex-grow or fixed wide classes. 
          */}
        <div className="flex items-center justify-center">
          {steps.map((stepLabel, index) => {
            const isCompleted = index < registrationStep;
            const isActive = index === registrationStep;

            // Color logic
            let circleColor = "bg-gray-300"; // pending
            if (isCompleted) circleColor = "bg-green-500"; // completed
            else if (isActive) circleColor = "bg-blue-500"; // active

            // Determine the line color
            let lineColor = "bg-gray-300"; // pending
            if (index < registrationStep) lineColor = "bg-green-500";
            else if (index === registrationStep) lineColor = "bg-blue-500";

            return (
              <div key={index} className="flex items-center">
                {/* Step (circle + label + triangle) */}
                <div className="relative flex flex-col items-center w-fit">
                  <div
                    className={`w-18 h-18 rounded-full flex items-center justify-center text-white border-4 border-white ${circleColor}`}
                  >
                    <FontAwesomeIcon
                      icon={stepIcons[index]}
                      className="text-xl"
                    />
                  </div>
                  <span className="text-xs mt-2 font-bold text-center w-fit  text-ellipsis whitespace-nowrap overflow-hidden">
                    {stepLabel}
                  </span>
                  {isActive && (
                    <div
                      className="
                          absolute
                          top-full
                          mt-1
                          w-0
                          h-0
                          rotate-180
                          border-l-[30px]
                          border-l-transparent
                          border-r-[30px]
                          border-r-transparent
                          border-t-[30px]
                          border-t-white
                        "
                    />
                  )}
                </div>
                {/* Connecting line (if not the last step) */}
                {index < steps.length - 1 && (
                  <div className={`w-30 h-1 -mt-5 ${lineColor}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>
      {/* ────────── END PROGRESS BAR ────────── */}

      {/* Render the current step */}
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
