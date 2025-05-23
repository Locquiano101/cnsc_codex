import { Accreditation, Users, Organizations } from "../models/users.js";
import { customAlphabet } from "nanoid";
import { NodeEmail } from "../middleware/emailer.js";

const verificationStore = {};

export const UpdateAccreditationCertainDocument = async (req, res) => {
  const { accreditationId } = req.params;
  const { documentId, fileName } = req.body; // Destructure fileName from body

  console.log("Params:", req.params);
  console.log("Body:", req.body);

  try {
    // Find and update only the file name of the specific document
    const updatedAccreditation = await Accreditation.findOneAndUpdate(
      {
        _id: accreditationId,
        "documents_and_status._id": documentId,
      },
      {
        $set: {
          "documents_and_status.$.file": fileName, // Update only the file name
        },
      },
      { new: true }
    );

    if (!updatedAccreditation) {
      console.error("Error updating accreditation document");
      return res
        .status(404)
        .json({ message: "Accreditation or document not found" });
    }

    return res.status(200).json({
      message: "Document file name updated successfully",
      data: updatedAccreditation,
    });
  } catch (error) {
    console.error("Error updating accreditation document:", error);
    return res.status(500).json({
      message: "An error occurred while updating the document",
      error: error.message,
    });
  }
};
export const SendConfirmationCodeAccreditation = async (req, res) => {
  console.log("Request body:", req.body); // Add this

  const { org_email } = req.body;
  console.log("Received email for OTP:", org_email); // 🔍 Debug log

  const generateNumericOTP = customAlphabet("0123456789", 6);
  const otpString = generateNumericOTP();
  const otpInt = Number(otpString);

  verificationStore[org_email] = otpString;

  const org_email_subject = "Organization Accreditation Confirmation";
  const org_email_message = `Hello, your accreditation OTP is ${otpString}. Please use this code to confirm your accreditation.`;

  try {
    const emailResult = await NodeEmail(
      org_email,
      org_email_subject,
      org_email_message
    );

    // Debug: check if email sending returned success
    if (emailResult?.success) {
      console.log(`Email sent successfully to ${org_email}`);
      res.status(200).json({ otp: otpInt, otpString });
    } else {
      console.error(`Failed to send email to ${org_email}`, emailResult);
      res
        .status(500)
        .json({ error: "Failed to send confirmation code email." });
    }
  } catch (error) {
    console.error(`Error sending email to ${org_email}:`, error);
    res.status(500).json({
      error: "An error occurred while sending the confirmation code.",
    });
  }
};

export const ConfirmAccreditation = async (req, res) => {
  const { org_email, code } = req.body;
  const storedCode = verificationStore[org_email];
  if (storedCode && storedCode === code) {
    // Optionally, delete the code now that it's been confirmed
    delete verificationStore[org_email];
    res.status(200).json({ message: "Email confirmed successfully" });
  } else {
    res.status(400).json({ error: "Invalid verification code" });
  }
};

