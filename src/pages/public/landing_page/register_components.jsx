import React, { useState, useRef, useEffect } from "react";
import { ReturnButton, Submitbutton } from "../../../components/buttons";
import { ReusableFileUpload } from "../../../components/reusable_file_upload";

import SearchableDropdown from "../../../components/searchable_drop_down";

export const OrganizationComponent = ({ formData, onChange, handleSubmit }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({
      ...formData,
      [name]: value,
    });
  };

  const classification = formData.classification;

  const departments = ["Department A", "Department B", "Department C"];
  const courses = ["Course X", "Course Y", "Course Z"];

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
        <div className="w-[90%]">
          <div className=" pt-10  pl-10 pr-10 bg-white mt-2">
            {/* Organization Section */}
            <section>
              <div className="mb-4 font-semibold text-lg flex items-center">
                <h1 className="w-2/5 max-w-fit mr-3">
                  Organization Information
                </h1>
              </div>
              <div className="grid grid-cols-6 gap-x-2 gap-y-1">
                {/* Name */}
                <div className="flex flex-col gap-1 col-span-3">
                  <label htmlFor="organizationUsername">
                    Organization UserName
                  </label>
                  <input
                    type="text"
                    id="organizationUsername"
                    name="organizationUsername"
                    className="border py-2 px-4 rounded-2xl"
                    value={formData.organizationUsername || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col gap-1 col-span-3">
                  <label htmlFor="organizationPassword">
                    Organization Password
                  </label>
                  <input
                    type="password"
                    id="organizationPassword"
                    name="organizationPassword"
                    className="border py-2 px-4 rounded-2xl"
                    value={formData.organizationPassword || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col gap-1 col-span-4">
                  <label htmlFor="organizationName">Organization Name</label>
                  <input
                    type="text"
                    id="organizationName"
                    name="organizationName"
                    className="border py-2 px-4 rounded-2xl"
                    value={formData.organizationName || ""}
                    onChange={handleChange}
                  />
                </div>
                {/* Acronym */}
                <div className="flex flex-col gap-1 col-span-2">
                  <label htmlFor="organizationAcronym">
                    Organization Acronym
                  </label>
                  <input
                    type="text"
                    id="organizationAcronym"
                    name="organizationAcronym"
                    className="border py-2 px-4 rounded-2xl"
                    value={formData.organizationAcronym || ""}
                    onChange={handleChange}
                  />
                </div>
                {/* President */}
                <div className="flex flex-col gap-1 col-span-3">
                  <label htmlFor="organizationPresident">
                    Organization President
                  </label>
                  <input
                    type="text"
                    id="organizationPresident"
                    name="organizationPresident"
                    className="border py-2 px-4 rounded-2xl"
                    value={formData.organizationPresident || ""}
                    onChange={handleChange}
                  />
                </div>
                {/* Email */}
                <div className="flex flex-col gap-1 col-span-3">
                  <label htmlFor="organizationEmail">Organization Email</label>
                  <input
                    type="text"
                    id="organizationEmail"
                    name="organizationEmail"
                    className="border py-2 px-4 rounded-2xl"
                    value={formData.organizationEmail || ""}
                    onChange={handleChange}
                  />
                </div>
                {/* Code */}
                {/* Classification */}

                <div className="col-span-6  flex">
                  {/* Conditional Fields */}
                  <div className="flex flex-col w-2/5 gap-1">
                    <label>Classification</label>
                    <div className="flex h-full  ">
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="radio"
                          id="classificationLocal"
                          name="classification"
                          value="Local"
                          checked={classification === "Local"}
                          onChange={handleChange}
                          className="h-6 w-6"
                        />
                        <label htmlFor="classificationLocal">Local</label>
                      </div>
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="radio"
                          id="classificationSystemWide"
                          name="classification"
                          value="System-wide"
                          checked={classification === "System-wide"}
                          onChange={handleChange}
                          className="h-6 w-6"
                        />
                        <label htmlFor="classificationSystemWide">
                          System-wide
                        </label>
                      </div>
                    </div>
                  </div>
                  {classification === "Local" && (
                    <div className="flex-1">
                      <div className="flex justify-between col-span-4 gap-4">
                        <div className="flex flex-col gap-1 flex-1">
                          <label htmlFor="department">Department</label>
                          <SearchableDropdown
                            label="Department"
                            options={departments}
                            value={formData.department}
                            onChange={handleDepartmentChange}
                            placeholder="Select Department"
                          />
                        </div>
                        <div className="flex flex-col gap-1 flex-1">
                          <label htmlFor="course">Course</label>
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
                        <label htmlFor="specialization">Specialization</label>
                        <input
                          type="text"
                          id="specialization"
                          name="specialization"
                          className="border py-2 px-4 rounded-2xl"
                          value={formData.specialization || ""}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Submit */}
            <div className="w-full mt-2 gap-4 flex justify-end pt-10 pb-5">
              <Submitbutton />
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
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({
      ...formData,
      [name]: value,
    });
  };

  const classification = formData.classification;

  const departments = ["Department A", "Department B", "Department C"];
  const courses = ["Course X", "Course Y", "Course Z"];

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
        <div className="w-[90%]">
          <div className=" pt-10  pl-10 pr-10 bg-white shadow-2xl mt-2">
            {/* Adviser Section */}
            <section className="mt-4">
              <div className="mb-2 font-semibold text-lg flex items-center">
                <h1 className="w-2/5 max-w-fit mr-3">Adviser Information</h1>
              </div>
              <div className="grid grid-cols-6 gap-x-2 gap-y-1">
                <div className="flex flex-col gap-1 col-span-3">
                  <label htmlFor="adviserUsername">Adviser Username</label>
                  <input
                    type="text"
                    id="adviserUsername"
                    name="adviserUsername"
                    className="border py-2 px-4 rounded-2xl"
                    value={formData.adviserUsername || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col gap-1 col-span-3">
                  <label htmlFor="adviserPassword">Adviser Password</label>
                  <input
                    type="text"
                    id="adviserPassword"
                    name="adviserPassword"
                    className="border py-2 px-4 rounded-2xl"
                    value={formData.adviserPassword || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col gap-1 col-span-3">
                  <label htmlFor="adviserName">Adviser Name</label>
                  <input
                    type="text"
                    id="adviserName"
                    name="adviserName"
                    className="border py-2 px-4 rounded-2xl"
                    value={formData.adviserName || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col gap-1 col-span-3">
                  <label htmlFor="adviserEmail">Adviser Email</label>
                  <input
                    type="text"
                    id="adviserEmail"
                    name="adviserEmail"
                    className="border py-2 px-4 rounded-2xl"
                    value={formData.adviserEmail || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex justify-between col-span-6 gap-4">
                  <div className="flex flex-col gap-1 flex-1">
                    <label htmlFor="adviserDepartment">Department</label>
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

            {/* Submit */}
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

export const FileUploadComponent = ({
  fields,
  handleSubmit,
  onReturn,
  initialFiles = {},
}) => {
  // Initialize state with parent's data
  const [uploadedFiles, setUploadedFiles] = useState(initialFiles);

  // Update local state when parent's data changes
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
    // Store the first file
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
        className=" space-y-4 flex  flex-col items-center my-5"
      >
        <div className="w-[90%]">
          {/* New container div for file uploads */}
          <div className="p-4  bg-white shadow-2xl">
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

export const ReviewComponent = ({
  formData,
  uploadedFiles,
  onEdit,
  onFinalSubmit,
}) => {
  const [showAdviserPassword, setShowAdviserPassword] = useState(false);
  const [showStudentPassword, setShowStudentPassword] = useState(false);

  const toggleAdviserPassword = () => setShowAdviserPassword((prev) => !prev);
  const toggleStudentPassword = () => setShowStudentPassword((prev) => !prev);

  const isImage = (file) => file?.type?.startsWith("image/");
  const getPreviewUrl = (file) => (file ? URL.createObjectURL(file) : "");

  return (
    <div className="w-full min-h-full flex justify-center mt-5">
      <div className="w-[90%]  ">
        <div className="container mx-auto p-10 bg-white shadow-2xl">
          <section className="mt-4 ">
            {/* Header */}
            <div className="mb-4 font-semibold text-lg flex items-center">
              <h1 className="w-2/5 max-w-fit mr-3">Review Information</h1>
            </div>

            {/* Org Info */}
            <section className="mb-6">
              <h2 className="text-md font-semibold mb-2">
                Organization Information
              </h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <p>
                  <strong>Name:</strong> {formData.organizationName}
                </p>
                <p>
                  <strong>Acronym:</strong> {formData.organizationAcronym}
                </p>
                <p>
                  <strong>President:</strong> {formData.organizationPresident}
                </p>
                <p>
                  <strong>Email:</strong> {formData.organizationEmail}
                </p>
                <p>
                  <strong>Classification:</strong> {formData.classification}
                </p>
                {formData.classification === "Local" && (
                  <>
                    <p>
                      <strong>Department:</strong> {formData.department}
                    </p>
                    <p>
                      <strong>Course:</strong> {formData.course}
                    </p>
                  </>
                )}
                {formData.classification === "System-wide" && (
                  <p>
                    <strong>Specialization:</strong> {formData.specialization}
                  </p>
                )}
              </div>
            </section>

            {/* Adviser Info */}
            <section className="mb-6">
              <h2 className="text-md font-semibold mb-2">
                Adviser Information
              </h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <p>
                  <strong>Name:</strong> {formData.adviserName}
                </p>
                <p>
                  <strong>Email:</strong> {formData.adviserEmail}
                </p>
                <p>
                  <strong>Department:</strong> {formData.adviserDepartment}
                </p>
                <p>
                  <strong>Username:</strong> {formData.adviserUsername}
                </p>
                <p className="flex items-center gap-2">
                  <strong>Password:</strong>{" "}
                  {showAdviserPassword
                    ? formData.adviserPassword
                    : "•".repeat(formData.adviserPassword?.length || 8)}
                  <button
                    type="button"
                    onClick={toggleAdviserPassword}
                    className="text-blue-600 text-xs underline"
                  >
                    {showAdviserPassword ? "Hide" : "Show"}
                  </button>
                </p>
              </div>
            </section>

            {/* Student Info */}
            <section className="mb-6">
              <h2 className="text-md font-semibold mb-2">Student Account</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <p>
                  <strong>Username:</strong> {formData.studentUsername}
                </p>
                <p className="flex items-center gap-2">
                  <strong>Password:</strong>{" "}
                  {showStudentPassword
                    ? formData.studentPassword
                    : "•".repeat(formData.studentPassword?.length || 8)}
                  <button
                    type="button"
                    onClick={toggleStudentPassword}
                    className="text-blue-600 text-xs underline"
                  >
                    {showStudentPassword ? "Hide" : "Show"}
                  </button>
                </p>
              </div>
            </section>

            {/* Uploaded Files */}
            <section className="mb-6 flex">
              <h2 className="text-md font-semibold mb-2">Uploaded Files</h2>
              <div className="flex flex-wrap gap-6">
                {uploadedFiles && Object.keys(uploadedFiles).length > 0 ? (
                  Object.entries(uploadedFiles).map(([key, file]) => (
                    <div
                      key={key}
                      className="flex flex-col items-center max-w-xs text-sm"
                    >
                      <strong className="mb-1">{key}:</strong>
                      {isImage(file) ? (
                        <img
                          src={getPreviewUrl(file)}
                          alt={file.name}
                          className="w-32 h-32 object-cover rounded shadow"
                        />
                      ) : (
                        <div className="text-gray-600 truncate text-center">
                          📄 {file.name}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No files uploaded.</p>
                )}
              </div>
            </section>

            {/* Buttons */}
            <div className="w-full flex justify-end gap-4">
              <button
                type="button"
                onClick={onEdit}
                className="bg-gray-300 hover:bg-gray-400 text-black font-semibold py-2 px-4 rounded-2xl"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={onFinalSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-2xl"
              >
                Submit Final
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

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
      <div className="w-[90%] mt-2 ">
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
