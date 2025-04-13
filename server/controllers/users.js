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
    // Extract the accreditation ID from the URL parameter and the update data from the request body
    const accreditationId = req.params.id;
    const updateData = req.body;

    // Look for the existing accreditation record
    const accreditation = await Organizations.findById(
      accreditationId
    ).populate("accreditation_status");
    if (!accreditation) {
      return res.status(404).json({ error: "Accreditation not found." });
    }

    // Just log the incoming data without updating the record
    console.log("Received update data:", updateData);

    // Return the existing accreditation record without any changes
    return res.json({
      message: "Accreditation found. No updates have been applied.",
      accreditation,
    });
  } catch (error) {
    console.error("Error updating accreditation:", error);
    return res.status(500).json({
      error: "Server error updating accreditation. Please try again later.",
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
