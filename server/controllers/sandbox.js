import jwt from "jsonwebtoken";
import { Users, Accreditation, Organizations } from "../models/users.js";
import dotenv from "dotenv";
import { customAlphabet } from "nanoid";

export const UpdateAccreditationSandbox = async (req, res) => {
  try {
    // Use the accreditation record ID passed as a URL parameter.
    const accreditationId = req.params.id;

    // Destructure fields from the request body.
    const { accreditation_status } = req.body;

    // Retrieve the accreditation record from the database.
    const accreditationRecord = await Accreditation.findById(accreditationId);

    if (!accreditationRecord) {
      console.error("Cannot find accreditation: " + accreditationId);
      return res.status(404).json({ error: "Accreditation record not found" });
    } else {
      console.log("Found accreditation: " + accreditationId);
    }

    // Update documents_and_status if it is provided and is an array.
    const documentsAndStatus = accreditation_status.documents_and_status;
    if (Array.isArray(documentsAndStatus)) {
      // Log each document for debugging.
      documentsAndStatus.forEach((doc, index) => {
        console.log(`${index + 1}.) ${doc.label} ---> ${doc.Status}`);
      });
      // Update the accreditation record with the new documents_and_status.
      accreditationRecord.documents_and_status = documentsAndStatus;
    }

    // Update the overall status if provided.
    if (accreditation_status.over_all_status) {
      accreditationRecord.over_all_status =
        accreditation_status.over_all_status;
    }

    // Save the updated accreditation record.
    await accreditationRecord.save();
    console.log("Updated Accreditation:", accreditationRecord);

    return res
      .status(200)
      .json({ message: "Accreditation updated successfully." });
  } catch (error) {
    console.error("Error updating accreditation and organization:", error);
    return res.status(500).json({
      error:
        "Server error updating accreditation and organization. Please try again later.",
    });
  }
};

export const testUpdate = async (req, res) => {
  try {
    // Ensure route parameter exists and is trimmed.
    const { accreditationId } = req.params;
    if (!accreditationId) {
      return res
        .status(400)
        .json({ error: "Missing accreditationId parameter" });
    }
    console.log("Route params:", req.params);

    // Destructure incoming data.
    const {
      org_username,
      org_password,
      adviser_username,
      adviser_password,
      org_name,
      org_acronym,
      org_president,
      org_email,
      org_class,
      adviser_name,
      adviser_email,
      adviser_department,
      accreditation_type,
    } = req.body;

    // Define the mapping for file fields.
    const fileFields = {
      "org logo": { label: "Organization Logo", accept: "photos/*" },
      "Constitution & By-laws": {
        label: "Constitution & By-laws",
        accept: ".pdf,.doc,.docx",
      },
      "Pledge Against Hazing": {
        label: "Pledge Against Hazing",
        accept: ".pdf,.doc,.docx",
      },
      Rosters: { label: "Rosters", accept: ".pdf,.doc,.docx" },
      "President Info Sheet": {
        label: "President Info Sheet",
        accept: ".pdf,.doc,.docx",
      },
      "Financial Report": {
        label: "Financial Report",
        accept: ".pdf,.doc,.docx",
      },
      "Collectible Fees": {
        label: "Collectible Fees",
        accept: ".pdf,.doc,.docx",
      },
      "Commitment Statement": {
        label: "Commitment Statement",
        accept: ".pdf,.doc,.docx",
      },
      Memorandum: { label: "Memorandum", accept: ".pdf,.doc,.docx" },
      "Action Plan": { label: "Action Plan", accept: ".pdf,.doc,.docx" },
    };

    // Retrieve the uploaded files.
    const documentFiles = req.files?.document || []; // non-photo documents.
    const photoFiles = req.files?.photo || []; // photo files.

    // IMPORTANT: Use the correct model for accreditation!
    const accreditation = await Accreditation.findById(
      accreditationId
    ).populate("accreditation_status");

    if (!accreditation) {
      console.error("Accreditation record not found for ID:", accreditationId);
      return res.status(404).json({ error: "Accreditation record not found" });
    }

    // Build the updated documents_and_status array.
    let documents_and_status = [];
    for (const key in fileFields) {
      if (req.body[key]) {
        const clientFileName = req.body[key]; // provided filename
        let matchedFile;
        if (fileFields[key].accept.startsWith("photos")) {
          // Look for a matching photo file.
          matchedFile = photoFiles.find(
            (p) => p.originalname === clientFileName
          );
        } else {
          // Otherwise, search among document files.
          matchedFile = documentFiles.find(
            (d) => d.originalname === clientFileName
          );
        }
        if (matchedFile) {
          documents_and_status.push({
            label: fileFields[key].label,
            Status: "pending", // or use your custom logic to set status.
            file: matchedFile.filename,
          });
        }
      }
    }

    // Update accreditation details.
    accreditation.accreditation_type =
      accreditation_type || accreditation.accreditation_type;
    accreditation.over_all_status = "pending";
    accreditation.documents_and_status = documents_and_status;
    await accreditation.save();
    console.log("Accreditation updated:", accreditationId);

    // Update the associated organization record.
    // Note: In the creation process, ensure that accreditation.adviser_accreditation_id was set correctly.
    const organization = await Organizations.findById(
      accreditation.adviser_accreditation_id
    );
    if (!organization) {
      console.error(
        "Organization record not found for accreditation.adviser_accreditation_id:",
        accreditation.adviser_accreditation_id
      );
      return res.status(404).json({ error: "Organization record not found" });
    }

    // Update organization fields.
    organization.adviser_name = adviser_name || organization.adviser_name;
    organization.adviser_email = adviser_email || organization.adviser_email;
    organization.adviser_department =
      adviser_department || organization.adviser_department;
    organization.org_name = org_name || organization.org_name;
    organization.org_acronym = org_acronym || organization.org_acronym;
    organization.org_president = org_president || organization.org_president;
    organization.org_class = org_class || organization.org_class;
    organization.org_email = org_email || organization.org_email;

    // Update logo if provided.
    const logoFileEntry = documents_and_status.find(
      (doc) => doc.label === "Organization Logo"
    );
    if (logoFileEntry) {
      organization.logo = logoFileEntry.file;
    }
    await organization.save();
    console.log("Organization updated:", organization._id);

    // Update corresponding user records for student-leader and adviser.
    const orgUser = await Users.findOne({
      organization: organization._id,
      position: "student-leader",
    });
    if (orgUser) {
      orgUser.username = org_username || orgUser.username;
      orgUser.email = org_email || orgUser.email;
      // IMPORTANT: Hash the password before saving if it is updated.
      orgUser.password = org_password || orgUser.password;
      await orgUser.save();
    }

    const adviserUser = await Users.findOne({
      organization: organization._id,
      position: "adviser",
    });
    if (adviserUser) {
      adviserUser.username = adviser_username || adviserUser.username;
      adviserUser.email = adviser_email || adviserUser.email;
      adviserUser.password = adviser_password || adviserUser.password;
      await adviserUser.save();
    }

    return res.status(200).json({
      message: "Accreditation and organization updated successfully",
      accreditation,
      organization,
    });
  } catch (error) {
    console.error("Error updating accreditation:", error);
    return res.status(500).json({ error: "Server error" });
  }
};
