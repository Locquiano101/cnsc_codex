import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_ROUTER } from "../../../../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faEye, faPencil } from "@fortawesome/free-solid-svg-icons";
import { FileRenderer } from "../../../../components/file_renderer";
import EditProposalOSSDSection from "./ossd_proposal_edit";
// Modal Component
function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-xl font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className="overflow-y-auto p-4 flex-grow">{children}</div>
      </div>
    </div>
  );
}

// View Proposal Content Component
function ViewProposalContent({ proposal }) {
  const basePath = `/${proposal.organization.org_name}/Proposals/${proposal.title}`;

  const {
    proposal_document,
    proposal_document_status,
    proposal_document_note,
    notice_document,
    notice_document_status,
    notice_document_notes,
    minutes_document,
    minutes_document_status,
    minutes_document_note,
    resolution_document = [],
    resolution_document_status,
    resolution_document_note,
    photo_documentations = [],
    photo_documentations_status,
    photo_documentations_note,
  } = proposal.meeting;

  return (
    <div className="space-y-4">
      {/* Title and description */}
      <div className="flex flex-wrap justify-between">
        <h2 className="text-2xl font-bold">Proposal Title: {proposal.title}</h2>
        <h2 className="text-lg">
          Proposal description: {proposal.description}
        </h2>
      </div>

      {/* Proposal Document */}
      <section>
        <h3 className="font-semibold mb-1">Proposal Document:</h3>
        {proposal_document ? (
          <>
            <FileRenderer basePath={basePath} fileName={proposal_document} />
            <p>
              <strong>Status:</strong> {proposal_document_status}
            </p>
            {proposal_document_status === "revision" && (
              <p>
                <strong>Note:</strong> {proposal_document_note}
              </p>
            )}
          </>
        ) : (
          <p className="italic text-sm">None</p>
        )}
      </section>
      <hr />
      {/* Notice Document */}
      <section>
        <h3 className="font-semibold mb-1">Notice Document:</h3>
        {notice_document ? (
          <>
            <FileRenderer basePath={basePath} fileName={notice_document} />
            <p>
              <strong>Status:</strong> {notice_document_status}
            </p>
            {notice_document_status === "revision" && (
              <p>
                <strong>Note:</strong> {notice_document_notes}
              </p>
            )}
          </>
        ) : (
          <p className="italic text-sm">None</p>
        )}
      </section>
      <hr />
      {/* Minutes Document */}
      <section>
        <h3 className="font-semibold mb-1">Minutes Document:</h3>
        {minutes_document ? (
          <>
            <FileRenderer basePath={basePath} fileName={minutes_document} />
            <p>
              <strong>Status:</strong> {minutes_document_status}
            </p>
            {minutes_document_status === "revision" && (
              <p>
                <strong>Note:</strong> {minutes_document_note}
              </p>
            )}
          </>
        ) : (
          <p className="italic text-sm">None</p>
        )}
      </section>
      <hr />
      {/* Resolution Documents */}
      <section>
        <h3 className="font-semibold mb-1">Resolution Documents:</h3>
        {resolution_document.length > 0 ? (
          <>
            {resolution_document_status && (
              <>
                <p>
                  <strong>Status:</strong> {resolution_document_status}
                </p>
                {resolution_document_status === "revision" && (
                  <p>
                    <strong>Note:</strong> {resolution_document_note}
                  </p>
                )}
              </>
            )}
            <ul className="list-disc pl-5 space-y-1">
              {resolution_document.map((file, i) => (
                <li key={i}>
                  <FileRenderer basePath={basePath} fileName={file} />
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="italic text-sm">None</p>
        )}
      </section>
      <hr />
      {/* Photo Documentations */}
      <section>
        <h3 className="font-semibold">Meeting's Photo Documentations</h3>
        {photo_documentations_status && (
          <>
            <p>
              <strong>Status:</strong> {photo_documentations_status}
            </p>
            {photo_documentations_status === "revision" && (
              <p>
                <strong>Note:</strong> {photo_documentations_note}
              </p>
            )}
          </>
        )}
        {photo_documentations.length > 0 ? (
          <div className="flex overflow-x-auto space-x-4 p-2">
            {photo_documentations.map((file, i) => (
              <FileRenderer key={i} basePath={basePath} fileName={file} />
            ))}
          </div>
        ) : (
          <p className="italic text-sm">None</p>
        )}
      </section>
    </div>
  );
}

function ViewProposalOSSDTableSection({ onView, onEdit, organization }) {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAllProposals = async () => {
      if (!organization || organization.length === 0) {
        setError("No organizations provided.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        // Extract organization IDs
        const organizationIds = organization.map((org) => org._id);

        // Call the API endpoint with the organization IDs
        const response = await axios.post(`${API_ROUTER}/proposals/dean`, {
          organizationIds,
        });

        // Set the proposals from the response
        setProposals(response.data.proposals);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching proposals:", err);
        setError(err.response?.data?.message || "Failed to fetch proposals");
        setLoading(false);
      }
    };

    fetchAllProposals();
  }, [organization]);

  if (loading) return <p className="p-4">Loading proposals…</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="shadow-lg shadow-gray-300 flex flex-col h-full">
      {/* Header */}
      <div className="bg-[#1e4976] text-white p-3  font-medium">Proposals</div>

      {/* Table */}
      <div className="overflow-y-auto">
        <table className="min-w-full text-sm text-gray-800">
          <thead className="bg-gray-100 text-xs uppercase tracking-wide text-gray-600 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-left">Title</th>
              <th className="px-6 py-3 text-left">Description</th>
              <th className="px-6 py-3 text-left">Organization</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-center">Actions</th>
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
                  <td className="px-6 py-4">{p.organization.org_name}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        p.approval_status === "Approved by the Adviser"
                          ? "bg-blue-100 text-Blue-700"
                          : p.approval_status === "Approved by the Dean"
                          ? "bg-blue-100 text-blue-700"
                          : p.approval_status ===
                            "Approved by the OSSD Coordinator"
                          ? "bg-green-100 text-green-700"
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

export default function ProposalsEditOSSD({ organization }) {
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);

  const handleView = (proposal) => {
    setSelectedProposal(proposal);
    setViewModalOpen(true);
  };

  const handleEdit = (proposal) => {
    setSelectedProposal(proposal);
    setEditModalOpen(true);
  };

  const closeViewModal = () => {
    setViewModalOpen(false);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
  };

  return (
    <>
      <ViewProposalOSSDTableSection
        onView={handleView}
        onEdit={handleEdit}
        organization={organization}
      />

      {/* View Proposal Modal */}
      <Modal
        isOpen={viewModalOpen}
        onClose={closeViewModal}
        title="View Proposal Details"
      >
        {selectedProposal && (
          <ViewProposalContent proposal={selectedProposal} />
        )}
      </Modal>

      {/* Edit Proposal Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={closeEditModal}
        title="Edit Proposal"
      >
        {selectedProposal && (
          <div className="">
            <EditProposalOSSDSection
              proposal={selectedProposal}
              onBack={closeEditModal}
            />
          </div>
        )}
      </Modal>
    </>
  );
}
