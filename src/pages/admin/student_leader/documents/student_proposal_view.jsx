import React, { useState, useEffect } from "react";
import axios from "axios";
import { FileRenderer } from "../../../../components/file_renderer";
import { API_ROUTER } from "../../../../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faCross,
  faDeleteLeft,
  faEye,
  faPencil,
  faTrash,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import ProposalSubmissionStudentSection from "./student_proposal_add";
import EditProposalStudentSection from "./student_proposal_edit";

const fileFields = {
  proposal_document: { label: "Proposal" },
  notice_document: { label: "Notice of Meeting" },
  minutes_document: { label: "Meeting Minutes" },
  photo_documentations: { label: "Photo Documentations", multiple: true },
  resolution_document: { label: "Resolution Document", multiple: true },
};

function ProposalView({ onAdd, onView, onEdit, user }) {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  const organizationId = user.user.organization._id;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const fetchProposals = async () => {
      try {
        const res = await axios.get(
          `${API_ROUTER}/proposals/${organizationId}`
        );

        if (!cancelled) {
          setProposals(res.data.proposals);
          setTotalPages(Math.ceil(res.data.proposals.length / itemsPerPage));
        }
      } catch (err) {
        console.error("Error fetching proposals:", err);
        if (!cancelled) setError("Could not load proposals.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchProposals();

    return () => {
      cancelled = true;
    };
  }, [organizationId]);

  // Get current proposals for pagination
  const indexOfLastProposal = currentPage * itemsPerPage;
  const indexOfFirstProposal = indexOfLastProposal - itemsPerPage;
  const currentProposals = proposals.slice(
    indexOfFirstProposal,
    indexOfLastProposal
  );

  // Change page
  const goToPage = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  if (loading) return <p className="p-4">Loading proposals…</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className=" h-full flex flex-col overflow-hidden">
      <div className="bg-brian-blue text-white p-3 flex justify-between items-center">
        <h1 className="font-medium">Proposals</h1>
        <button
          onClick={onAdd}
          className="flex items-center gap-1 bg-[#fd7e14] text-white px-3 py-1 rounded"
        >
          <FontAwesomeIcon icon={faAdd} />
          <span className="font-medium">Add Proposal</span>
        </button>
      </div>

      {/* Table container with fixed header and scrollable body */}
      <div className="flex flex-col overflow-hidden">
        {/* Table header (fixed) */}
        <div className="overflow-hidden">
          <table className="w-full bg-white border-collapse">
            <thead className="bg-gray-50 text-sm">
              <tr className="bg-gray-50">
                <th className="text-start text-xs p-3 font-semibold text-gray-600 uppercase border-b">
                  Title
                </th>
                <th className="text-start text-xs p-3 font-semibold text-gray-600 uppercase border-b">
                  Description
                </th>
                <th className="text-start text-xs p-3 font-semibold text-gray-600 uppercase border-b">
                  Status
                </th>
                <th className="text-start text-xs p-3 font-semibold text-gray-600 uppercase border-b">
                  Actions
                </th>
              </tr>
            </thead>
          </table>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-grow">
          <table className="w-full bg-white border-collapse">
            <tbody className="divide-y divide-gray-200">
              {currentProposals.length > 0 ? (
                currentProposals.map((p) => (
                  <tr
                    key={p._id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                      {p.title}
                    </td>
                    <td
                      className="px-4 py-4 max-w-xs truncate text-sm text-gray-600"
                      title={p.description}
                    >
                      {p.description}
                    </td>
                    <td className="px-4 py-4 flex flex-wrap whitespace-nowrap text-sm text-gray-600">
                      <span className="flex items-center">
                        <span
                          className={`w-2 h-2 rounded-full mr-2 ${
                            p.approval_status === "Approved by the Adviser"
                              ? "bg-green-500"
                              : p.approval_status === "Pending" ||
                                p.approval_status ===
                                  "Revision Applied by the Student Leader"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                        ></span>
                        <span>{p.approval_status}</span>
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center text-sm font-medium">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => onView(p)}
                          className="p-1.5 bg-[#17a2b8] hover:bg-[#138496] text-white rounded-full transition-colors duration-150 shadow-sm"
                          title="View"
                        >
                          <FontAwesomeIcon icon={faEye} size="sm" />
                        </button>
                        <button
                          onClick={() => onEdit(p)}
                          className="p-1.5 bg-[#28a745] hover:bg-[#218838] text-white rounded-full transition-colors duration-150 shadow-sm"
                          title="Edit"
                        >
                          <FontAwesomeIcon icon={faPencil} size="sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-4 py-10 text-center text-sm text-gray-500 italic"
                  >
                    No proposals found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="py-3 px-4 bg-gray-50 border-t flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <span>
              Page {currentPage} of {totalPages}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded text-sm ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Previous
            </button>

            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Logic to show pages around current page
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`w-8 h-8 flex items-center justify-center rounded ${
                      currentPage === pageNum
                        ? "bg-brian-blue text-white"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded text-sm ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ViewProposalCard({ proposal, onBack }) {
  if (!proposal) return <div>No proposal data available</div>;

  const basePath = `/${proposal.organization.org_name}/Proposals/${proposal.title}`;

  const renderSection = (key, multiple = false) => {
    const statusKey = `${key}_status`;
    const noteKey = `${key}_note`;

    const status = proposal.meeting[statusKey] || "Pending";
    const note = proposal.meeting[noteKey] || "Up for checking";

    return (
      <div key={key} className="mb-6 bg-white p-4 rounded-lg shadow ">
        <div className="mb-3">
          <h3 className="font-medium text-lg">
            {fileFields[key].label}{" "}
            <span className="text-sm text-gray-500">({status})</span>
          </h3>
          <span className="text-xs text-gray-600 italic">Note: {note}</span>
        </div>

        {multiple ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {proposal.meeting[key]?.map((f, i) => (
              <FileRenderer key={i} basePath={basePath} fileName={f} />
            ))}
          </div>
        ) : (
          proposal.meeting[key] && (
            <FileRenderer
              basePath={basePath}
              fileName={proposal.meeting[key]}
            />
          )
        )}
      </div>
    );
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-gray-50 relative rounded-lg h-3/4 px-10 py-6 shadow-lg max-w-4xl mx-auto">
      {/* Fixed Close Button */}
      <div className="absolute top-4 right-4 z-10">
        <FontAwesomeIcon
          icon={faX}
          className="text-xl font-bold text-red-500 cursor-pointer"
          onClick={onBack}
        />
      </div>

      {/* Scrollable Content */}
      <div className="overflow-auto h-full pr-2">
        {/* Proposal Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 rounded-t-lg mb-6">
          <h1 className="text-2xl font-bold">{proposal.title}</h1>
          <div className="flex flex-wrap gap-4 mt-2 text-sm">
            <div>
              <span className="opacity-80">Organization:</span>{" "}
              {proposal.organization.org_name}
            </div>
            <div>
              <span className="opacity-80">Status:</span>{" "}
              {proposal.approval_status}
            </div>
            <div>
              <span className="opacity-80">Event Date:</span>{" "}
              {formatDate(proposal.event_date)}
            </div>
          </div>
        </div>

        {/* Description Card */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-gray-800 whitespace-pre-line">
            {proposal.description}
          </p>
        </div>

        {/* Meeting Documents */}
        <h2 className="text-xl font-semibold mb-4">Meeting Documents</h2>
        {renderSection("proposal_document")}
        {renderSection("notice_document")}
        {renderSection("minutes_document")}
        {renderSection("photo_documentations", true)}
        {renderSection("resolution_document", true)}
      </div>
    </div>
  );
}

export default function StudentProposalTableView(user) {
  const [mode, setMode] = useState("list"); // list | view | edit | add
  const [selectedProposal, setSelectedProposal] = useState(null);

  const handleAdd = () => {
    setSelectedProposal(null);
    setMode("add");
  };

  const handleView = (proposal) => {
    setSelectedProposal(proposal);
    setMode("view");
  };

  const handleEdit = (proposal) => {
    setSelectedProposal(proposal);
    setMode("edit");
  };

  const handleBack = () => {
    setSelectedProposal(null);
    setMode("list");
  };

  return (
    <>
      {/* Base Table View */}
      <ProposalView
        onAdd={handleAdd}
        user={user}
        onView={handleView}
        onEdit={handleEdit}
      />

      {/* Modal Popups */}
      {mode === "edit" && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
          <EditProposalStudentSection
            selectedProposal={selectedProposal}
            onBack={handleBack}
          />
        </div>
      )}
      {mode === "view" && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
          <ViewProposalCard proposal={selectedProposal} onBack={handleBack} />
        </div>
      )}

      {mode === "add" && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
          <ProposalSubmissionStudentSection mode="add" onBack={handleBack} />
        </div>
      )}
    </>
  );
}
