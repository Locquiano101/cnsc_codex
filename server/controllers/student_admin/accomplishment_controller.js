// controllers/activityController.js
import {
  ProposedAccomplishments,
  InstutionalAccomplisments,
  ExternalAccomplishments,
} from "../../models/documents.js";

/**
 * Expects multer to handle:
 *   resolution, attendance_sheet, narrative_report,
 *   financial_report, approved_proposal, evaluation_summary,
 *   sample_evaluations[], photo_documentation[]
 */
export const SubmitProposedAccomplishments = async (req, res) => {
  try {
    const {
      organization,
      event_title,
      event_score,
      event_description,
      event_date,
      resolution,
      attendance_sheet,
      narrative_report,
      financial_report,
      approved_proposal,
      evaluation_summary,
      sample_evaluations,
      activity_type,
      photo_documentation,
    } = req.body;

    const accomplishment = new ProposedAccomplishments({
      organization,
      over_all_status: "Pending",
      event_score,
      event_title,
      event_description,
      event_date,
      activity_type,
      documents: {
        resolution,
        attendance_sheet,
        narrative_report,
        financial_report,
        approved_proposal,
        evaluation_summary,
        sample_evaluations: Array.isArray(sample_evaluations)
          ? sample_evaluations
          : [sample_evaluations].filter(Boolean),
        photo_documentation: Array.isArray(photo_documentation)
          ? photo_documentation
          : [photo_documentation].filter(Boolean),

        // Optional: add default notes/statuses like your proposal model does
        attendance_sheet_note: "",
        narrative_report_note: "",
        financial_report_note: "",
        approved_proposal_note: "",
        evaluation_summary_note: "",
        attendance_sheet_status: "Pending",
        narrative_report_status: "Pending",
        financial_report_status: "Pending",
        approved_proposal_status: "Pending",
        evaluation_summary_status: "Pending",
      },
    });

    const saved = await accomplishment.save();
    return res.status(201).json({
      message: "Accomplished activity submitted successfully",
      activity: saved,
    });
  } catch (err) {
    console.error("Error submitting accomplished activity:", err);
    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

export const SubmitInstutionalAccomplisments = async (req, res) => {
  try {
    const {
      organization,
      status,
      event_title,
      event_description,
      event_date,
      narrative_report,
      attendance_sheet,
      activity_type,
      certificate,
      photo_documentations,
    } = req.body;

    const docs = {
      narrative_report,
      attendance_sheet,
      certificate: Array.isArray(certificate)
        ? certificate
        : [certificate].filter(Boolean),
      photo_documentation: Array.isArray(photo_documentations)
        ? photo_documentations
        : [photo_documentations].filter(Boolean),
    };

    const activity = new InstutionalAccomplisments({
      activity_type,
      organization,
      status: status || "pending",
      event_title,
      event_description,
      event_date,
      documents: docs,
    });

    const saved = await activity.save();

    return res.status(201).json({
      message: "Institutional activity submitted successfully",
      activity: saved,
    });
  } catch (err) {
    console.error("Error submitting institutional activity:", err);
    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

export const SubmitExternalAccomplishments = async (req, res) => {
  try {
    const {
      organization,
      status,
      event_title,
      event_description,
      event_date,
      narrative_report,
      official_invitation,
      activity_type,
      liquidation_report,
      echo_seminar_document,
      cm063_documents,
      photo_documentations,
    } = req.body;

    const docs = {
      narrative_report,
      official_invitation,
      liquidation_report,
      echo_seminar_document,
      cm063_documents: Array.isArray(cm063_documents)
        ? cm063_documents
        : [cm063_documents].filter(Boolean),
      photo_documentation: Array.isArray(photo_documentations)
        ? photo_documentations
        : [photo_documentations].filter(Boolean),
    };

    const activity = new ExternalAccomplishments({
      organization,
      status: status || "pending",
      activity_type,
      event_title,
      event_description,
      event_date,
      documents: docs,
    });

    const saved = await activity.save();

    console.log(saved);

    return res.status(201).json({
      message: "External activity submitted successfully",
      activity: saved,
    });
  } catch (err) {
    console.error("Error submitting external activity:", err);
    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};
