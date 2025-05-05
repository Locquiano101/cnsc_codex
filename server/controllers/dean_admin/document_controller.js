import { Proposal } from "../../models/documents.js";

export const UpdateProposalsNotesAdviser = async (req, res) => {
  try {
    const { proposalId } = req.params;
    const { approval_status, meeting = {} } = req.body;

    const updateFields = {
      approval_status: approval_status || "Pending",

      "meeting.notice_document_note": meeting.notice_document_note,
      "meeting.minutes_document_note": meeting.minutes_document_note,
      "meeting.proposal_document_note": meeting.proposal_document_note,

      "meeting.notice_document_status": meeting.notice_document_status,
      "meeting.minutes_document_status": meeting.minutes_document_status,
      "meeting.proposal_document_status": meeting.proposal_document_status,
    };

    const updated = await Proposal.findByIdAndUpdate(
      proposalId,
      { $set: updateFields },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    return res.status(200).json({
      message: "Proposal updated successfully",
      proposal: updated,
    });
  } catch (err) {
    console.error("Error updating proposal:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};
