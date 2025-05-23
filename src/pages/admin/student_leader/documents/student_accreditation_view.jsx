import {
  Building,
  User,
  Users,
  Award,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Upload,
  Eye,
  AlertCircle,
  X,
  Pen,
} from "lucide-react";
import axios from "axios";
import { API_ROUTER } from "../../../../App";
import { FileRenderer } from "../../../../components/file_renderer";
import { useState, useEffect } from "react";
import StudentEditAccreditation from "./student_accreditation_edit";

export default function StudentAccreditationDetailsView({ userData }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [accreditationData, setAccreditationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRevisionPopup, setShowRevisionPopup] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  console.log(accreditationData);
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

  // Handle revision button click
  const handleRevisionClick = (document) => {
    setSelectedDocument(document);
    setShowRevisionPopup(true);
  };

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

  if (loading) {
    return <div className="p-8 text-center">Loading organization data...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="bg-white shadow-lg overflow-hidden h-full flex flex-col">
      {/* Header with org logo and main details */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
        <div className="flex items-center space-x-4">
          <div className="bg-white rounded-full h-16 w-16 flex items-center justify-center">
            {userData.organization.logo ? (
              <img
                src={`/${userData.organization.org_name}/Accreditation/Accreditation/photos/${userData.organization.logo}`}
                className="h-full rounded-full aspect-square"
                alt="Logo"
              />
            ) : (
              <Building className="h-10 w-10 text-blue-600" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              {userData.organization.org_name} (
              {userData.organization.org_acronym})
            </h1>
            <div className="flex items-center mt-1 text-blue-100">
              <Building className="w-4 h-4 mr-1" />
              <span className="text-sm">
                {userData.organization.org_class} Organization
              </span>
            </div>
            <div className="flex items-center mt-1 text-blue-100">
              <User className="w-4 h-4 mr-1" />
              <span className="text-sm">User ID: {userData._id}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm flex items-center">
            <span className="mr-4">Overall Accreditation Status:</span>
            <StatusBadge
              status={
                userData.organization.accreditation_status?.over_all_status
              }
            />
          </div>
          <div className="text-sm">
            <span>
              Last Updated: {formatDate(userData.organization.createdAt)}
            </span>
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
      <div className="h-full overflow-y-auto p-6">
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
                    <span className="text-gray-800">
                      {userData.organization.org_name}
                    </span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-gray-500 w-32 text-sm">Acronym:</span>
                    <span className="text-gray-800">
                      {userData.organization.org_acronym}
                    </span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-gray-500 w-32 text-sm">Type:</span>
                    <span className="text-gray-800">
                      {userData.organization.org_type?.Classification}
                    </span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-gray-500 w-32 text-sm">
                      Delivery Unit:
                    </span>
                    <span className="text-gray-800">
                      {userData.delivery_unit}
                    </span>
                  </div>

                  {/* Different display based on org type */}
                  {userData.organization.org_type?.Classification ===
                  "Local" ? (
                    <div className="flex items-start">
                      <span className="text-gray-500 w-32 text-sm">
                        Department:
                      </span>
                      <span className="text-gray-800">
                        {userData.organization.org_type?.Departments?.length >
                        0 ? (
                          <div>
                            {userData.organization.org_type.Departments.map(
                              (dept, index) => (
                                <div key={index} className="mb-1">
                                  <div>{dept.Department}</div>
                                  <div className="text-sm text-gray-600">
                                    {dept.Course}
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        ) : (
                          "Not specified"
                        )}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-start">
                      <span className="text-gray-500 w-32 text-sm">
                        Specialization:
                      </span>
                      <span className="text-gray-800">
                        {userData.organization.org_type?.Fields?.[0]?.specializations?.join(
                          ", "
                        ) || "Not specified"}
                      </span>
                    </div>
                  )}

                  <div className="flex items-start">
                    <span className="text-gray-500 w-32 text-sm">Email:</span>
                    <span className="text-gray-800">
                      {userData.organization.org_email}
                    </span>
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
                    <div className="ml-5 text-gray-800">
                      {userData.position || "Not specified"}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <User className="w-4 h-4 mr-1" />
                      <span className="text-sm font-medium">President</span>
                    </div>
                    <div className="ml-5 text-gray-800">
                      {userData.organization.org_president}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <User className="w-4 h-4 mr-1" />
                      <span className="text-sm font-medium">Adviser</span>
                    </div>
                    <div className="ml-5 text-gray-800">
                      {userData.organization.adviser_name}
                    </div>
                    <div className="ml-5 text-gray-600 text-sm">
                      {userData.organization.adviser_email}
                    </div>
                    <div className="ml-5 text-gray-600 text-sm">
                      {userData.organization.adviser_department}
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
                      status={
                        userData.organization.accreditation_status
                          ?.over_all_status
                      }
                    />
                    <span className="text-gray-600">
                      {userData.organization.accreditation_status
                        ?.over_all_status === "Approved"
                        ? "Organization is fully accredited"
                        : userData.organization.accreditation_status
                            ?.over_all_status === "Revision Required"
                        ? "Organization requires document revisions"
                        : "Organization is pending accreditation"}
                    </span>
                  </div>

                  {userData.organization.accreditation_status
                    ?.over_all_status === "Approved" && (
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
                    {userData.organization.accreditation_status
                      ?.over_all_status === "Revision Required" && (
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
            <h3 className="font-semibold h-full text-gray-700 mb-4 flex items-center">
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
                              {/* Conditional rendering based on status */}
                              {doc.Status?.toLowerCase() === "revision" ||
                              doc.Status?.toLowerCase() ===
                                "revision required" ? (
                                <button
                                  onClick={() => handleRevisionClick(doc)}
                                  className="text-orange-600 hover:text-orange-800 flex items-center"
                                >
                                  <Upload className="w-4 h-4 mr-1" />
                                  Revision
                                </button>
                              ) : (
                                doc.Status?.toLowerCase() !== "approved" && (
                                  <button className="text-green-600 hover:text-green-800 flex items-center">
                                    <Upload className="w-4 h-4 mr-1" />
                                    {doc.file ? "Replace" : "Upload"}
                                  </button>
                                )
                              )}

                              {doc.Status?.toLowerCase() === "revision" &&
                                doc.revision_notes && (
                                  <div
                                    className="text-orange-500 hover:text-orange-700 flex items-center cursor-help"
                                    title={doc.revision_notes}
                                  >
                                    <AlertCircle className="w-4 h-4 mr-1" />
                                    Notes
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

      {/* Revision Popup */}
      {showRevisionPopup && (
        <StudentEditAccreditation
          document={selectedDocument}
          accreditationId={accreditationData.accreditation_status._id}
          orgName={userData.organization.org_name}
          onClose={() => setShowRevisionPopup(false)}
        />
      )}
    </div>
  );
}
