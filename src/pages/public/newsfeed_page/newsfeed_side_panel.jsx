import { useState } from "react";
import SearchableDropdown from "../../../components/searchable_drop_down";
import { Link } from "react-router-dom";

const Organizations = [
  {
    name: "Tech Club",
    logo: "/general/ccms_sg_logo.jpg",
    type: "system-wide",
    department: "Computer Science",
  },
  {
    name: "Global Innovators",
    logo: "/general/ccms_sg_logo.jpg",
    type: "system-wide",
    department: "All Departments",
  },
  {
    name: "Eco Warriors",
    logo: "/general/ccms_sg_logo.jpg",
    type: "system-wide",
    department: "All Departments",
  },
  {
    name: "Business Society",
    logo: "/general/ccms_sg_logo.jpg",
    type: "local",
    department: "Business Administration",
  },
  {
    name: "Engineering Innovators",
    logo: "/general/ccms_sg_logo.jpg",
    type: "local",
    department: "Engineering",
  },
  {
    name: "EduCare Club",
    logo: "/general/ccms_sg_logo.jpg",
    type: "local",
    department: "Education",
  },
  {
    name: "Arts Hub",
    logo: "/general/ccms_sg_logo.jpg",
    type: "local",
    department: "Arts and Sciences",
  },
  {
    name: "Math Wizards",
    logo: "/general/ccms_sg_logo.jpg",
    type: "local",
    department: "Arts and Sciences",
  },
  {
    name: "Tech Titans",
    logo: "/general/ccms_sg_logo.jpg",
    type: "local",
    department: "Computing and Multimedia Studies",
  },
  {
    name: "Hospitality Guild",
    logo: "/general/ccms_sg_logo.jpg",
    type: "local",
    department: "Business Administration",
  },
  {
    name: "Agro Youth",
    logo: "/general/ccms_sg_logo.jpg",
    type: "local",
    department: "Agriculture and Natural Resources",
  },
  {
    name: "Future Educators Circle",
    logo: "/general/ccms_sg_logo.jpg",
    type: "local",
    department: "Education",
  },
  {
    name: "ElectroMech Club",
    logo: "/general/ccms_sg_logo.jpg",
    type: "local",
    department: "Engineering",
  },
  {
    name: "Sea Scholars",
    logo: "/general/ccms_sg_logo.jpg",
    type: "local",
    department: "Fisheries and Marine Sciences",
  },
];

export const departments = {
  "College of Arts and Sciences": [
    "Bachelor of Science in Biology",
    "Bachelor of Science in Applied Mathematics",
    "Bachelor of Science in Development Communication",
    "Bachelor of Arts in English Language Studies",
    "Bachelor of Arts in Sociology",
  ],
  "College of Computing and Multimedia Studies": [
    "Bachelor of Science in Information Technology",
    "Bachelor of Science in Information Systems",
  ],
  "College of Business and Public Administration": [
    "Bachelor of Science in Business Administration – Business Economics",
    "Bachelor of Science in Business Administration – Financial Management",
    "Bachelor of Science in Business Administration – Marketing Management",
    "Bachelor of Science in Business Administration – Human Resource Management",
    "Bachelor of Science in Accountancy",
    "Bachelor of Science in Hospitality Management",
    "Bachelor of Science in Office Administration",
    "Bachelor of Science in Entrepreneurship",
    "Bachelor in Public Administration",
  ],
  "College of Engineering": [
    "Bachelor of Science in Civil Engineering",
    "Bachelor of Science in Electrical Engineering",
    "Bachelor of Science in Mechanical Engineering",
  ],
  "College of Education": [
    "Bachelor of Elementary Education",
    "Bachelor of Secondary Education – Major in English",
    "Bachelor of Secondary Education – Major in Filipino",
    "Bachelor of Secondary Education – Major in Mathematics",
    "Bachelor of Secondary Education – Major in Social Studies",
    "Bachelor of Secondary Education – Major in Sciences",
    "Bachelor of Technology and Livelihood Education – Home Economics",
    "Bachelor of Physical Education",
  ],
  "College of Trades and Technology": [
    "Bachelor of Technical-Vocational Teacher Education – Garments Fashion and Design",
    "Bachelor of Technical-Vocational Teacher Education – Food Service and Management",
    "Bachelor of Technical-Vocational Teacher Education – Automotive Technology",
    "Bachelor of Technical-Vocational Teacher Education – Electrical Technology",
    "Bachelor of Science in Industrial Technology – Automotive Technology",
    "Bachelor of Science in Industrial Technology – Electrical Technology",
    "Bachelor of Science in Industrial Technology – Computer Technology",
    "Bachelor of Science in Industrial Technology – Electronics Technology",
  ],
  "College of Agriculture and Natural Resources": [
    "Bachelor of Science in Agriculture – Crop Science",
    "Bachelor of Science in Agriculture – Animal Science",
    "Bachelor of Science in Environmental Science",
    "Bachelor in Agricultural Technology",
    "Bachelor of Science in Agricultural and Biosystems Engineering",
  ],
  "Institute of Fisheries and Marine Sciences": [
    "Bachelor of Science in Fisheries",
  ],
  "Alternative Track": [
    "Bachelor of Science in Entrepreneurship (Agricultural Production Track)",
  ],
};

