import axios from "axios";
import { React } from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_ROUTER } from "../../../App";

export default function OrganizationPage() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllOrganizations = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_ROUTER}/get-all-organization`);
        console.log("Fetched organizations:", response.data);
        setOrganizations(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching organizations:", error);
        setError("Failed to load organizations");
        setLoading(false);
      }
    };

    fetchAllOrganizations();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto pt-28 text-center">
        <p className="text-lg">Loading organizations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto pt-28 text-center">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto pt-28 px-4">
      <h1 className="text-2xl font-bold text-center mb-8">Organizations</h1>

      {organizations.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-lg text-gray-600">No organizations found.</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-6 justify-center">
          {organizations.map((org, index) => (
            <Link
              to={`/organization/profile/${org.org_name}`}
              key={index}
              className="group flex items-center h-48 transition-all duration-500 ease-in-out rounded-full overflow-hidden border border-gray-300 shadow cursor-pointer"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Logo Section */}
              <div
                className={`h-full w-48 flex justify-center items-center bg-white border-r border-gray-200 transition-all duration-500 ${
                  hoveredIndex === index ? "rounded-l-full" : "rounded-full"
                }`}
              >
                <img
                  src={`/${org.org_name}/Accreditation/Accreditation/photos/${org.logo}`}
                  alt={`${org.org_name} logo`}
                  className="w-48 h-48 rounded-full object-cover"
                />
              </div>

              {/* Info Section */}
              <div
                className={`h-full flex items-center text-sm transition-all duration-500 overflow-hidden ${
                  hoveredIndex === index
                    ? "opacity-100 px-4 w-64"
                    : "opacity-0 px-0 w-0"
                }`}
              >
                <div className="text-gray-700 space-y-1">
                  <p className="font-semibold">{org.org_name}</p>
                  <p className="text-xs">Classification: {org.org_class}</p>
                  {org.org_class === "Local" &&
                    org.org_type?.Departments &&
                    org.org_type.Departments.length > 0 && (
                      <p className="text-xs">
                        <strong>Department:</strong>{" "}
                        {org.org_type.Departments[0].Department}
                      </p>
                    )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
