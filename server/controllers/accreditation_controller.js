import { Accreditation, Users, Organizations } from "../models/users.js";
import { customAlphabet } from "nanoid";
import { NodeEmail } from "../middleware/emailer.js";

const verificationStore = {};

export const SendConfirmationCodeAccreditation = async (req, res) => {
  const { org_email } = req.body;

  const generateNumericOTP = customAlphabet("0123456789", 6);
  // Generate the OTP as a string (only numbers).leaug
  const otpString = generateNumericOTP();
  // Optionally, convert to integer if needed.
  const otpInt = Number(otpString);

  verificationStore[org_email] = otpString;
  // Define the email subject and message for the organization.
  const org_email_subject = "Organization Accreditation Confirmation";
  const org_email_message = `Hello, your accreditation OTP is ${otpString}. Please use this code to confirm your accreditation.`;

  await NodeEmail(org_email, org_email_subject, org_email_message);

  res.status(200).json({ otp: otpInt, otpString });
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
  try {
    // First, properly parse the incoming request body
    let parsedBody;
    try {
      // Handle cases where body might be stringified JSON
      parsedBody =
        typeof req.body === "string" ? JSON.parse(req.body) : req.body;

      // Specifically handle org_type which might be double-stringified
      if (typeof parsedBody.org_type === "string") {
        parsedBody.org_type = JSON.parse(parsedBody.org_type);
      }
    } catch (e) {
      return res.status(400).json({
        message: "Invalid request body format",
        details: e.message,
      });
    }

    // Destructure with the parsed body
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
      org_type, // Now properly parsed
    } = parsedBody;

    // Validate org_type exists and has correct structure
    if (!org_type || typeof org_type !== "object") {
      return res.status(400).json({
        message: "org_type must be a valid object",
        received: org_type,
      });
    }

    // Rest of your file handling code remains the same...
    const fileFields = {
      // ... (keep your existing fileFields configuration)
    };

    const documentFiles = req.files?.document || [];
    const photoFiles = req.files?.photo || [];
    let documents_and_status = [];

    for (const key in fileFields) {
      // ... (keep your existing file processing logic)
    }

    // Process org_type with proper validation
    const validClassifications = ["Local", "System-Wide"];
    if (!validClassifications.includes(org_type.Classification)) {
      return res.status(400).json({
        message: `Invalid classification. Must be one of: ${validClassifications.join(
          ", "
        )}`,
        received: org_type.Classification,
      });
    }

    // Create sanitized org_type object
    const sanitizedOrgType = {
      Classification: org_type.Classification,
    };

    if (org_type.Classification === "Local") {
      if (!org_type.Departments || !Array.isArray(org_type.Departments)) {
        return res.status(400).json({
          message: "Local organizations require a Departments array",
        });
      }

      sanitizedOrgType.Departments = org_type.Departments.filter(
        (dep) => dep && (dep.Department || dep.Course)
      ).map((dep) => ({
        Department: dep.Department || "",
        Course: dep.Course || "",
      }));

      if (sanitizedOrgType.Departments.length === 0) {
        return res.status(400).json({
          message: "At least one valid department is required",
        });
      }
    } else if (org_type.Classification === "System-Wide") {
      if (!org_type.Fields || !Array.isArray(org_type.Fields)) {
        return res.status(400).json({
          message: "System-Wide organizations require a Fields array",
        });
      }

      sanitizedOrgType.Fields = org_type.Fields.filter(
        (field) => field && field.fieldName
      ).map((field) => ({
        fieldName: field.fieldName,
        specializations: Array.isArray(field.specializations)
          ? field.specializations.filter((spec) => spec)
          : [],
      }));

      if (sanitizedOrgType.Fields.length === 0) {
        return res.status(400).json({
          message: "At least one valid field is required",
        });
      }
    }

    // Rest of your database operations remain the same...
    const accreditationStatus = new Accreditation({
      accreditation_type,
      over_all_status: "Pending",
      documents_and_status,
    });

    const savedAccreditation = await accreditationStatus.save();

    const organizationData = {
      adviser_name,
      adviser_email,
      adviser_department,
      org_name,
      org_acronym,
      org_president,
      org_class,
      org_email,
      org_type: sanitizedOrgType, // This will now be stored as a proper object
      logo:
        documents_and_status.find((doc) => doc.label === "Organization Logo")
          ?.file || "",
      accreditation_status: savedAccreditation._id,
    };

    const savedOrganization = await new Organizations(organizationData).save();
    savedAccreditation.adviser_accreditation_id = savedOrganization._id;
    await savedAccreditation.save();

    // Create users
    await Promise.all([
      new Users({
        username: org_username,
        email: org_email,
        password: org_password,
        position: "student-leader",
        organization: savedOrganization._id,
      }).save(),
      new Users({
        username: adviser_username,
        email: adviser_email,
        password: adviser_password,
        position: "adviser",
        organization: savedOrganization._id,
      }).save(),
    ]);

    return res.status(200).json({
      message: "Accreditation processed successfully",
      accreditation: savedAccreditation,
      organization: savedOrganization,
    });
  } catch (error) {
    console.error("Error processing accreditation:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: "Validation failed",
        details: error.errors,
      });
    }

    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
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