export default function NewsFeedSidePanel() {
  const [selectedOption, setSelectedOption] = useState("system-wide");
  const [selectedDepartment, setSelectedDepartment] = useState("");

  const filteredOrganizations = Organizations.filter((org) => {
    if (selectedOption === "system-wide") {
      return org.type === "system-wide";
    }
    return (
      org.type === "local" &&
      (!selectedDepartment || org.department === selectedDepartment)
    );
  });

  return (
    <div className="w-full max-w-xs h-[90vh] px-2 py-4 sticky top-0">
      <div className="relative max-h-[90vh] shadow-md">
        {/* Yellow background layer */}
        <div className="absolute inset-0 bg-cnsc-secondary-color z-0" />

        {/* Scrollable content on top */}
        <div className="relative z-10 bg-cnsc-primary-color top-4 left-4 p-4 max-h-[90vh] overflow-hidden rounded">
          <h2 className="text-cnsc-white-color mb-4 text-2xl font-bold text-center">
            STUDENT ORGANIZATIONS
          </h2>

          {/* Type Selector */}
          <div className="mb-4 bg-white">
            <select
              value={selectedOption}
              onChange={(e) => {
                setSelectedOption(e.target.value);
                setSelectedDepartment(""); // Reset department when switching
              }}
              className="w-full p-2 rounded bg-white"
            >
              <option value="system-wide">System-wide</option>
              <option value="local">Local</option>
            </select>
          </div>

          {/* Department Filter (only for local) */}
          {selectedOption === "local" && (
            <div className="mb-4">
              <SearchableDropdown
                options={Object.keys(departments)}
                value={selectedDepartment}
                onChange={setSelectedDepartment}
                placeholder="Select department"
                className="bg-white"
              />
            </div>
          )}

          {/* Scrollable Organization List */}
          <div className="overflow-y-auto max-h-[calc(90vh-240px)] pr-1 space-y-2">
            {filteredOrganizations.map((org) => (
              <Link
                to="/organization/profile"
                key={org.name}
                className="flex items-center space-x-2 bg-white p-2 rounded shadow"
              >
                <img
                  src="/general/cnsc_codex.png"
                  alt={org.name}
                  className="w-10 h-10"
                />
                <div>
                  <p className="font-semibold">{org.name}</p>
                  <p className="text-sm text-gray-600">{org.department}</p>
                </div>
              </Link>
            ))}

            {filteredOrganizations.length === 0 && (
              <p className="text-cnsc-white-color text-center">
                No organizations found.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
