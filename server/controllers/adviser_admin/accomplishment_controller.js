// controllers/activityController.js
import {
  ProposedAccomplishments,
  InstutionalAccomplisments,
  ExternalAccomplishments,
} from "../../models/documents.js";
import { SystemLogs } from "../../models/users.js";

export const UpdateInternalAccomplishmentNotesAdviser = async (req, res) => {
  try {
    const { accomplishmentId } = req.params;
    const { over_all_status, ...documentFields } = req.body;

    // Initialize update object
    const updateFields = {
      over_all_status: over_all_status || "Pending",
    };

    // Process each document-related field as simple string fields inside documents
    Object.keys(documentFields).forEach((field) => {
      if (field.endsWith("_status") || field.endsWith("_notes")) {
        updateFields[`documents.${field}`] = documentFields[field];
      }
    });

    console.log(documentFields);

    const updated = await InstutionalAccomplisments.findByIdAndUpdate(
      accomplishmentId,
      { $set: updateFields },
      { new: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ message: "Institutional accomplishment not found" });
    }
    await Log.create({
      organization: updated?.organization, // Assuming your accomplishment has organization reference
      action: "",
    });

    return res.status(200).json({
      message: "Accomplishment updated successfully",
      accomplishment: updated,
    });
  } catch (err) {
    console.error("Error updating accomplishment:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

export const UpdateProposalAccomplishmentNotesAdviser = async (req, res) => {
  try {
    const { accomplishmentId } = req.params;
    const { over_all_status, documents } = req.body;

    console.log(accomplishmentId);

    // Initialize update object
    const updateFields = {};

    if (over_all_status) {
      updateFields.over_all_status = over_all_status;
    }

    // Process document fields if they exist
    if (documents) {
      // For each field in the documents object, create the proper MongoDB dot notation
      Object.keys(documents).forEach((field) => {
        updateFields[`documents.${field}`] = documents[field];
      });
    }

    // Try to update in ProposedAccomplishments first, then InstitutionalAccomplishments if not found
    let updated = await ProposedAccomplishments.findByIdAndUpdate(
      accomplishmentId,
      { $set: updateFields },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        message:
          "Accomplishment not found in proposal or institutional collections",
      });
    }

    return res.status(200).json({
      message: "Accomplishment updated successfully",
      accomplishment: updated,
    });
  } catch (err) {
    console.error("Error updating accomplishment:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

export const UpdateExternalAccomplishmentNotesAdviser = async (req, res) => {
  try {
    const { accomplishmentId } = req.params;
    const { over_all_status, ...documentFields } = req.body;

    // Initialize update object
    const updateFields = {};

    if (over_all_status) {
      updateFields.over_all_status = over_all_status;
    }

    // Process each document-related field
    Object.keys(documentFields).forEach((field) => {
      if (field.endsWith("_status") || field.endsWith("_notes")) {
        updateFields[`documents.${field}`] = documentFields[field];
      }
    });

    // Update in ExternalAccomplishments collection
    const updated = await ExternalAccomplishments.findByIdAndUpdate(
      accomplishmentId,
      { $set: updateFields },
      { new: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ message: "External accomplishment not found" });
    }

    return res.status(200).json({
      message: "External accomplishment updated successfully",
      accomplishment: updated,
    });
  } catch (err) {
    console.error("Error updating external accomplishment:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};
