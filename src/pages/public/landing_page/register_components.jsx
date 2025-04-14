import React, { useState, useRef, useEffect } from "react";
import { ReturnButton, Submitbutton } from "../../../components/buttons";
import { ReusableFileUpload } from "../../../components/reusable_file_upload";
import SearchableDropdown from "../../../components/searchable_drop_down";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const departments = ["Department A", "Department B", "Department C"];
const courses = ["Course X", "Course Y", "Course Z"];

// Organization Component with Show/Hide Password indicator
export const OrganizationComponent = ({ formData, onChange, handleSubmit }) => {
  const [showOrgPassword, setShowOrgPassword] = useState(false);

  const OrganizationFormData = [
    {
      label: "Organization Username",
      id: "organizationUsername",
      colSpan: 3,
    },
    {
      label: "Organization Password",
      id: "organizationPassword",
      type: showOrgPassword ? "text" : "password",
      colSpan: 3,
    },
    {
      label: "Organization Name",
      id: "organizationName",
      colSpan: 4,
    },
    {
      label: "Organization Acronym",
      id: "organizationAcronym",
      colSpan: 2,
    },
    {
      label: "Organization President",
      id: "organizationPresident",
      colSpan: 3,
    },
    {
      label: "Organization Email",
      id: "organizationEmail",
      colSpan: 3,
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({
      ...formData,
      [name]: value,
    });
  };

  const toggleOrgPassword = () => setShowOrgPassword((prev) => !prev);

  const classification = formData.classification;

  const handleDepartmentChange = (selected) => {
    onChange({
      ...formData,
      department: selected,
    });
  };

  const handleCourseChange = (selected) => {
    onChange({
      ...formData,
      course: selected,
    });
  };

  return (
    <section className="mt-4">
      <form
        className="flex justify-center items-center"
        onSubmit={handleSubmit}
      >
        <div className="w-[95%]">
          <div className="pt-10 pl-10 pr-10 bg-white mt-4">
            <section>
              <div className="mb-4 font-semibold text-lg flex items-center">
                <h1 className="w-2/5 max-w-fit mr-3">
                  Organization Information
                </h1>
              </div>
              <div className="grid grid-cols-6 gap-x-2 gap-y-1">
                {OrganizationFormData.map(
                  ({ label, id, colSpan = 6, type = "text" }) => (
                    <div
                      className={`flex flex-col gap-1 col-span-${colSpan}`}
                      key={id}
                    >
                      <label htmlFor={id}>
                        {label} <span className="text-red-500">*</span>
                      </label>
                      {id === "organizationPassword" ? (
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
                                <FontAwesomeIcon icon={faEyeSlash} />
                                <span className="ml-1 text-sm">Hide</span>
                              </>
                            ) : (
                              <>
                                <FontAwesomeIcon icon={faEye} />
                              </>
                            )}
                          </button>
                        </div>
                      ) : (
                        <input
                          type={type}
                          id={id}
                          name={id}
                          className="border py-2 px-4 rounded-2xl"
                          value={formData[id] || ""}
                          onChange={handleChange}
                          required
                        />
                      )}
                    </div>
                  )
                )}

                <div className="col-span-6 flex">
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

                  {classification === "Local" && (
                    <div className="flex-1">
                      <div className="flex justify-between col-span-4 gap-4">
                        <div className="flex flex-col gap-1 flex-1">
                          <label>
                            Department <span className="text-red-500">*</span>
                          </label>
                          <SearchableDropdown
                            label="Department"
                            options={departments}
                            value={formData.department}
                            onChange={handleDepartmentChange}
                            placeholder="Select Department"
                          />
                        </div>
                        <div className="flex flex-col gap-1 flex-1">
                          <label>
                            Course <span className="text-red-500">*</span>
                          </label>
                          <SearchableDropdown
                            label="Course"
                            options={courses}
                            value={formData.course}
                            onChange={handleCourseChange}
                            placeholder="Select Course"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {classification === "System-wide" && (
                    <div className="flex-1">
                      <div className="flex flex-col gap-1 col-span-4">
                        <label htmlFor="specialization">
                          Specialization <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="specialization"
                          name="specialization"
                          className="border py-2 px-4 rounded-2xl"
                          value={formData.specialization || ""}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>

            <div className="w-full mt-2 gap-4 flex justify-end pt-10 pb-5">
              <Submitbutton />
            </div>
          </div>
        </div>
      </form>
    </section>
  );
};

// Adviser Component with Show/Hide Password indicator
export const AdviserComponent = ({
  formData,
  onChange,
  onReturn,
  handleSubmit,
}) => {
  const [showAdviserPassword, setShowAdviserPassword] = useState(false);

  const AdviserFormData = [
    {
      label: "Adviser Username",
      id: "adviserUsername",
      colSpan: 3,
    },
    {
      label: "Adviser Password",
      id: "adviserPassword",
      type: showAdviserPassword ? "text" : "password",
      colSpan: 3,
    },
    {
      label: "Adviser Name",
      id: "adviserName",
      colSpan: 3,
    },
    {
      label: "Adviser Email",
      id: "adviserEmail",
      colSpan: 3,
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({
      ...formData,
      [name]: value,
    });
  };

  const toggleAdviserPassword = () => setShowAdviserPassword((prev) => !prev);

  const handleAdviserDepartmentChange = (selected) => {
    onChange({
      ...formData,
      adviserDepartment: selected,
    });
  };

  return (
    <section className="mt-4">
      <form
        className="flex justify-center items-center"
        onSubmit={handleSubmit}
      >
        <div className="w-[95%]">
          <div className="pt-10 pl-10 pr-10 bg-white mt-4">
            <section>
              <div className="mb-4 font-semibold text-lg flex items-center">
                <h1 className="w-2/5 max-w-fit mr-3">Adviser Information</h1>
              </div>
              <div className="grid grid-cols-6 gap-x-2 gap-y-1">
                {AdviserFormData.map(
                  ({ label, id, colSpan = 6, type = "text" }) => (
                    <div
                      className={`flex flex-col gap-1 col-span-${colSpan}`}
                      key={id}
                    >
                      <label htmlFor={id}>
                        {label} <span className="text-red-500">*</span>
                      </label>
                      {id === "adviserPassword" ? (
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
                            onClick={toggleAdviserPassword}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none"
                          >
                            {showAdviserPassword ? (
                              <>
                                <FontAwesomeIcon icon={faEyeSlash} />
                                <span className="ml-1 text-sm">Hide</span>
                              </>
                            ) : (
                              <>
                                <FontAwesomeIcon icon={faEye} />
                              </>
                            )}
                          </button>
                        </div>
                      ) : (
                        <input
                          type={type}
                          id={id}
                          name={id}
                          className="border py-2 px-4 rounded-2xl"
                          value={formData[id] || ""}
                          onChange={handleChange}
                          required
                        />
                      )}
                    </div>
                  )
                )}
                <div className="col-span-6 flex">
                  <div className="flex flex-col gap-1 flex-1">
                    <label>
                      Department <span className="text-red-500">*</span>
                    </label>
                    <SearchableDropdown
                      label="Department"
                      options={departments}
                      value={formData.adviserDepartment}
                      onChange={handleAdviserDepartmentChange}
                      placeholder="Select Adviser Department"
                    />
                  </div>
                </div>
              </div>
            </section>

            <div className="w-full mt-2 gap-4 flex justify-end pt-10 pb-5">
              <ReturnButton onClick={onReturn} text="Return" />
              <Submitbutton />
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
  handleReviewSubmit,
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
                      {formData.department}
                    </p>
                    <p>
                      <span className="font-medium">Course:</span>{" "}
                      {formData.course}
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
                      className="w-40 p-4 bg-white rounded-lg shadow hover:shadow-xl transition duration-200 flex flex-col items-center"
                    >
                      <strong className="mb-3 text-gray-700">{key}</strong>
                      {file?.type?.startsWith("image/") ? (
                        <img
                          src={file ? URL.createObjectURL(file) : ""}
                          alt={file.name}
                          className="w-32 h-32 object-cover rounded-md"
                        />
                      ) : (
                        <div className="text-gray-600 text-center w-full whitespace-normal break-words">
                          📄 {file.name}
                        </div>
                      )}
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
                onClick={handleReviewSubmit}
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

// Email Confirmation Component (unchanged)
export const EmailConfirmationComponent = ({ email, onConfirm, onResend }) => {
  const [code, setCode] = useState("");
  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(code);
  };
  return (
    <div className="w-full min-h-full flex justify-center ">
      <div className="w-[90%] mt-4 ">
        <section className="mt-4 p-4 bg-white">
          <div className="font-semibold text-lg flex items-center mb-4">
            <h1 className="w-2/5 max-w-fit mr-3">Email Confirmation</h1>
          </div>
          <p className="text-sm mb-4">
            A confirmation code has been sent to <strong>{email}</strong>.
            Please enter the code below to verify your email address.
          </p>
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
