import SearchableDropdown from "./searchable_drop_down";

export default function CollegeCourseDepartments() {
  const College = [""];
  const Department = [""];
  return (
    <>
      {" "}
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
    </>
  );
}
