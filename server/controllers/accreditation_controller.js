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

    // Get the uploaded files.
    // Files for non-photo documents.
    const documentFiles = req.files?.document || [];
    // Files for photos.
    const photoFiles = req.files?.photo || [];

    // Build the documents_and_status array.
    let documents_and_status = [];

    // Iterate over the keys from fileFields.
    // We expect that when the client appends a file,
    // it also appends a field with the same key containing file.name.
    for (const key in fileFields) {
      if (req.body[key]) {
        const clientFileName = req.body[key]; // value from formData, should match file.originalname

        // Determine if the file belongs to photos or documents based on the accept string.
        if (fileFields[key].accept.startsWith("photos")) {
          // Look for the matching photo file.
          const matchedFile = photoFiles.find(
            (p) => p.originalname === clientFileName
          );
          if (matchedFile) {
            documents_and_status.push({
              label: fileFields[key].label, // use the label from fileFields
              Status: "Pending",
              file: matchedFile.filename,
            });
          }
        } else {
          // Otherwise, assume it's a document file.
          const matchedFile = documentFiles.find(
            (d) => d.originalname === clientFileName
          );
          if (matchedFile) {
            documents_and_status.push({
              label: fileFields[key].label, // use the label from fileFields
              Status: "Pending",
              file: matchedFile.filename,
            });
          }
        }
      }
    }

    // Step 1: Create accreditation record with the documents_and_status array.
    const accreditationStatus = new Accreditation({
      accreditation_type: accreditation_type || "recognition",
      over_all_status: "Pending",
      documents_and_status,
    });

    const savedAccreditation = await accreditationStatus.save();

    // Step 2: Create organization record.
    // For organization logo, we search the documents_and_status array.
    const organizationData = {
      adviser_name,
      adviser_email,
      adviser_department,
      org_name,
      org_acronym,
      org_president,
      org_class,
      org_email,
      logo:
        documents_and_status.find((doc) => doc.label === "Organization Logo")
          ?.file || "",
      accreditation_status: savedAccreditation._id,
    };

    const savedOrganization = await new Organizations(organizationData).save();

    // Step 3: Update accreditation record with adviser accreditation id.
    savedAccreditation.adviser_accreditation_id = savedOrganization._id;
    await savedAccreditation.save();

    // Step 4: Create user records (organization and adviser).
    const orgUser = new Users({
      username: org_username,
      email: org_email,
      password: org_password,
      position: "student-leader",
      organization: savedOrganization._id,
    });

    const adviserUser = new Users({
      username: adviser_username,
      email: adviser_email,
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
