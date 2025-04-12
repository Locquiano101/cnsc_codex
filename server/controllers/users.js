import jwt from "jsonwebtoken";
import { Users, Accreditation, Organizations } from "../models/users.js";
import dotenv from "dotenv";
import { customAlphabet } from "nanoid";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export const Login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user and populate the organization and its nested accreditation_status field
    const user = await Users.findOne({ username }).populate({
      path: "organization",
      populate: {
        path: "accreditation_status", // Must match the ref defined in OrganizationSchema
        select: "over_all_status", // Return only the accreditation overall status field
      },
    });

    // Check if user exists
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Log the organization information if available
    if (user.organization) {
      console.log("Organization:", user.organization);
    } else {
      console.log("No organization found for user:", username);
    }

    // Validate password
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Create a JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username, position: user.position },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Prepare the organization data with accreditation overall status if available
    const organizationData = user.organization
      ? {
          ...user.organization.toObject(),
          accreditation_overall: user.organization.accreditation_status
            ? user.organization.accreditation_status.over_all_status
            : null,
        }
      : null;

    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        position: user.position,
        organization: organizationData,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

export const ConfirmAccreditation = async (req, res) => {
  const { org_email, adviser_email } = req.body;

  const generateNumericOTP = customAlphabet("0123456789", 6);
  // Generate the OTP as a string (only numbers).
  const otpString = generateNumericOTP();
  // Optionally, convert to integer if needed.
  const otpInt = Number(otpString);

  // Define the email subject and message for the organization.
  const org_email_subject = "Organization Accreditation Confirmation";
  const org_email_message = `Hello, your accreditation OTP is ${otpString}. Please use this code to confirm your accreditation.`;

  // Define the email subject and message for the adviser.
  const adviser_email_subject = "Adviser Accreditation Confirmation";
  const adviser_email_message = `Hello, your accreditation OTP is ${otpString}. Please use this code to confirm your accreditation.`;

  // Send accreditation emails.
  await sendAccreditationMail(org_email, org_email_subject, org_email_message);
  await sendAccreditationMail(
    adviser_email,
    adviser_email_subject,
    adviser_email_message
  );

  // Respond with the OTP.
  res.json({ otp: otpInt, otpString });
};

export const ProcessAccreditation = async (req, res) => {
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
              Status: "pending",
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
              Status: "pending",
              file: matchedFile.filename,
            });
          }
        }
      }
    }

    // Step 1: Create accreditation record with the documents_and_status array.
    const accreditationStatus = new Accreditation({
      accreditation_type: accreditation_type || "recognition",
      over_all_status: "pending",
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
export const UpdateAccreditation = async (req, res) => {
  try {
    // Extract fields from request body including an accreditation identifier.
    const {
      accreditation_id,
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

    // Define the same mapping for file fields.
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

    // Retrieve files from the request.
    const documentFiles = req.files?.document || [];
    const photoFiles = req.files?.photo || [];

    // First, find the existing accreditation record.
    const accreditation = await Accreditation.findById(accreditation_id);
    if (!accreditation) {
      return res.status(404).json({ error: "Accreditation not found" });
    }

    // Build a new documents_and_status array based on files included in the update request.
    let updatedDocuments_and_status = [];
    for (const key in fileFields) {
      if (req.body[key]) {
        const clientFileName = req.body[key]; // the name provided by the client
        if (fileFields[key].accept.startsWith("photos")) {
          // Search in the photo files.
          const matchedFile = photoFiles.find(
            (p) => p.originalname === clientFileName
          );
          if (matchedFile) {
            updatedDocuments_and_status.push({
              label: fileFields[key].label,
              Status: "pending",
              file: matchedFile.filename,
            });
          }
        } else {
          // Otherwise, check the document files.
          const matchedFile = documentFiles.find(
            (d) => d.originalname === clientFileName
          );
          if (matchedFile) {
            updatedDocuments_and_status.push({
              label: fileFields[key].label,
              Status: "pending",
              file: matchedFile.filename,
            });
          }
        }
      }
    }

    // Update accreditation fields.
    accreditation.accreditation_type =
      accreditation_type || accreditation.accreditation_type;
    accreditation.documents_and_status = updatedDocuments_and_status;
    // You can update the overall status as needed – here we set it back to "pending"
    accreditation.over_all_status = "pending";
    const savedAccreditation = await accreditation.save();

    // Find the linked organization record.
    let organization = await Organizations.findOne({
      accreditation_status: accreditation_id,
    });
    if (!organization) {
      return res.status(404).json({ error: "Organization record not found" });
    }

    // Update the organization record with new data.
    organization.adviser_name = adviser_name || organization.adviser_name;
    organization.adviser_email = adviser_email || organization.adviser_email;
    organization.adviser_department =
      adviser_department || organization.adviser_department;
    organization.org_name = org_name || organization.org_name;
    organization.org_acronym = org_acronym || organization.org_acronym;
    organization.org_president = org_president || organization.org_president;
    organization.org_class = org_class || organization.org_class;
    organization.org_email = org_email || organization.org_email;
    // Update organization logo if provided in the new file data.
    const logoDoc = updatedDocuments_and_status.find(
      (doc) => doc.label === "Organization Logo"
    );
    organization.logo = logoDoc?.file || organization.logo;
    const savedOrganization = await organization.save();

    // Optionally, update user records for both the organization student-leader and adviser.
    let orgUser = await Users.findOne({
      organization: savedOrganization._id,
      position: "student-leader",
    });
    if (orgUser) {
      orgUser.username = org_username || orgUser.username;
      orgUser.email = org_email || orgUser.email;
      if (org_password) {
        // In production, always hash your passwords before saving.
        orgUser.password = org_password;
      }
      await orgUser.save();
    }

    let adviserUser = await Users.findOne({
      organization: savedOrganization._id,
      position: "adviser",
    });
    if (adviserUser) {
      adviserUser.username = adviser_username || adviserUser.username;
      adviserUser.email = adviser_email || adviserUser.email;
      if (adviser_password) {
        // Password hashing should be applied in production.
        adviserUser.password = adviser_password;
      }
      await adviserUser.save();
    }

    return res.status(200).json({
      message: "Accreditation updated successfully",
      accreditation: savedAccreditation,
      organization: savedOrganization,
    });
  } catch (error) {
    console.error("Error updating accreditation:", error);
    return res.status(500).json({ error: "Server error" });
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
