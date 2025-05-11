import { useEffect, useState } from "react";
import SearchableDropdown from "../../../components/searchable_drop_down";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_ROUTER } from "../../../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

export default function NewsFeedSidePanel() {
  const [selectedOption, setSelectedOption] = useState("system-wide");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [Organizations, setOrganizations] = useState([]);

  const filteredOrganizations = Organizations.filter((org) => {
    const orgClass = org.org_class?.toLowerCase() || "";
    const isSystemWide = orgClass === "system-wide";
    const isLocal = orgClass === "local";

    if (selectedOption === "system-wide") {
      return isSystemWide;
    }

    if (isLocal) {
      if (selectedDepartment) {
        return org.org_type?.Departments?.some(
          (dept) => dept.Department === selectedDepartment
        );
      }
      return true; // show all locals if no department selected
    }

    return false;
  });

  useEffect(() => {
    const FetchAllOrganization = async () => {
      try {
        const response = await axios.get(`${API_ROUTER}/get-all-organization`);
        setOrganizations(response.data);
      } catch (error) {
        console.error("Error fetching organizations:", error);
      }
    };

    FetchAllOrganization();
  }, []);

  // Fixed departmentOptions logic
  const departmentOptions = Array.from(
    new Set(
      Organizations.flatMap(
        (org) => org.org_type?.Departments?.map((d) => d.Department) || []
      )
    )
  ).filter(Boolean); // remove undefined or empty

  return (
    <div className="w-full h-[90vh]  sticky top-0">
      <div className="relative max-h-[90vh] shadow-md">
        <div className="absolute inset-0 bg-cnsc-secondary-color z-0" />
        <div className="relative z-10 bg-cnsc-primary-color top-4 left-4 p-4 max-h-[90vh] overflow-hidden rounded">
          <h2 className="text-cnsc-white-color mb-4 text-2xl font-bold text-center">
            STUDENT ORGANIZATIONS
          </h2>

          {/* Replace dropdown with radio buttons */}
          <div className="mb-4 bg-white p-3 rounded ">
            <div className="flex items-center  justify-around">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="system-wide"
                  checked={selectedOption === "system-wide"}
                  onChange={() => {
                    setSelectedOption("system-wide");
                    setSelectedDepartment("");
                  }}
                  className="mr-2"
                />
                <span>System-wide</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="local"
                  checked={selectedOption === "local"}
                  onChange={() => {
                    setSelectedOption("local");
                    setSelectedDepartment("");
                  }}
                  className="mr-2"
                />
                <span>Local</span>
              </label>
            </div>
          </div>

          {/* Department List (only for local) */}
          {selectedOption === "local" && departmentOptions.length > 0 && (
            <div className="relative">
              <div className="mb-4">
                <SearchableDropdown
                  options={departmentOptions}
                  value={selectedDepartment}
                  onChange={setSelectedDepartment}
                  placeholder="Select department"
                  className="bg-white"
                />
              </div>
              <FontAwesomeIcon
                icon={faChevronDown}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500"
              />
            </div>
          )}

          {/* Scrollable Organization List */}
          <div className="overflow-y-auto min-h-[calc(90vh-240px)] pr-1 space-y-2">
            {filteredOrganizations.map((org) => (
              <Link
                to={`/organization/profile/${org.org_name}`}
                key={org._id}
                className="flex items-center space-x-2 bg-white p-2 rounded shadow"
              >
                <img
                  src={`${org.org_name}/Accreditation/Accreditation/photos/${
                    org.logo || "default_logo.png"
                  }`}
                  alt={org.org_name}
                  className="w-10 h-10 object-cover aspect-square rounded-full"
                />
                <div>
                  <p className="font-semibold">{org.org_name}</p>
                  <p className="text-sm text-gray-600">
                    {org.org_type?.Departments?.[0]?.Department || "N/A"}
                  </p>
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
