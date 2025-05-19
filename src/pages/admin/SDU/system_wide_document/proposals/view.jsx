import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faPen,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { API_ROUTER } from "../../../../../App";
import SduProposalApprovalEdit from "./edit";

function SduProposalTable({ onEditProposal }) {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    async function fetchProposals() {
      try {
        const res = await axios.get(`${API_ROUTER}/proposals/system-wide`);
        setProposals(res.data.proposals);
      } catch (err) {
        console.error("Error fetching proposals", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProposals();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowFilterDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredProposals =
    filter === "All"
      ? proposals
      : proposals.filter((p) => p.approval_status === filter);

  if (loading) return <p className="p-4">Loading proposals…</p>;

  return (
    <div className="h-full border">
      <div className="bg-[#1e4976] text-white p-3 flex justify-between items-center">
        <h1 className="font-medium">Proposal Submissions</h1>

        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className="flex items-center gap-2 bg-white text-[#1e4976] px-3 py-1 rounded"
          >
            <FontAwesomeIcon icon={faChevronDown} />
            Filter: {filter}
          </button>

          {showFilterDropdown && (
            <div className="absolute right-0 mt-1 w-48 bg-white border rounded-md shadow-lg z-10">
              {["All", "Pending", "Approved", "Rejected"].map((f) => (
                <button
                  key={f}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    filter === f
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => {
                    setFilter(f);
                    setShowFilterDropdown(false);
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-3 text-left text-xs font-semibold text-gray-600 border-b">
                Title
              </th>
              <th className="p-3 text-left text-xs font-semibold text-gray-600 border-b">
                Organization
              </th>
              <th className="p-3 text-left text-xs font-semibold text-gray-600 border-b">
                Event Date
              </th>
              <th className="p-3 text-left text-xs font-semibold text-gray-600 border-b">
                Status
              </th>
              <th className="p-3 text-center text-xs font-semibold text-gray-600 border-b">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredProposals.length > 0 ? (
              filteredProposals.map((proposal, idx) => (
                <tr key={proposal._id || idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {proposal.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {proposal.organization?.org_name ?? "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(proposal.event_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        proposal.approval_status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : proposal.approval_status === "Approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {proposal.approval_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      className="p-1.5 bg-[#17a2b8] hover:bg-[#138496] text-white rounded-full"
                      title="View"
                      onClick={() => onEditProposal(proposal)}
                    >
                      <FontAwesomeIcon icon={faPen} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center text-gray-500 py-8 italic"
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

function PopupModal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-xs">
      <div className="relative bg-white rounded-lg shadow-lg w-4/5 max-w-4xl max-h-[90vh] overflow-auto">
        <div className="absolute top-4 right-4">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export default function SduProposalApprovalSection({ user }) {
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditProposal = (proposal) => {
    setSelectedProposal(proposal);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    // Optionally refresh the proposal list here
  };

  return (
    <>
      <SduProposalTable onEditProposal={handleEditProposal} />

      <PopupModal isOpen={isEditModalOpen} onClose={handleCloseModal}>
        {selectedProposal && (
          <SduProposalApprovalEdit
            user={user}
            proposal={selectedProposal}
            onClose={handleCloseModal}
          />
        )}
      </PopupModal>
    </>
  );
}
