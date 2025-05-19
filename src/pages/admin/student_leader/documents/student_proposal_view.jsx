import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_ROUTER } from "../../../../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faDeleteLeft,
  faEye,
  faPencil,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import ProposalSubmissionStudentSection from "./student_proposal_add";
import EditProposalStudentSection from "./student_proposal_edit";

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

  const indexOfLastProposal = currentPage * itemsPerPage;
  const indexOfFirstProposal = indexOfLastProposal - itemsPerPage;
  const currentProposals = proposals.slice(
    indexOfFirstProposal,
    indexOfLastProposal
  );

  const goToPage = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  if (loading) return <p className="p-4 font-sans">Loading proposals…</p>;
  if (error) return <p className="p-4 text-red-500 font-sans">{error}</p>;

  return (
    <div className="h-screen flex flex-col overflow-hidden p-5 font-sans">
      <div className="bg-[#222222] text-white p-3 flex justify-between items-center">
        <h1 className="font-bold text-base">Proposals</h1>
        <button
          onClick={onAdd}
          className="flex items-center gap-1 bg-[#fd7e14] text-white px-3 py-1 rounded text-sm"
        >
          <FontAwesomeIcon icon={faAdd} />
          <span className="font-bold">Add Proposal</span>
        </button>
      </div>

      <div className="overflow-hidden border border-gray-200 rounded">
        <div className="max-h-[400px] overflow-y-auto">
          <table className="w-full table-fixed border-collapse">
            <thead className="sticky top-0 bg-gray-50 z-10">
              <tr>
                <th className="text-start text-xs p-3 font-bold text-gray-600 uppercase border-b w-1/4">
                  Title
                </th>
                <th className="text-start text-xs p-3 font-bold text-gray-600 uppercase border-b w-1/3">
                  Description
                </th>
                <th className="text-start text-xs p-3 font-bold text-gray-600 uppercase border-b w-1/4">
                  Status
                </th>
                <th className="text-start text-xs p-3 font-bold text-gray-600 uppercase border-b w-1/6">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
              {currentProposals.length > 0 ? (
                currentProposals.map((p) => (
                  <tr
                    key={p._id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-normal text-gray-800">
                      {p.title}
                    </td>
                    <td
                      className="px-4 py-4 max-w-xs truncate text-sm text-gray-600 font-normal"
                      title={p.description}
                    >
                      {p.description}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
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
                        <span className="font-normal">{p.approval_status}</span>
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center text-sm font-bold">
                      <div className="flex flex-start gap-2">
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
                    className="px-4 py-10 text-center text-sm text-gray-500 italic font-normal"
                  >
                    No proposals found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="py-3 px-4 bg-gray-50 border-t flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-gray-600 font-normal">
            <span>
              Page {currentPage} of {totalPages}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded text-sm font-bold ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Previous
            </button>

            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
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
                    className={`w-8 h-8 flex items-center justify-center rounded text-sm font-bold ${
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
              className={`px-3 py-1 rounded text-sm font-bold ${
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

export default function StudentProposalTableView(user) {
  const [mode, setMode] = useState("list");
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
      <ProposalView
        onAdd={handleAdd}
        user={user}
        onView={handleView}
        onEdit={handleEdit}
      />

      {mode === "edit" && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50 font-sans">
          <EditProposalStudentSection
            selectedProposal={selectedProposal}
            onBack={handleBack}
          />
        </div>
      )}

      {mode === "add" && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50 font-sans">
          <ProposalSubmissionStudentSection mode="add" onBack={handleBack} />
        </div>
      )}
    </>
  );
}
