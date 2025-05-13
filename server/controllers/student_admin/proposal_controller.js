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

    // Get the list of updated fields
    const updatedFields = req.body.updated_fields
      ? Array.isArray(req.body.updated_fields)
        ? req.body.updated_fields
        : [req.body.updated_fields]
      : [];

    console.log("Updated fields received:", updatedFields);

    const docFiles = req.files?.document || [];
    const photoFiles = req.files?.photo || [];

    console.log(
      "Document files received:",
      docFiles.map((f) => f.originalname)
    );
    console.log(
      "Photo files received:",
      photoFiles.map((f) => f.originalname)
    );

    // Helper to find a file by its original name from the filename field
    const findFileByOriginalName = (files, originalName) => {
      return files.find((f) => f.originalname === originalName);
    };

    // Update basic fields
    proposal.organization = organization_id;
    proposal.approval_status = "Revision Applied by the Student Leader";
    proposal.title = title;
    proposal.event_date = event_date;
    proposal.description = description;

    // Create a clone of the existing meeting object
    const updatedMeeting = { ...proposal.meeting };

    // Process document fields
    const documentFields = [
      "proposal_document",
      "notice_document",
      "minutes_document",
    ];

    documentFields.forEach((field) => {
      // Check if there's a filename field for this document
      const filenameField = `${field}_filename`;

      if (req.body[filenameField]) {
        const originalName = req.body[filenameField];
        const file = findFileByOriginalName(docFiles, originalName);

        if (file) {
          // Update the document field with the new filename
          updatedMeeting[field] = file.filename;

          // Update the corresponding status and note
          updatedMeeting[`${field}_status`] = "Revision Applied Student Leader";
          updatedMeeting[`${field}_note`] = "Revision Applied Student Leader";

          console.log(`Updated ${field} with file: ${file.filename}`);
        }
      }
    });

    // Handle resolution_document (can be multiple)
    if (req.body["resolution_document_filename"]) {
      const filenames = Array.isArray(req.body["resolution_document_filename"])
        ? req.body["resolution_document_filename"]
        : [req.body["resolution_document_filename"]];

      const resolvedFiles = filenames
        .map((name) => findFileByOriginalName(docFiles, name))
        .filter(Boolean)
        .map((file) => file.filename);

      if (resolvedFiles.length > 0) {
        updatedMeeting.resolution_document = resolvedFiles;
        console.log(`Updated resolution_document with files:`, resolvedFiles);
      }
    }

    // Handle photo_documentations (can be multiple)
    if (req.body["photo_documentations_filename"]) {
      const filenames = Array.isArray(req.body["photo_documentations_filename"])
        ? req.body["photo_documentations_filename"]
        : [req.body["photo_documentations_filename"]];

      const resolvedFiles = filenames
        .map((name) => findFileByOriginalName(photoFiles, name))
        .filter(Boolean)
        .map((file) => file.filename);

      if (resolvedFiles.length > 0) {
        updatedMeeting.photo_documentations = resolvedFiles;
        console.log(`Updated photo_documentations with files:`, resolvedFiles);
      }
    }

    // Update the meeting object
    proposal.meeting = updatedMeeting;

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
