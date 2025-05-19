import React, { useState, useEffect } from "react";
import { ReturnButton, Submitbutton } from "../../../components/buttons";
import { ReusableFileUpload } from "../../../components/reusable_file_upload";
import { API_ROUTER } from "../../../App";

import {
  CollegeCourseDepartments,
  College,
} from "../../../components/programs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

// ——— Password‐strength helpers ———
const calculatePasswordStrength = (password) => {
  if (!password) return "";
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  if (strength <= 2) return "Weak";
  if (strength <= 4) return "Medium";
  return "Strong";
};

const getStrengthColorClass = (strength) => {
  if (strength === "Weak") return "text-red-500";
  if (strength === "Medium") return "text-yellow-500";
  if (strength === "Strong") return "text-green-500";
  return "";
};

const RetrieveAllUsername = async () => {
  try {
    const response = await axios.get(`${API_ROUTER}/get-all-username`);
    console.log(response.data);
    return response.data;
  } catch (err) {
    console.error("Login failed", err.response?.data || err.message);
    return null;
  }
};

export const OrganizationComponent = ({ formData, onChange, handleSubmit }) => {
  const [showOrgPassword, setShowOrgPassword] = useState(false);
  const [usedUsernames, setUsedUsernames] = useState([]);
  const [usernameError, setUsernameError] = useState("");
  const [orgPasswordStrength, setOrgPasswordStrength] = useState("");

  // Fetch used usernames once when the component mounts.
  useEffect(() => {
    const fetchData = async () => {
      const data = await RetrieveAllUsername();
      if (data) {
        const usernamesOnly = data.map((item) => item.username);
        setUsedUsernames(usernamesOnly);
      }
    };
    fetchData();
  }, []);

  // Array of form field configuration.
  const OrganizationFormData = [
    {
      label: "Organization Username",
      id: "organizationUsername",
    },
    {
      label: "Organization Password",
      id: "organizationPassword",
      type: showOrgPassword ? "text" : "password",
    },
    {
      label: "Organization Name",
      id: "organizationName",
      colSpan: 4,
    },
    {
      label: "Organization Acronym",
      id: "organizationAcronym",
      colSpan: 1,
    },
    {
      label: "Organization President",
      id: "organizationPresident",
    },
    {
      label: "Organization Email",
      id: "organizationEmail",
      type: "email",
    },
  ];

  const checkUsernameExists = (value) => {
    return usedUsernames.some(
      (usedName) => usedName.trim().toLowerCase() === value.trim().toLowerCase()
    );
  };

  // Generic change handler for text/radio inputs.
  const handleChange = (e) => {
    const { name, value } = e.target;

    // —— New: update strength on password change
    if (name === "organizationPassword") {
      setOrgPasswordStrength(calculatePasswordStrength(value));
    }

    if (name === "organizationUsername") {
      if (checkUsernameExists(value)) {
        setUsernameError(
          "Username already taken. Please choose a different one."
        );
      } else {
        setUsernameError("");
      }
    }

    onChange({
      ...formData,
      [name]: value,
    });
  };

  // Toggle the password visibility.
  const toggleOrgPassword = () => setShowOrgPassword((prev) => !prev);

  const classification = formData.classification;

  // Submit handler that performs a final duplicate check.
  const onLocalSubmit = (e) => {
    const username = formData.organizationUsername || "";
    if (checkUsernameExists(username)) {
      setUsernameError(
        "Username already taken. Please choose a different one."
      );
      e.preventDefault(); // Prevents submission if duplicate exists.
      return;
    }
    handleSubmit(e);
  };

  return (
    <section className="mt-4">
      <form
        className="flex justify-center items-center"
        onSubmit={onLocalSubmit}
      >
        <div className="w-[90%]">
          <div className="pt-10 pl-10 pr-10 bg-white mt-4">
            <section>
              <div className="mb-4 font-semibold text-lg flex items-center">
                <h1 className="w-2/5 max-w-fit mr-3">
                  Organization Information
                </h1>
              </div>
              <div>
                <div className="grid grid-cols-6 gap-y-2 gap-x-4">
                  {OrganizationFormData.map(
                    ({ label, id, colSpan = 3, type = "text" }) => (
                      <div
                        className={`flex flex-col gap-1 col-span-${colSpan}`}
                        key={id}
                      >
                        <label htmlFor={id}>
                          {label} <span className="text-red-500">*</span>
                        </label>
                        {id === "organizationPassword" ? (
                          <>
                            <div className="relative">
                              <input
                                type={type}
                                id={id}
                                name={id}
                                autoComplete="new-password"
                                className="border py-2 px-4 rounded-2xl w-full"
                                value={formData[id] || ""}
                                onChange={handleChange}
                                required
                              />
                              <button
                                type="button"
                                onClick={toggleOrgPassword}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none"
                              >
                                {showOrgPassword ? (
                                  <>
                                    <i className="fa fa-eye"></i>
                                    <span className="ml-1 text-sm">Hide</span>
                                  </>
                                ) : (
                                  <>
                                    <i className="fa fa-eye-slash"></i>
                                    <span className="ml-1 text-sm">Show</span>
                                  </>
                                )}
                              </button>
                            </div>
                            {/* —— New: password-strength indicator */}
                            {orgPasswordStrength && (
                              <span
                                className={`text-xs ${getStrengthColorClass(
                                  orgPasswordStrength
                                )}`}
                              >
                                Password Strength: {orgPasswordStrength}
                              </span>
                            )}
                          </>
                        ) : (
                          <>
                            <input
                              type={type}
                              id={id}
                              name={id}
                              className="border py-2 px-4 rounded-2xl"
                              value={formData[id] || ""}
                              onChange={handleChange}
                              required
                            />
                            {/* Render error message under the username field */}
                            {id === "organizationUsername" && usernameError && (
                              <span className="text-red-500 text-xs">
                                {usernameError}
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    )
                  )}
                </div>

                <div className="col-span-6 flex mt-4">
                  <div className="flex flex-col w-2/5 gap-1">
                    <label>
                      Classification <span className="text-red-500">*</span>
                    </label>
                    <div className="flex h-full">
                      {["Local", "System-wide"].map((option) => (
                        <div
                          key={option}
                          className="flex items-center gap-2 flex-1"
                        >
                          <input
                            type="radio"
                            id={`classification${option}`}
                            name="classification"
                            value={option}
                            checked={classification === option}
                            onChange={handleChange}
                            className="h-6 w-6"
                            required
                          />
                          <label htmlFor={`classification${option}`}>
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* For Local classification, include CollegeCourseDepartments */}
                  {classification === "Local" && (
                    <div className="flex-1">
                      <CollegeCourseDepartments
                        formData={formData}
                        onChange={onChange}
                      />
                    </div>
                  )}
                  {classification === "System-wide" && (
                    <div className="flex-1">
                      <div className="flex flex-col gap-1 col-span-4">
                        <label htmlFor="specialization">
                          Specialization <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="specialization"
                          name="specialization"
                          className="border py-2 px-4 rounded-2xl"
                          value={formData.specialization || ""}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select Specialization</option>
                          <option value="Academic">Academic</option>
                          <option value="Lifestyle">Lifestyle</option>
                          <option value="Fraternity/Sorority">
                            Fraternity/Sorority
                          </option>
                          <option value="Environmental">Environmental</option>
                          <option value="Social-Civic">Social-Civic</option>
                          <option value="Spiritual or religious">
                            Spiritual or religious
                          </option>
                          <option value="Student government">
                            Student government
                          </option>
                          <option value="Adviser Academic Rank">
                            Adviser Academic Rank
                          </option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>

            <div className="w-full mt-2 gap-4 flex justify-end pt-10 pb-5">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="w-32 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow-md transition-all"
              >
                Cancel
              </button>
              <Submitbutton disabled={!!usernameError} />
            </div>
          </div>
        </div>
      </form>
    </section>
  );
};

export const AdviserComponent = ({
  formData,
  onChange,
  onReturn,
  handleSubmit,
}) => {
  const [showAdviserPassword, setShowAdviserPassword] = useState(false);
  const [usedAdviserUsernames, setUsedAdviserUsernames] = useState([]);
  const [usernameError, setUsernameError] = useState("");
  const [adviserPasswordStrength, setAdviserPasswordStrength] = useState("");

  // Retrieve adviser usernames once when the component mounts.
  useEffect(() => {
    const fetchData = async () => {
      const data = await RetrieveAllUsername();
      if (data) {
        const usernamesOnly = data.map((item) => item.username);
        setUsedAdviserUsernames(usernamesOnly);
      }
    };
    fetchData();
  }, []);

  const checkAdviserUsernameExists = (value) => {
    const normalizedInput = value.trim().toLowerCase();
    return usedAdviserUsernames.some(
      (u) => u.trim().toLowerCase() === normalizedInput
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // ← New: update strength on password change
    if (name === "adviserPassword") {
      setAdviserPasswordStrength(calculatePasswordStrength(value));
    }

    // existing username‐duplicate logic
    if (name === "adviserUsername") {
      if (checkAdviserUsernameExists(value)) {
        setUsernameError(
          "Adviser username already taken. Please choose a different one."
        );
      } else {
        setUsernameError("");
      }
    }

    onChange({
      ...formData,
      [name]: value,
    });
  };

  const toggleAdviserPassword = () => setShowAdviserPassword((prev) => !prev);

  const handleCollegeChange = (collegeData) => {
    onChange({
      ...formData,
      ...collegeData,
    });
  };

  const onLocalSubmit = (e) => {
    e.preventDefault();
    const username = formData.adviserUsername || "";
    if (checkAdviserUsernameExists(username)) {
      setUsernameError(
        "Adviser username already taken. Please choose a different one."
      );
      return;
    }
    handleSubmit(e);
  };

  return (
    <section className="mt-4">
      <form
        className="flex justify-center items-center"
        onSubmit={onLocalSubmit}
      >
        <div className="w-[90%]">
          <div className="pt-10 pl-10 pr-10 bg-white shadow-2xl mt-4 pb-5">
            {/* Adviser Section */}
            <section className="mt-4">
              <h1 className="mb-2 font-semibold text-lg">
                Adviser Information
              </h1>

              {/* Adviser Name & Email Row */}
              <div className="col-span-6 grid grid-cols-2 gap-4">
                {/* Adviser Name */}
                <div className="flex flex-col gap-1">
                  <label htmlFor="adviserName">
                    Adviser Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="adviserName"
                    name="adviserName"
                    className="border py-2 px-4 rounded-2xl"
                    value={formData.adviserName || ""}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Adviser Email */}
                <div className="flex flex-col gap-1">
                  <label htmlFor="adviserEmail">
                    Adviser Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="adviserEmail"
                    name="adviserEmail"
                    className="border py-2 px-4 rounded-2xl"
                    value={formData.adviserEmail || ""}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-6 gap-x-2 gap-y-1">
                {/* Adviser Username */}
                <div className="col-span-3 flex flex-col gap-1">
                  <label htmlFor="adviserUsername">
                    Adviser Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="adviserUsername"
                    name="adviserUsername"
                    className="border py-2 px-4 rounded-2xl"
                    value={formData.adviserUsername || ""}
                    onChange={handleChange}
                    required
                  />
                  {usernameError && (
                    <span className="text-red-500 text-xs">
                      {usernameError}
                    </span>
                  )}
                </div>

                {/* Adviser Password */}
                <div className="col-span-3 flex flex-col gap-1">
                  <label htmlFor="adviserPassword">
                    Adviser Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showAdviserPassword ? "text" : "password"}
                      id="adviserPassword"
                      name="adviserPassword"
                      className="border py-2 px-4 rounded-2xl w-full"
                      value={formData.adviserPassword || ""}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      onClick={toggleAdviserPassword}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showAdviserPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  {/* ← New: password‐strength indicator */}
                  {adviserPasswordStrength && (
                    <span
                      className={`text-xs ${getStrengthColorClass(
                        adviserPasswordStrength
                      )}`}
                    >
                      Password Strength: {adviserPasswordStrength}
                    </span>
                  )}
                </div>

                {/* Adviser Department */}
                <div className="col-span-6 flex flex-col gap-1 ">
                  <College formData={formData} onChange={handleCollegeChange} />
                </div>
              </div>
            </section>

            {/* Submit Section */}
            <div className="mt-10 flex justify-end gap-4">
              <ReturnButton onClick={onReturn} text="Return" />
              <Submitbutton disabled={!!usernameError} />
            </div>
          </div>
        </div>
      </form>
    </section>
  );
};

// File Upload Component (unchanged)
export const FileUploadComponent = ({
  fields,
  handleSubmit,
  onReturn,
  initialFiles = {},
}) => {
  const [uploadedFiles, setUploadedFiles] = useState(initialFiles);

  useEffect(() => {
    setUploadedFiles(initialFiles);
  }, [initialFiles]);

  const handleFileChange = (fieldKey, files) => {
    if (!files || files.length === 0 || !files[0]) {
      setUploadedFiles((prev) => {
        const updated = { ...prev };
        delete updated[fieldKey];
        return updated;
      });
      return;
    }
    setUploadedFiles((prev) => ({ ...prev, [fieldKey]: files[0] }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit(uploadedFiles);
  };

  return (
    <section>
      <form
        onSubmit={onSubmit}
        className="space-y-4 flex flex-col items-center my-5"
      >
        <div className="w-[90%]">
          <div className="p-4 bg-white shadow-2xl mt-3">
            <ReusableFileUpload
              fields={fields}
              onFileChange={handleFileChange}
            />
          </div>
          <div className="w-full gap-4 flex justify-end my-5">
            <ReturnButton onClick={onReturn} text="Return" />
            <Submitbutton />
          </div>
          <hr className="w-full" />
        </div>
      </form>
    </section>
  );
};

// Review Component (all inputs are now shown in plain text)
export const ReviewComponent = ({
  formData,
  uploadedFiles,
  onEdit,
  onFinalSubmit,
}) => {
  return (
    <div className="min-h-screen bg-[#E6E6E6] flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-8 ">
            <h1 className="text-2xl font-bold mb-6 text-center">
              Review Information
            </h1>

            {/* Organization Information */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">
                Organization Information
              </h2>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <p>
                  <span className="font-medium">Name:</span>{" "}
                  {formData.organizationName}
                </p>
                <p>
                  <span className="font-medium">Acronym:</span>{" "}
                  {formData.organizationAcronym}
                </p>
                <p>
                  <span className="font-medium">President:</span>{" "}
                  {formData.organizationPresident}
                </p>
                <p>
                  <span className="font-medium">Email:</span>{" "}
                  {formData.organizationEmail}
                </p>
                <p>
                  <span className="font-medium">Classification:</span>{" "}
                  {formData.classification}
                </p>
                {formData.classification === "Local" && (
                  <>
                    <p>
                      <span className="font-medium">Department:</span>{" "}
                      {formData.organizationDepartment}
                    </p>
                    <p>
                      <span className="font-medium">Course:</span>{" "}
                      {formData.organizationCourse}
                    </p>
                  </>
                )}
                {formData.classification === "System-wide" && (
                  <p>
                    <span className="font-medium">Specialization:</span>{" "}
                    {formData.specialization}
                  </p>
                )}
              </div>
            </div>

            {/* Organization Account */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">
                Organization Account
              </h2>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <p>
                  <span className="font-medium">Username:</span>{" "}
                  {formData.organizationUsername}
                </p>
                <p>
                  <span className="font-medium">Password:</span>{" "}
                  {formData.organizationPassword}
                </p>
              </div>
            </div>

            {/* Adviser Information */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">
                Adviser Information
              </h2>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <p>
                  <span className="font-medium">Name:</span>{" "}
                  {formData.adviserName}
                </p>
                <p>
                  <span className="font-medium">Email:</span>{" "}
                  {formData.adviserEmail}
                </p>
                <p>
                  <span className="font-medium">Department:</span>{" "}
                  {formData.adviserDepartment}
                </p>
                <p>
                  <span className="font-medium">Username:</span>{" "}
                  {formData.adviserUsername}
                </p>
                <p>
                  <span className="font-medium">Password:</span>{" "}
                  {formData.adviserPassword}
                </p>
              </div>
            </div>

            {/* Uploaded Files */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 border-b border-gray-300 pb-2 mb-6 text-center">
                Uploaded Files
              </h2>
              <div className="flex flex-wrap gap-6 justify-center">
                {uploadedFiles && Object.keys(uploadedFiles).length > 0 ? (
                  Object.entries(uploadedFiles).map(([key, file]) => (
                    <div
                      key={key}
                      className="flex-1 min-w-50 p-4 bg-white rounded-lg shadow hover:shadow-black transition duration-200 flex flex-col items-center text-center gap-2"
                    >
                      <h3 className="text-gray-800 font-semibold w-full whitespace-normal break-words">
                        {key}
                      </h3>
                      <FontAwesomeIcon
                        icon={faFile}
                        className="text-[48px] py-2 text-cnsc-accent-1-color"
                      />
                      <p className="text-sm text-gray-700 w-full whitespace-normal break-words">
                        {file.name}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 text-center">No files uploaded</p>
                )}
              </div>
            </div>

            {/* Edit & Submit Buttons */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onEdit}
                className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-black font-semibold rounded-lg"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={onFinalSubmit}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
              >
                Submit Final
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const EmailConfirmationComponent = ({ email, onConfirm, onResend }) => {
  const [code, setCode] = useState("");
  const [sending, setSending] = useState(true);

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  // Send verification email on mount
  useEffect(() => {
    const submitForm = async () => {
      setSending(true);
      try {
        const response = await axios.post(
          `${API_ROUTER}/send-verification-accreditation`,
          { org_email: email },
          { headers: { "Content-Type": "application/json" } }
        );
        if (response.status === 200) {
          console.log("Verification code sent successfully!");
        } else {
          console.error("Error in sending verification code:", response);
        }
      } catch (error) {
        console.error("Error submitting the verification request:", error);
      } finally {
        setSending(false);
      }
    };

    submitForm();
  }, [email]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(code);
  };

  return (
    <div className="w-full min-h-full flex justify-center">
      <div className="w-[90%] mt-4">
        <section className="mt-4 p-4 bg-white">
          <div className="font-semibold text-lg flex items-center mb-4">
            <h1 className="w-2/5 max-w-fit mr-3">Email Confirmation</h1>
          </div>

          {sending ? (
            <div className="w-full bg-gray-200 h-2 rounded-full mb-4 overflow-hidden">
              <div className="bg-blue-600 h-full animate-pulse w-full" />
            </div>
          ) : (
            <p className="text-sm mb-4">
              A confirmation code has been sent to <strong>{email}</strong>.
              Please enter the code below to verify your email address.
            </p>
          )}

          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="confirmationCode">Confirmation Code</label>
              <input
                type="text"
                id="confirmationCode"
                name="confirmationCode"
                className="border py-2 px-4 rounded-2xl"
                value={code}
                onChange={handleCodeChange}
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={onResend}
                className="text-blue-600 text-sm underline"
              >
                Resend Code
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-2xl"
              >
                Confirm Email
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};
