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
      event_status,
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
      event_status,
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
      event_title,
      over_all_status: "Pending",
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
      over_all_status: "Pending",
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

export const UpdateProposedAccomplishments = async (req, res) => {
  try {
    const id = req.params.accomplishmentId;
    const accomplishment = await ProposedAccomplishments.findById(id);

    if (!accomplishment) {
      return res.status(404).json({ message: "Accomplishment not found" });
    }

    const docFiles = req.files?.document || [];
    const photoFiles = req.files?.photo || [];

    const resolveFile = (bucket, originalName) => {
      const match = bucket.find((f) => f.originalname === originalName);
      return match ? match.filename : originalName;
    };

    const resolveMultiple = (bucket, field) => {
      const value = req.body[field];
      if (!value) return accomplishment.documents[field];
      const names = Array.isArray(value) ? value : [value];
      return names.map((name) => resolveFile(bucket, name));
    };

    const {
      event_title,
      event_score,
      event_description,
      event_date,
      event_status,
      activity_type,
    } = req.body;

    // Update fields
    accomplishment.event_title = event_title;
    accomplishment.event_score = event_score;
    accomplishment.event_description = event_description;
    accomplishment.event_date = event_date;
    accomplishment.event_status = event_status;
    accomplishment.activity_type = activity_type;
    accomplishment.over_all_status = "Revision Applied by the Student Leader";

    // Flags to check if document fields were updated
    const updatedFields = [
      "resolution",
      "attendance_sheet",
      "narrative_report",
      "financial_report",
      "approved_proposal",
      "evaluation_summary",
      "sample_evaluations",
      "photo_documentation",
    ];

    updatedFields.forEach((field) => {
      if (req.body[field]) {
        const isMultiple = [
          "sample_evaluations",
          "photo_documentation",
        ].includes(field);
        const value = isMultiple
          ? resolveMultiple(
              field === "photo_documentation" ? photoFiles : docFiles,
              field
            )
          : resolveFile(docFiles, req.body[field]);

        accomplishment.documents[field] = value;

        if (!isMultiple) {
          accomplishment.documents[`${field}_note`] =
            "Revision Applied Student Leader";
          accomplishment.documents[`${field}_status`] =
            "Revision Applied Student Leader";
        }
      }
    });

    const updated = await accomplishment.save();

    return res.status(200).json({
      message: "Proposed accomplishment updated successfully",
      activity: updated,
    });
  } catch (err) {
    console.error("Error updating proposed accomplishment:", err);
    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

export const UpdateInstutionalAccomplishments = async (req, res) => {
  try {
    const id = req.params.accomplishmentId;
    const activity = await InstutionalAccomplisments.findById(id);

    if (!activity) {
      return res
        .status(404)
        .json({ message: "Institutional accomplishment not found" });
    }

    const docFiles = req.files?.document || [];
    const photoFiles = req.files?.photo || [];

    const resolveFile = (bucket, originalName) => {
      const match = bucket.find((f) => f.originalname === originalName);
      return match ? match.filename : originalName;
    };

    const resolveMultiple = (bucket, field) => {
      const value = req.body[field];
      if (!value) return activity.documents[field];
      const names = Array.isArray(value) ? value : [value];
      return names.map((name) => resolveFile(bucket, name));
    };

    const { event_title, event_description, event_date, activity_type } =
      req.body;

    activity.event_title = event_title;
    activity.event_description = event_description;
    activity.event_date = event_date;
    activity.activity_type = activity_type;
    activity.over_all_status = "Revision Applied by the Student Leader";

    // Update documents
    if (req.body.narrative_report) {
      activity.documents.narrative_report = resolveFile(
        docFiles,
        req.body.narrative_report
      );
    }
    if (req.body.attendance_sheet) {
      activity.documents.attendance_sheet = resolveFile(
        docFiles,
        req.body.attendance_sheet
      );
    }
    if (req.body.certificate) {
      activity.documents.certificate = resolveMultiple(docFiles, "certificate");
    }
    if (req.body.photo_documentations) {
      activity.documents.photo_documentation = resolveMultiple(
        photoFiles,
        "photo_documentations"
      );
    }

    const updated = await activity.save();

    return res.status(200).json({
      message: "Institutional accomplishment updated successfully",
      activity: updated,
    });
  } catch (err) {
    console.error("Error updating institutional accomplishment:", err);
    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

export const UpdateExternalAccomplishments = async (req, res) => {
  try {
    const id = req.params.accomplishmentId;
    const activity = await ExternalAccomplishments.findById(id);

    if (!activity) {
      return res
        .status(404)
        .json({ message: "External accomplishment not found" });
    }

    const docFiles = req.files?.document || [];
    const photoFiles = req.files?.photo || [];

    const resolveFile = (bucket, originalName) => {
      const match = bucket.find((f) => f.originalname === originalName);
      return match ? match.filename : originalName;
    };

    const resolveMultiple = (bucket, field) => {
      const value = req.body[field];
      if (!value) return activity.documents[field];
      const names = Array.isArray(value) ? value : [value];
      return names.map((name) => resolveFile(bucket, name));
    };

    const { event_title, event_description, event_date, activity_type } =
      req.body;

    activity.event_title = event_title;
    activity.event_description = event_description;
    activity.event_date = event_date;
    activity.activity_type = activity_type;
    activity.over_all_status = "Revision Applied by the Student Leader";

    if (req.body.narrative_report) {
      activity.documents.narrative_report = resolveFile(
        docFiles,
        req.body.narrative_report
      );
    }
    if (req.body.official_invitation) {
      activity.documents.official_invitation = resolveFile(
        docFiles,
        req.body.official_invitation
      );
    }
    if (req.body.liquidation_report) {
      activity.documents.liquidation_report = resolveFile(
        docFiles,
        req.body.liquidation_report
      );
    }
    if (req.body.echo_seminar_document) {
      activity.documents.echo_seminar_document = resolveFile(
        docFiles,
        req.body.echo_seminar_document
      );
    }
    if (req.body.cm063_documents) {
      activity.documents.cm063_documents = resolveMultiple(
        docFiles,
        "cm063_documents"
      );
    }
    if (req.body.photo_documentations) {
      activity.documents.photo_documentation = resolveMultiple(
        photoFiles,
        "photo_documentations"
      );
    }

    const updated = await activity.save();

    return res.status(200).json({
      message: "External accomplishment updated successfully",
      activity: updated,
    });
  } catch (err) {
    console.error("Error updating external accomplishment:", err);
    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};
