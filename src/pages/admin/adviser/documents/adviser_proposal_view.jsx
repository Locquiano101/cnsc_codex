import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_ROUTER } from "../../../../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faEye, faPencil } from "@fortawesome/free-solid-svg-icons";
import EditProposalAdviserSection from "./adviser_proposal_edit";
import { FileRenderer } from "../../../../components/file_renderer";

function ViewProposalAdviserTableSection({ onView, onEdit, user }) {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const organizationId = user.organization._id;

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

  if (loading) return <p className="p-4">Loading proposals…</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="  shadow-lg flex flex-col h-full p-7">
      {/* Header */}
      <div className="bg-[#1e4976] text-white p-3  font-medium">Proposals</div>

      {/* Table */}
      <div className="overflow-y-auto h-full shadow-2xl">
        <table className="min-w-full text-sm text-gray-800">
          <thead className="bg-gray-100 text-xs uppercase tracking-wide text-gray-600 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-left bg-gray-100">Title</th>
              <th className="px-6 py-3 text-left bg-gray-100">Description</th>
              <th className="px-6 py-3 text-left bg-gray-100">Status</th>
              <th className="px-6 py-3 text-center bg-gray-100">Actions</th>
            </tr>
          </thead>
          <tbody>
            {proposals.length > 0 ? (
              proposals.map((p) => (
                <tr
                  key={p._id}
                  className="border-t border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 font-medium">{p.title}</td>
                  <td
                    className="px-6 py-4 max-w-xs truncate"
                    title={p.description}
                  >
                    {p.description}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        p.approval_status === "Approved by the Adviser"
                          ? "bg-green-100 text-green-700"
                          : p.approval_status === "Approved by the Dean"
                          ? "bg-blue-100 text-blue-700"
                          : p.approval_status ===
                            "Approved by the OSSD Coordinator"
                          ? "bg-blue-100 text-Blue-700"
                          : p.approval_status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {p.approval_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => onView(p)}
                        className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition"
                        title="View Proposal"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button
                        onClick={() => onEdit(p)}
                        className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-full transition"
                        title="Edit Proposal"
                      >
                        <FontAwesomeIcon icon={faPencil} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center px-6 py-8 text-gray-400 italic"
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

export default function ProposalSectionAdviser({ user }) {
  const [mode, setMode] = useState("list"); // list | view | edit | add
  const [selectedProposal, setSelectedProposal] = useState(null);

  const handleAdd = () => {
    setSelectedProposal(null);
    setMode("add");
  };
  const handleView = (p) => {
    setSelectedProposal(p);
    setMode("view");
  };
  const handleEdit = (p) => {
    setSelectedProposal(p);
    setMode("edit");
  };
  const handleBack = () => {
    setSelectedProposal(null);
    setMode("list");
  };

  switch (mode) {
    case "list":
      return (
        <ViewProposalAdviserTableSection
          onAdd={handleAdd}
          onView={handleView}
          onEdit={handleEdit}
          user={user}
        />
      );

    case "add":
      return (
        <ProposalSubmissionStudentSection mode="add" onBack={handleBack} />
      );

    case "edit":
      return (
        <EditProposalAdviserSection
          user={user}
          proposal={selectedProposal}
          onBack={handleBack}
        />
      );

    default:
      return null;
  }
}
