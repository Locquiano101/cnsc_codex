import { useState, useEffect } from "react";
import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeftRotate,
  faCircleCheck,
  faClock,
} from "@fortawesome/free-solid-svg-icons";

export default function SDUAccomplishments() {
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [accomplishments, setAccomplishments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalScore, setTotalScore] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredAccomplishments, setFilteredAccomplishments] = useState([]);

  // Dummy data representing organization accomplishments
  const dummyAccomplishments = [
    {
      _id: "1",
      type: "proposed",
      activity_type: "Workshop",
      event_title: "Leadership Training Workshop",
      event_description:
        "A workshop focused on developing leadership skills for organization members",
      event_status: "Completed",
      event_date: new Date("2025-03-15"),
      event_score: 25,
      documents: {
        approved_proposal_status: "Approved",
        attendance_sheet_status: "Approved",
        narrative_report_status: "Approved",
        financial_report_status: "Pending",
        evaluation_summary_status: "Approved",
      },
      over_all_status: "Completed",
    },
    {
      _id: "2",
      type: "institutional",
      activity_type: "Seminar",
      event_title: "Mental Health Awareness Seminar",
      event_description:
        "A seminar to raise awareness about mental health issues among students",
      event_date: new Date("2025-04-10"),
      event_score: 20,
      documents: {
        narrative_status: "Approved",
        attendance_status: "Approved",
        documentation_status: "Approved",
        certificate_status: "Approved",
      },
      over_all_status: "Completed",
    },
    {
      _id: "3",
      type: "external",
      activity_type: "Conference",
      event_title: "National Student Leaders Conference",
      event_description:
        "Representing the university at the national conference of student leaders",
      event_date: new Date("2025-02-20"),
      event_score: 30,
      documents: {
        narrative_report_status: "Approved",
        official_invitation_status: "Approved",
        liquidation_report_status: "Pending",
        echo_seminar_document_status: "Approved",
        cm063_documents_status: "Approved",
        photo_documentation_status: "Approved",
      },
      over_all_status: "Completed",
    },
    {
      _id: "4",
      type: "proposed",
      activity_type: "Community Service",
      event_title: "Environmental Clean-up Drive",
      event_description:
        "Community service activity for cleaning up the local beach area",
      event_status: "In Progress",
      event_date: new Date("2025-05-22"),
      event_score: 15,
      documents: {
        approved_proposal_status: "Approved",
        attendance_sheet_status: "Pending",
        narrative_report_status: "Not Submitted",
        financial_report_status: "Not Submitted",
        evaluation_summary_status: "Not Submitted",
      },
      over_all_status: "In Progress",
    },
    {
      _id: "5",
      type: "institutional",
      activity_type: "Training",
      event_title: "First Aid Certification Training",
      event_description:
        "Training for organization members to get certified in first aid",
      event_date: new Date("2025-01-30"),
      event_score: 20,
      documents: {
        narrative_status: "Approved",
        attendance_status: "Approved",
        documentation_status: "Approved",
        certificate_status: "Approved",
      },
      over_all_status: "Completed",
    },
    {
      _id: "6",
      type: "external",
      activity_type: "Competition",
      event_title: "Inter-University Debate Competition",
      event_description:
        "Representing the university at the annual debate competition",
      event_date: new Date("2025-04-05"),
      event_score: 25,
      documents: {
        narrative_report_status: "Not Submitted",
        official_invitation_status: "Approved",
        liquidation_report_status: "Not Submitted",
        echo_seminar_document_status: "Not Submitted",
        cm063_documents_status: "Not Submitted",
        photo_documentation_status: "Approved",
      },
      over_all_status: "In Progress",
    },
  ];

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setAccomplishments(dummyAccomplishments);

      // Calculate total score
      const total = dummyAccomplishments.reduce(
        (sum, item) => sum + item.event_score,
        0
      );
      setTotalScore(total);

      setLoading(false);
    }, 100);
  }, []);

  useEffect(() => {
    // Filter accomplishments based on selected category
    if (selectedCategory === "all") {
      setFilteredAccomplishments(accomplishments);
    } else {
      setFilteredAccomplishments(
        accomplishments.filter((item) => item.type === selectedCategory)
      );
    }
  }, [selectedCategory, accomplishments]);

  // Calculate completion stats
  const getStatusCounts = () => {
    const completed = accomplishments.filter(
      (item) => item.over_all_status === "Completed"
    ).length;
    const inProgress = accomplishments.filter(
      (item) => item.over_all_status === "In Progress"
    ).length;
    const notStarted = accomplishments.filter(
      (item) => item.over_all_status === "Not Started"
    ).length;

    return { completed, inProgress, notStarted };
  };

  const { completed, inProgress, notStarted } = getStatusCounts();

  // Prepare data for the circular progress chart
  const progressData = [
    { name: "Completed", value: completed, color: "#10B981" },
    { name: "In Progress", value: inProgress, color: "#F59E0B" },
    {
      name: "Not Started",
      value: notStarted > 0 ? notStarted : 0,
      color: "#EF4444",
    },
    {
      name: "Remaining",
      value: Math.max(0, 100 - totalScore),
      color: "#E5E7EB",
    },
  ];

  // Format date to display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Status icon component
  const StatusIcon = ({ status }) => {
    if (status === "Completed" || status === "Approved") {
      return (
        <FontAwesomeIcon
          icon={faCircleCheck}
          className="w-5 h-5 text-green-500"
        />
      );
    } else if (status === "In Progress" || status === "Pending") {
      return (
        <FontAwesomeIcon icon={faClock} className="w-5 h-5 text-amber-500" />
      );
    } else {
      return (
        <FontAwesomeIcon
          icon={faArrowLeftRotate}
          className="w-5 h-5 text-red-500"
        />
      );
    }
  };

  const handleViewProposal = (proposal) => {
    setSelectedProposal(proposal);
    setViewModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading accomplishments data...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          Organization Accomplishments
        </h1>

        {/* Progress Overview Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Circular Progress Chart */}
          <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center">
            <h2 className="text-lg font-semibold mb-3">Progress Overview</h2>
            <div className="w-48 h-48 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={progressData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                  >
                    {progressData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, "Progress"]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col justify-center items-center">
                <p className="text-3xl font-bold">{totalScore}</p>
                <p className="text-sm text-gray-500">out of 100 points</p>
              </div>
            </div>
            <div className="flex justify-center mt-4 gap-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                <span className="text-xs">Completed ({completed})</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-amber-500 mr-1"></div>
                <span className="text-xs">In Progress ({inProgress})</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                <span className="text-xs">Not Started ({notStarted})</span>
              </div>
            </div>
          </div>

          {/* Score Breakdown */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-3">Score Breakdown</h2>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Proposed Activities:</span>
                <span className="font-semibold">
                  {accomplishments
                    .filter((a) => a.type === "proposed")
                    .reduce((sum, item) => sum + item.event_score, 0)}{" "}
                  points
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Institutional Activities:</span>
                <span className="font-semibold">
                  {accomplishments
                    .filter((a) => a.type === "institutional")
                    .reduce((sum, item) => sum + item.event_score, 0)}{" "}
                  points
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>External Activities:</span>
                <span className="font-semibold">
                  {accomplishments
                    .filter((a) => a.type === "external")
                    .reduce((sum, item) => sum + item.event_score, 0)}{" "}
                  points
                </span>
              </div>
              <div className="pt-2 border-t border-gray-200 mt-2">
                <div className="flex justify-between items-center font-bold">
                  <span>Total Score:</span>
                  <span className={totalScore > 100 ? "text-green-600" : ""}>
                    {totalScore} points {totalScore > 100 && "⭐"}
                  </span>
                </div>
                {totalScore > 100 && (
                  <p className="text-xs text-green-600 mt-1">
                    Exceeded target by {totalScore - 100} points!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-3">Activity Summary</h2>
            <div className="grid grid-cols-1 gap-3">
              <div className="bg-white rounded p-3 shadow-sm">
                <div className="text-sm text-gray-500">Total Activities</div>
                <div className="text-2xl font-bold">
                  {accomplishments.length}
                </div>
              </div>

              <div className="bg-white rounded p-3 shadow-sm">
                <div className="text-sm text-gray-500">Upcoming Activities</div>
                <div className="text-2xl font-bold">
                  {
                    accomplishments.filter(
                      (a) => new Date(a.event_date) > new Date()
                    ).length
                  }
                </div>
              </div>

              <div className="bg-white rounded p-3 shadow-sm">
                <div className="text-sm text-gray-500">Completion Rate</div>
                <div className="text-2xl font-bold">
                  {accomplishments.length > 0
                    ? `${Math.round(
                        (completed / accomplishments.length) * 100
                      )}%`
                    : "0%"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`px-4 py-2 font-medium text-sm ${
              selectedCategory === "all"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setSelectedCategory("all")}
          >
            All Activities
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              selectedCategory === "proposed"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setSelectedCategory("proposed")}
          >
            Proposed
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              selectedCategory === "institutional"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setSelectedCategory("institutional")}
          >
            Institutional
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              selectedCategory === "external"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setSelectedCategory("external")}
          >
            External
          </button>
        </div>

        {/* Activities List */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAccomplishments.length > 0 ? (
                filteredAccomplishments.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="py-4 px-6 text-sm">
                      <div className="font-medium text-gray-900">
                        {item.event_title}
                      </div>
                      <div className="text-gray-500 text-xs line-clamp-1">
                        {item.event_description}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500 capitalize">
                      {item.activity_type}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500">
                      {formatDate(item.event_date)}
                    </td>
                    <td className="py-4 px-6 text-sm">
                      <div className="flex items-center">
                        <StatusIcon status={item.over_all_status} />
                        <span className="ml-1">{item.over_all_status}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm font-medium">
                      {item.event_score} pts
                    </td>
                    <td className="py-4 px-6 text-sm">
                      <button
                        onClick={() => handleViewProposal(item)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        View
                      </button>
                      {item.over_all_status !== "Completed" && (
                        <button
                          onClick={() => {
                            setSelectedProposal(item);
                            setEditModalOpen(true);
                          }}
                          className="text-green-600 hover:text-green-900"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="py-4 px-6 text-center text-gray-500"
                  >
                    No activities found for this category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* View Modal would go here */}
        {viewModalOpen && selectedProposal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">
                    {selectedProposal.event_title}
                  </h2>
                  <button
                    onClick={() => setViewModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Description</h3>
                    <p className="text-gray-600">
                      {selectedProposal.event_description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium">Activity Type</h3>
                      <p className="text-gray-600 capitalize">
                        {selectedProposal.activity_type}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium">Category</h3>
                      <p className="text-gray-600 capitalize">
                        {selectedProposal.type}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium">Event Date</h3>
                      <p className="text-gray-600">
                        {formatDate(selectedProposal.event_date)}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium">Status</h3>
                      <div className="flex items-center text-gray-600">
                        <StatusIcon status={selectedProposal.over_all_status} />
                        <span className="ml-1">
                          {selectedProposal.over_all_status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Documents Status</h3>
                    <div className="bg-gray-50 p-3 rounded">
                      {selectedProposal.type === "proposed" && (
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Approved Proposal:</span>
                            <div className="flex items-center">
                              <StatusIcon
                                status={
                                  selectedProposal.documents
                                    .approved_proposal_status
                                }
                              />
                              <span className="ml-1">
                                {
                                  selectedProposal.documents
                                    .approved_proposal_status
                                }
                              </span>
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <span>Attendance Sheet:</span>
                            <div className="flex items-center">
                              <StatusIcon
                                status={
                                  selectedProposal.documents
                                    .attendance_sheet_status
                                }
                              />
                              <span className="ml-1">
                                {
                                  selectedProposal.documents
                                    .attendance_sheet_status
                                }
                              </span>
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <span>Narrative Report:</span>
                            <div className="flex items-center">
                              <StatusIcon
                                status={
                                  selectedProposal.documents
                                    .narrative_report_status
                                }
                              />
                              <span className="ml-1">
                                {
                                  selectedProposal.documents
                                    .narrative_report_status
                                }
                              </span>
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <span>Financial Report:</span>
                            <div className="flex items-center">
                              <StatusIcon
                                status={
                                  selectedProposal.documents
                                    .financial_report_status
                                }
                              />
                              <span className="ml-1">
                                {
                                  selectedProposal.documents
                                    .financial_report_status
                                }
                              </span>
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <span>Evaluation Summary:</span>
                            <div className="flex items-center">
                              <StatusIcon
                                status={
                                  selectedProposal.documents
                                    .evaluation_summary_status
                                }
                              />
                              <span className="ml-1">
                                {
                                  selectedProposal.documents
                                    .evaluation_summary_status
                                }
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedProposal.type === "institutional" && (
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Narrative Report:</span>
                            <div className="flex items-center">
                              <StatusIcon
                                status={
                                  selectedProposal.documents.narrative_status
                                }
                              />
                              <span className="ml-1">
                                {selectedProposal.documents.narrative_status}
                              </span>
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <span>Attendance Sheet:</span>
                            <div className="flex items-center">
                              <StatusIcon
                                status={
                                  selectedProposal.documents.attendance_status
                                }
                              />
                              <span className="ml-1">
                                {selectedProposal.documents.attendance_status}
                              </span>
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <span>Documentation:</span>
                            <div className="flex items-center">
                              <StatusIcon
                                status={
                                  selectedProposal.documents
                                    .documentation_status
                                }
                              />
                              <span className="ml-1">
                                {
                                  selectedProposal.documents
                                    .documentation_status
                                }
                              </span>
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <span>Certificate:</span>
                            <div className="flex items-center">
                              <StatusIcon
                                status={
                                  selectedProposal.documents.certificate_status
                                }
                              />
                              <span className="ml-1">
                                {selectedProposal.documents.certificate_status}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedProposal.type === "external" && (
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Narrative Report:</span>
                            <div className="flex items-center">
                              <StatusIcon
                                status={
                                  selectedProposal.documents
                                    .narrative_report_status
                                }
                              />
                              <span className="ml-1">
                                {
                                  selectedProposal.documents
                                    .narrative_report_status
                                }
                              </span>
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <span>Official Invitation:</span>
                            <div className="flex items-center">
                              <StatusIcon
                                status={
                                  selectedProposal.documents
                                    .official_invitation_status
                                }
                              />
                              <span className="ml-1">
                                {
                                  selectedProposal.documents
                                    .official_invitation_status
                                }
                              </span>
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <span>Liquidation Report:</span>
                            <div className="flex items-center">
                              <StatusIcon
                                status={
                                  selectedProposal.documents
                                    .liquidation_report_status
                                }
                              />
                              <span className="ml-1">
                                {
                                  selectedProposal.documents
                                    .liquidation_report_status
                                }
                              </span>
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <span>Echo Seminar Document:</span>
                            <div className="flex items-center">
                              <StatusIcon
                                status={
                                  selectedProposal.documents
                                    .echo_seminar_document_status
                                }
                              />
                              <span className="ml-1">
                                {
                                  selectedProposal.documents
                                    .echo_seminar_document_status
                                }
                              </span>
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <span>CM063 Documents:</span>
                            <div className="flex items-center">
                              <StatusIcon
                                status={
                                  selectedProposal.documents
                                    .cm063_documents_status
                                }
                              />
                              <span className="ml-1">
                                {
                                  selectedProposal.documents
                                    .cm063_documents_status
                                }
                              </span>
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <span>Photo Documentation:</span>
                            <div className="flex items-center">
                              <StatusIcon
                                status={
                                  selectedProposal.documents
                                    .photo_documentation_status
                                }
                              />
                              <span className="ml-1">
                                {
                                  selectedProposal.documents
                                    .photo_documentation_status
                                }
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setViewModalOpen(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal would go here */}
        {/* This would be implemented similarly to the View Modal but with form inputs */}
      </div>
    </div>
  );
}
