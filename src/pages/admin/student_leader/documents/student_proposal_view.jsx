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
  const organizationId = user.user.organization._id;

  console.log(user);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await axios.get(
          `${API_ROUTER}/proposals/${organizationId}`
        );
        if (!cancelled) setProposals(res.data.proposals);
      } catch (err) {
        console.error("Error fetching proposals:", err);
        if (!cancelled) setError("Could not load proposals.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [organizationId]);

  const formatDate = (isoString) =>
    new Date(isoString).toLocaleDateString(undefined, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  if (loading) return <p className="p-4">Loading proposals…</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div>
      <div className="bg-[#1e4976] text-white p-3 flex justify-between items-center">
        <h1 className="font-medium">Proposals</h1>
        <button
          onClick={onAdd}
          className="flex items-center gap-1 bg-[#fd7e14] text-white px-3 py-1 rounded"
        >
          <FontAwesomeIcon icon={faAdd} />
          <span className="font-medium">Add Proposal</span>
        </button>
      </div>

      {/* Table wrapper with fixed height */}
      <div className="max-h-[500px] overflow-y-auto h-110 shadow-2xl">
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
          <tbody className="divide-y divide-gray-200">
            {proposals.length > 0 ? (
              proposals.map((p) => (
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
    setSelectedProposal(proposal, user);
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

  switch (mode) {
    case "list":
      return (
        <ProposalView
          onAdd={handleAdd}
          user={user}
          onView={handleView}
          onEdit={handleEdit}
        />
      );
    case "edit":
      return <EditProposalStudentSection selectedProposal={selectedProposal} />;
    case "add":
      return (
        <ProposalSubmissionStudentSection mode="add" onBack={handleBack} />
      );
    default:
      return <EditProposalStudentSection />;
  }
}