export const UpdateAccreditationSDU = async (req, res) => {
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

export const SubmitAccreditation = async (req, res) => {
  console.log(req.body);

  try {
    // First, properly parse the incoming request body
    let parsedBody;
    try {
      // Handle cases where body might be stringified JSON
      parsedBody =
        typeof req.body === "string" ? JSON.parse(req.body) : req.body;

      // Specifically handle org_type which might be stringified
      if (typeof parsedBody.org_type === "string") {
        try {
          parsedBody.org_type = JSON.parse(parsedBody.org_type);
          console.log("Parsed org_type:", parsedBody.org_type);
        } catch (parseErr) {
          console.error("Error parsing org_type:", parseErr);
          return res.status(400).json({
            message: "Invalid org_type format",
            details: parseErr.message,
            received: parsedBody.org_type,
          });
        }
      }
    } catch (e) {
      return res.status(400).json({
        message: "Invalid request body format",
        details: e.message,
      });
    }

    // Extract all fields from parsedBody
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
      accreditation_type = "recognition",
    } = parsedBody;

    // Extract and validate org_type separately
    let org_type = parsedBody.org_type;

    console.log("Original org_type:", org_type);

    // Validate org_type exists and has correct structure
    if (!org_type || typeof org_type !== "object") {
      return res.status(400).json({
        message: "org_type must be a valid object",
        received: org_type,
        body: parsedBody,
      });
    }

    console.log("Processed org_type:", org_type);

    // Modified to handle both formats (with space and with underscore)
    const fileFields = {
      "org logo": { label: "Organization Logo", accept: "photos/*" },
      org_logo: { label: "Organization Logo", accept: "photos/*" }, // Added this line
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

    // Get the uploaded files.
    const documentFiles = req.files?.document || [];
    const photoFiles = req.files?.photo || [];

    // Build the documents_and_status array.
    let documents_and_status = [];

    for (const key in fileFields) {
      if (req.body[key]) {
        const clientFileName = req.body[key];
        if (fileFields[key].accept.startsWith("photos")) {
          const matchedFile = photoFiles.find(
            (p) => p.originalname === clientFileName
          );
          if (matchedFile) {
            documents_and_status.push({
              label: fileFields[key].label,
              Status: "Pending",
              file: matchedFile.filename,
            });
          }
        } else {
          const matchedFile = documentFiles.find(
            (d) => d.originalname === clientFileName
          );
          if (matchedFile) {
            documents_and_status.push({
              label: fileFields[key].label,
              Status: "Pending",
              file: matchedFile.filename,
            });
          }
        }
      }
    }

    // Step 1: Create accreditation record
    const accreditationStatus = new Accreditation({
      accreditation_type: accreditation_type || "recognition",
      over_all_status: "Pending",
      documents_and_status,
    });

    const savedAccreditation = await accreditationStatus.save();

    // Validate and process org_type
    let sanitizedOrgType = {};

    if (!org_type || !org_type.Classification) {
      return res
        .status(400)
        .json({ message: "Organization classification is required." });
    }

    // Check for both "System-Wide" and "System-wide" (case variations)
    if (
      !["Local", "System-Wide", "System-wide"].includes(org_type.Classification)
    ) {
      return res.status(400).json({
        message: "Invalid organization classification.",
        received: org_type.Classification,
      });
    }

    // Normalize classification to handle case variations
    sanitizedOrgType.Classification =
      org_type.Classification === "System-wide"
        ? "System-Wide"
        : org_type.Classification;

    // Variable to store the delivery unit for users
    let deliveryUnit =
      sanitizedOrgType.Classification === "System-Wide"
        ? "System-Wide"
        : "Local"; // Default based on classification

    if (sanitizedOrgType.Classification === "Local") {
      if (
        !org_type.Departments ||
        !Array.isArray(org_type.Departments) ||
        org_type.Departments.length === 0
      ) {
        return res.status(400).json({
          message:
            "At least one department is required for Local organizations.",
          received: org_type,
        });
      }

      // Filter and map departments
      sanitizedOrgType.Departments = org_type.Departments.filter(
        (dep) => dep.Department || dep.Course
      ) // Keep only entries with at least one field
        .map((dep) => ({
          Department: dep.Department || "",
          Course: dep.Course || "",
        }));

      // For Local orgs, set delivery_unit to the first department
      if (sanitizedOrgType.Departments.length > 0) {
        deliveryUnit = sanitizedOrgType.Departments[0].Department;
      }
    } else if (sanitizedOrgType.Classification === "System-Wide") {
      if (
        !org_type.Fields ||
        !Array.isArray(org_type.Fields) ||
        org_type.Fields.length === 0
      ) {
        return res.status(400).json({
          message:
            "At least one field is required for System-Wide organizations.",
          received: org_type,
        });
      }

      // Process fields and specializations
      sanitizedOrgType.Fields = org_type.Fields.map((field) => ({
        fieldName: field.fieldName || "",
        specializations: Array.isArray(field.specializations)
          ? field.specializations.filter((spec) => spec) // Remove empty specializations
          : [],
      }));

      // For System-Wide orgs, delivery_unit remains "System-Wide"
    }

    // Step 2: Create organization record with the sanitized org_type
    const organizationData = {
      adviser_name,
      adviser_email,
      adviser_department,
      org_name,
      org_acronym,
      org_president,
      org_class,
      org_email,
      org_type: sanitizedOrgType, // Include the processed org_type
      logo:
        documents_and_status.find((doc) => doc.label === "Organization Logo")
          ?.file || "",
      accreditation_status: savedAccreditation._id,
    };

    const savedOrganization = await new Organizations(organizationData).save();

    // Step 3: Update accreditation record
    savedAccreditation.adviser_accreditation_id = savedOrganization._id;

    console.log("tite", savedAccreditation);

    await savedAccreditation.save();

    // Step 4: Create user records with the appropriate delivery_unit
    const orgUser = new Users({
      username: org_username,
      delivery_unit: deliveryUnit, // Use the determined delivery_unit
      email: org_email,
      password: org_password,
      position: "student-leader",
      organization: savedOrganization._id,
    });

    const adviserUser = new Users({
      username: adviser_username,
      email: adviser_email,
      delivery_unit: adviser_department, // Use the determined delivery_unit
      password: adviser_password,
      position: "adviser",
      organization: savedOrganization._id,
    });

    await orgUser.save();
    await adviserUser.save();

    return res.status(200).json({
      message: "Accreditation processed and users saved successfully",
      accreditation: savedAccreditation,
      organization: savedOrganization,
    });
  } catch (error) {
    console.error("Error processing accreditation:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const GetAllAccreditations = async (req, res) => {
  try {
    // Retrieve all accreditations and populate the accreditationStatus details
    const accreditations = await Organizations.find().populate(
      "accreditation_status"
    );

    // Return the accreditations with a success message
    return res.status(200).json({
      message: "All accreditations retrieved successfully",
      accreditations,
    });
  } catch (error) {
    console.error("Error retrieving accreditations:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
export const GetAccreditationById = async (req, res) => {
  try {
    // Get the ID from URL params
    const { id } = req.params;

    // Retrieve the accreditation by ID
    const accreditation = await Organizations.findById(id).populate(
      "accreditation_status"
    );

    // If no matching doc is found, return a 404
    if (!accreditation) {
      return res.status(404).json({
        message: "Accreditation not found",
      });
    }

    // Return the accreditation with a success message
    return res.status(200).json({
      message: "Accreditation retrieved successfully",
      accreditation,
    });
  } catch (error) {
    console.error("Error retrieving accreditation:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
