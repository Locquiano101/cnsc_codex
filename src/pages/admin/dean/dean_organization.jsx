import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const SkeletonLoader = () => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
    <div className="h-48 bg-gray-200"></div>
    <div className="p-6">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-full mt-6"></div>
      <div className="mt-4 flex justify-end">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
    </div>
  </div>
);

export default function DeanOrganizationBoard({ organization, user }) {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      if (organization) {
        setOrganizations(organization);
      }
      setLoading(false);
    } catch (err) {
      setError("Failed to load organizations data");
      setLoading(false);
    }
  }, [organization]);

  if (loading) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 overflow-hidden">
        <div className="fixed -left-20 -top-20 w-64 h-64 bg-blue-100 rounded-full filter blur-3xl opacity-30"></div>
        <div className="fixed -right-20 -bottom-20 w-64 h-64 bg-indigo-100 rounded-full filter blur-3xl opacity-30"></div>

        <div className="relative container mx-auto pt-28 px-4 max-w-6xl">
          <h1 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Organizations
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <SkeletonLoader key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 overflow-hidden">
        <div className="fixed -left-20 -top-20 w-64 h-64 bg-blue-100 rounded-full filter blur-3xl opacity-30"></div>
        <div className="fixed -right-20 -bottom-20 w-64 h-64 bg-indigo-100 rounded-full filter blur-3xl opacity-30"></div>

        <div className="relative container mx-auto pt-28 px-4 text-center max-w-4xl">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-8 shadow-sm">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Organizations
            </h1>
            <p className="text-lg text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 overflow-hidden">
      {/* Background blobs */}
      <div className="fixed -left-20 -top-20 w-64 h-64 bg-blue-100 rounded-full filter blur-3xl opacity-30"></div>
      <div className="fixed -right-20 -bottom-20 w-64 h-64 bg-indigo-100 rounded-full filter blur-3xl opacity-30"></div>

      {/* Content container */}
      <div className="relative">
        <div className="text-center mb-12 bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-sm">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {user.delivery_unit} Organizations
          </h1>
        </div>

        {!organizations || organizations.length === 0 ? (
          <div className="text-center py-12 bg-white/70 backdrop-blur-sm rounded-xl shadow-sm max-w-2xl mx-auto">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No OSSD organizations found
            </h3>
            <p className="mt-1 text-gray-500">
              There are currently no OSSD organizations registered in the
              system.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {organizations.map((org, index) => (
              <Link
                to={`/organization/profile/${org.org_name}`}
                key={index}
                className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative h-48 bg-gray-100 flex items-center justify-center">
                  <img
                    src={
                      org.logo
                        ? `/${org.org_name}/Accreditation/Accreditation/photos/${org.logo}`
                        : "/general/default-org-logo.svg"
                    }
                    className="h-full w-full object-cover"
                    alt="Organization Logo"
                    onError={(e) => {
                      e.target.src = "/general/default-org-logo.svg";
                    }}
                  />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {org.org_name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {org.org_acronym && `${org.org_acronym} • `}
                    {org.org_class} Organization
                  </p>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">President:</span>{" "}
                      {org.org_president}
                    </p>

                    {org.org_type?.Departments?.length > 0 && (
                      <>
                        <p className="text-sm text-gray-600 mt-1">
                          <span className="font-medium">Department:</span>{" "}
                          {org.org_type.Departments[0].Department}
                        </p>
                        {org.org_type.Departments[0].Course && (
                          <p className="text-sm text-gray-600 mt-1">
                            <span className="font-medium">Course:</span>{" "}
                            {org.org_type.Departments[0].Course}
                          </p>
                        )}
                      </>
                    )}
                  </div>

                  <div className="mt-4 flex justify-end">
                    <span className="text-sm font-medium text-blue-600 group-hover:text-blue-800 transition-colors">
                      View details →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
