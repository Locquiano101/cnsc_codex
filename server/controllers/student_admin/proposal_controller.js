import { Proposal } from "../../models/documents.js";

export const SubmitProposalsStudent = async (req, res) => {
  console.log("Creating new post...");
  console.log("Body:", req.body);
  console.log("Files FROM PROPOSALS:", req.files);

  try {
    const {
      organization_id,
      title,
      event_date,
      description,
      notice_document,
      proposal_document,
      minutes_document,
      photo_documentations,
      resolution_document,
    } = req.body;

    console.log(req.body);
    const proposal = new Proposal({
      organization: organization_id,
      title,
      event_date,
      description,
      approval_status: "Pending", // Student always starts at Pending

      meeting: {
        // required docs
        proposal_document,
        notice_document,
        minutes_document,

        // optional files
        photo_documentations: Array.isArray(photo_documentations)
          ? photo_documentations
          : [photo_documentations],
        resolution_document: Array.isArray(resolution_document)
          ? resolution_document
          : [resolution_document],

        // initialize notes and statuses
        proposal_document_note: "",
        proposal_document_status: "Pending",

        notice_document_note: "",
        notice_document_status: "Pending",

        minutes_document_note: "",
        minutes_document_status: "Pending",
      },
    });
    console.log(proposal);

    const savedProposal = await proposal.save();
    return res.status(201).json({
      message: "Proposal submitted successfully",
      proposal: savedProposal,
    });
  } catch (err) {
    console.error("Error submitting proposal:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};
export const UpdateProposalsStudent = async (req, res) => {
  try {
    const proposalId = req.params.proposalId;
    const proposal = await Proposal.findById(proposalId);
    if (!proposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    const { organization_id, title, event_date, description } = req.body;

    const docFiles = req.files?.document || [];
    const photoFiles = req.files?.photo || [];

    // Helper to resolve filename based on original name in req.body
    const resolveFile = (bucket, originalName) => {
      const match = bucket.find((f) => f.originalname === originalName);
      return match ? match.filename : originalName;
    };

    const resolveMultiple = (bucket, field) => {
      const value = req.body[field];
      if (!value) return proposal.meeting[field];
      const names = Array.isArray(value) ? value : [value];
      return names.map((name) => resolveFile(bucket, name));
    };

    // Update basic fields
    proposal.organization = organization_id;
    proposal.approval_status = "Revision Applied by the Student Leader";
    proposal.title = title;
    proposal.event_date = event_date;
    proposal.description = description;

    // Flags to check if fields were updated
    const isNoticeDocUpdated = !!req.body.notice_document;
    const isMinutesDocUpdated = !!req.body.minutes_document;
    const isProposalDocUpdated = !!req.body.proposal_document;

    // Update meeting fields
    proposal.meeting = {
      ...proposal.meeting,

      proposal_document: isProposalDocUpdated
        ? resolveFile(docFiles, req.body.proposal_document)
        : proposal.meeting.proposal_document,

      proposal_document_note: isProposalDocUpdated
        ? "Revision Applied Student Leader"
        : proposal.meeting.proposal_document_note,

      proposal_document_status: isProposalDocUpdated
        ? "Revision Applied Student Leader"
        : proposal.meeting.proposal_document_status,

      notice_document: isNoticeDocUpdated
        ? resolveFile(docFiles, req.body.notice_document)
        : proposal.meeting.notice_document,
      notice_document_note: isNoticeDocUpdated
        ? "Revision Applied Student Leader"
        : proposal.meeting.notice_document_note,
      notice_document_status: isNoticeDocUpdated
        ? "Revision Applied Student Leader"
        : proposal.meeting.notice_document_status,

      minutes_document: isMinutesDocUpdated
        ? resolveFile(docFiles, req.body.minutes_document)
        : proposal.meeting.minutes_document,

      minutes_document_note: isMinutesDocUpdated
        ? "Revision Applied Student Leader"
        : proposal.meeting.minutes_document_note,

      minutes_document_status: isMinutesDocUpdated
        ? "Revision Applied Student Leader"
        : proposal.meeting.minutes_document_status,

      resolution_document: req.body.resolution_document
        ? resolveMultiple(docFiles, "resolution_document")
        : proposal.meeting.resolution_document,

      photo_documentations: req.body.photo_documentations
        ? resolveMultiple(photoFiles, "photo_documentations")
        : proposal.meeting.photo_documentations,
    };

    const updatedProposal = await proposal.save();

    return res.status(200).json({
      message: "Proposal updated successfully",
      proposal: updatedProposal,
    });
  } catch (err) {
    console.error("Error updating proposal:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};
