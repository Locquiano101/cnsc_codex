import {
  Building,
  User,
  Users,
  Award,
  FileText,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  CodeSquare,
  Download,
  Upload,
  Eye,
  AlertCircle,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileAlt, faClose } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { API_ROUTER } from "../../../../App";
import { FileRenderer } from "../../../../components/file_renderer";
import { useState, useEffect } from "react";

export default function StudentAccreditationDetailsView({ userData }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [accreditationData, setAccreditationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Set your base path for file uploads

  const basePath = `${userData.organization.org_name}/Accreditation/Accreditation/`;
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const apiroute = `${API_ROUTER}/get-accreditation/${userData.organization._id}`;
        const response = await axios.get(apiroute);
        setAccreditationData(response.data.accreditation);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching accreditation:", error);
        setError("Failed to load accreditation data");
        setLoading(false);
      }
    };

    fetchData();
  }, [userData.organization._id]);

  const {
    organization: {
      org_name,
      org_acronym,
      org_class,
      org_type,
      org_president,
      org_email,
      logo,
      adviser_name,
      adviser_email,
      adviser_department,
      accreditation_status,
    },
    position,
    delivery_unit,
    _id: userId,
    createdAt,
  } = userData;

  // Status badge component with appropriate colors
  const StatusBadge = ({ status }) => {
    let bgColor = "bg-yellow-100";
    let textColor = "text-yellow-800";
    let icon = <Clock className="w-4 h-4 mr-1" />;

    switch (status?.toLowerCase()) {
      case "approved":
        bgColor = "bg-green-100";
        textColor = "text-green-800";
        icon = <CheckCircle className="w-4 h-4 mr-1" />;
        break;
      case "rejected":
        bgColor = "bg-red-100";
        textColor = "text-red-800";
        icon = <XCircle className="w-4 h-4 mr-1" />;
        break;
      case "revision":
      case "revision required":
        bgColor = "bg-orange-100";
        textColor = "text-orange-800";
        icon = <AlertCircle className="w-4 h-4 mr-1" />;
        break;
      case "pending":
      default:
        bgColor = "bg-yellow-100";
        textColor = "text-yellow-800";
        icon = <Clock className="w-4 h-4 mr-1" />;
        break;
    }

    return (
      <span
        className={`flex items-center px-3 py-1 rounded-full ${bgColor} ${textColor} text-sm font-medium`}
      >
        {icon}
        {status || "Pending"}
      </span>
    );
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading accreditation details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-8">
        <div className="text-center text-red-500">
          <AlertCircle className="h-12 w-12 mx-auto" />
          <p className="mt-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg overflow-hidden">
      {/* Header with org logo and main details */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
        <div className="flex items-center space-x-4">
          <div className="bg-white rounded-full p-2 h-16 w-16 flex items-center justify-center">
            {logo ? (
              <img
                src={`/api/placeholder/80/80`}
                alt={`${org_name} logo`}
                className="h-12 w-12 object-contain rounded-full"
              />
            ) : (
              <Building className="h-10 w-10 text-blue-600" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              {org_name} ({org_acronym})
            </h1>
            <div className="flex items-center mt-1 text-blue-100">
              <Building className="w-4 h-4 mr-1" />
              <span className="text-sm">{org_class} Organization</span>
            </div>
            <div className="flex items-center mt-1 text-blue-100">
              <User className="w-4 h-4 mr-1" />
              <span className="text-sm">User ID: {userId}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm flex items-center">
            <span className="mr-4">Overall Accreditation Status:</span>
            <StatusBadge status={accreditation_status?.over_all_status} />
          </div>
          <div className="text-sm">
            <span>Last Updated: {formatDate(createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === "overview"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("requirements")}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === "requirements"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Requirements
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Organization Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
                  <Building className="w-5 h-5 mr-2 text-blue-500" />
                  Organization Details
                </h3>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <span className="text-gray-500 w-32 text-sm">Name:</span>
                    <span className="text-gray-800">{org_name}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-gray-500 w-32 text-sm">Acronym:</span>
                    <span className="text-gray-800">{org_acronym}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-gray-500 w-32 text-sm">Type:</span>
                    <span className="text-gray-800">
                      {org_type?.Classification}
                    </span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-gray-500 w-32 text-sm">
                      Delivery Unit:
                    </span>
                    <span className="text-gray-800">{delivery_unit}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-gray-500 w-32 text-sm">
                      Specialization:
                    </span>
                    <span className="text-gray-800">
                      {org_type?.Fields?.[0]?.specializations?.join(", ") ||
                        "Academic"}
                    </span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-gray-500 w-32 text-sm">Email:</span>
                    <span className="text-gray-800">{org_email}</span>
                  </div>
                </div>
              </div>

              {/* Key Personnel */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-blue-500" />
                  Key Personnel
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <User className="w-4 h-4 mr-1" />
                      <span className="text-sm font-medium">User Position</span>
                    </div>
                    <div className="ml-5 text-gray-800">{position}</div>
                  </div>
                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <User className="w-4 h-4 mr-1" />
                      <span className="text-sm font-medium">President</span>
                    </div>
                    <div className="ml-5 text-gray-800">{org_president}</div>
                  </div>
                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <User className="w-4 h-4 mr-1" />
                      <span className="text-sm font-medium">Adviser</span>
                    </div>
                    <div className="ml-5 text-gray-800">{adviser_name}</div>
                    <div className="ml-5 text-gray-600 text-sm">
                      {adviser_email}
                    </div>
                    <div className="ml-5 text-gray-600 text-sm">
                      {adviser_department}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Accreditation Summary */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
                <Award className="w-5 h-5 mr-2 text-blue-500" />
                Accreditation Summary
              </h3>

              <div className="flex flex-col space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <StatusBadge
                      status={accreditation_status?.over_all_status}
                    />
                    <span className="text-gray-600">
                      {accreditation_status?.over_all_status === "Approved"
                        ? "Organization is fully accredited"
                        : accreditation_status?.over_all_status ===
                          "Revision Required"
                        ? "Organization requires document revisions"
                        : "Organization is pending accreditation"}
                    </span>
                  </div>

                  {accreditation_status?.over_all_status === "Approved" && (
                    <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm flex items-center">
                      <FileText className="w-4 h-4 mr-1" />
                      View Certificate
                    </button>
                  )}
                </div>

                {accreditationData?.accreditation_status
                  ?.accreditation_type && (
                  <div className="text-gray-600 bg-blue-100 p-3 rounded-md">
                    <span className="font-medium">Accreditation Type:</span>{" "}
                    <span className="capitalize">
                      {
                        accreditationData.accreditation_status
                          .accreditation_type
                      }
                    </span>
                    {accreditation_status?.over_all_status ===
                      "Revision Required" && (
                      <div className="mt-2 flex items-start text-sm">
                        <AlertCircle className="w-4 h-4 mr-2 text-orange-500 mt-1 flex-shrink-0" />
                        <div>
                          <strong className="text-orange-700">
                            Action Required:
                          </strong>{" "}
                          Please review and resubmit the highlighted documents
                          that need revision.
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "requirements" && (
          <div>
            <h3 className="font-semibold text-gray-700 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-500" />
              Accreditation Requirements
            </h3>

            {accreditationData &&
            accreditationData.accreditation_status &&
            accreditationData.accreditation_status.documents_and_status ? (
              <div className="bg-gray-50 rounded-lg overflow-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Requirement
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        File
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {accreditationData.accreditation_status.documents_and_status.map(
                      (doc, index) => (
                        <tr key={doc._id || index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            {doc.label}
                          </td>
                          <td className="px-6 py-4">
                            {doc.file ? (
                              <FileRenderer
                                basePath={`/${userData.organization.org_name}/Accreditation/Accreditation/`}
                                fileName={doc.file}
                              />
                            ) : (
                              <span className="text-gray-500 italic text-sm">
                                No file uploaded
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge status={doc.Status} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex space-x-2">
                              {doc.file && (
                                <a
                                  href={`${basePath}/${
                                    /\.(jpe?g|png|gif|bmp|webp|svg)$/.test(
                                      doc.file
                                    )
                                      ? "photos"
                                      : "documents"
                                  }/${doc.file}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-blue-600 hover:text-blue-800 flex items-center"
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  View
                                </a>
                              )}
                              <button className="text-green-600 hover:text-green-800 flex items-center">
                                <Upload className="w-4 h-4 mr-1" />
                                {doc.file ? "Replace" : "Upload"}
                              </button>
                              {doc.Status === "revision" &&
                                doc.revision_notes && (
                                  <div
                                    className="text-orange-500 hover:text-orange-700 flex items-center cursor-help"
                                    title={doc.revision_notes}
                                  >
                                    <AlertCircle className="w-4 h-4 mr-1" />
                                    {doc.revision_notes.length > 0
                                      ? "Notes"
                                      : ""}
                                  </div>
                                )}
                            </div>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-700">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  <span>
                    No requirement documents found for this organization.
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
