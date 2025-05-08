import jwt from "jsonwebtoken";
import { Organizations, Users } from "../models/users.js";
import dotenv from "dotenv";
import {
  Proposal,
  InstutionalAccomplisments,
  ExternalAccomplishments,
  ProposedAccomplishments,
} from "../models/documents.js";
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
      return res.status(401).json({ message: "username NotFound " });
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
      user,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

export const GetAllUsername = async (req, res) => {
  try {
    // Fetch all users, projecting only the "username" field.
    // The _id field is excluded by setting _id: 0.
    const users = await Users.find({}, { username: 1, _id: 0 }).exec();

    // Send the result as JSON with a 200 HTTP status code.
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching usernames:", error);

    // If there is any error, send a 500 status code along with an error message.
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const GetAllOrganization = async (req, res) => {
  try {
    // Fetch all users, projecting only the "username" field.
    // The _id field is excluded by setting _id: 0.
    const users = await Organizations.find();

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching usernames:", error);

    // If there is any error, send a 500 status code along with an error message.
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const GetOrganizationsByDepartment = async (req, res) => {
  try {
    const { department } = req.body; // Get department from request body

    // If no department is provided, return an error
    if (!department) {
      return res
        .status(400)
        .json({ message: "Department is required in request body" });
    }

    // Find organizations where adviser_department matches the requested department
    // or where any department in org_type.Departments array matches
    const organizations = await Organizations.find({
      $or: [
        { adviser_department: department },
        { "org_type.Departments.Department": department },
      ],
    });

    if (organizations.length === 0) {
      return res
        .status(404)
        .json({ message: "No organizations found for this department" });
    }

    res.status(200).json(organizations);
  } catch (error) {
    console.error("Error fetching organizations by department:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const GetAllUsernameInfo = async (req, res) => {
  try {
    const users = await Users.find({}, { password: 0 })
      .populate("organization") // populate organization name only
      .sort({ event_date: -1 }); // exclude password field

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching usernames:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const GetProposals = async (req, res) => {
  try {
    const proposals = await Proposal.find()
      .populate("organization") // populate organization name only
      .sort({ event_date: -1 }); // most recent first

    return res.status(200).json({ proposals });
  } catch (err) {
    console.error("Error fetching proposals:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

// controllers/proposals.js
export const GetProposalsbyOrganization = async (req, res) => {
  const { organizationId } = req.params;

  try {
    const proposals = await Proposal.find({ organization: organizationId }) // ← filter by org
      .populate("organization") // populate only name
      .sort({ event_date: -1 }); // most recent first

    return res.status(200).json({ proposals });
  } catch (err) {
    console.error("Error fetching proposals:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

// controllers/proposals.js
export const GetProposalsByOrganizationsDean = async (req, res) => {
  const { organizationIds } = req.body; // expecting an array

  if (!Array.isArray(organizationIds) || organizationIds.length === 0) {
    return res
      .status(400)
      .json({ message: "organizationIds must be a non-empty array." });
  }

  try {
    const proposals = await Proposal.find({
      organization: { $in: organizationIds },
    })
      .populate("organization") // populate only the 'name' field
      .sort({ event_date: -1 }); // most recent first

    return res.status(200).json({ proposals });
  } catch (err) {
    console.error("Error fetching proposals:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

export const GetSingleProposalsbyOrganization = async (req, res) => {
  const { organizationId, proposalId } = req.params;

  try {
    const proposal = await Proposal.findOne({
      _id: proposalId,
      organization: organizationId,
    })
      .populate("organization")
      .sort({ event_date: -1 }); // most recent first
    // optional: only get name if needed

    if (!proposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    return res.status(200).json({ proposal });
  } catch (err) {
    console.error("Error fetching proposal:", err);
    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

// controller, accomplishments
export const GetAccomplishments = async (req, res) => {
  try {
    const InstitutionalActivity = await InstutionalAccomplisments.find(); // ← filter by org
    const ExternalActivity = await ExternalAccomplishments.find(); // most recent first
    const ProposedActivity = await ProposedAccomplishments.find();

    return res
      .status(200)
      .json({ InstitutionalActivity, ExternalActivity, ProposedActivity });
  } catch (err) {
    console.error("Error fetching proposals:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};
export const GetAccomplishmentsbyOrganization = async (req, res) => {
  const { organizationId } = req.params;

  try {
    const InstitutionalActivity = await InstutionalAccomplisments.find({
      organization: organizationId,
    }) // ← filter by org
      .populate("organization") // populate only name
      .sort({ event_date: -1 }); // most recent first

    const ExternalActivity = await ExternalAccomplishments.find({
      organization: organizationId,
    }) // ← filter by org
      .populate("organization") // populate only name
      .sort({ event_date: -1 }); // most recent first
    const ProposedActivity = await ProposedAccomplishments.find({
      organization: organizationId,
    }) // ← filter by org
      .populate("organization") // populate only name
      .sort({ event_date: -1 }); // most recent first

    return res
      .status(200)
      .json({ InstitutionalActivity, ExternalActivity, ProposedActivity });
  } catch (err) {
    console.error("Error fetching proposals:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

export const GetSingleInstitutiuonalAccomplishmentbyOrganization = async (
  req,
  res
) => {
  const { organizationId, proposalId } = req.params;

  try {
    const InstitutionalActivity = await InstutionalAccomplisments.findOne({
      _id: proposalId,
      organization: organizationId,
    })
      .populate("organization") // optional: only get name if needed
      .exec();

    if (!InstitutionalActivity) {
      return res
        .status(404)
        .json({ message: "Instutional Accomplishment not found" });
    }

    return res.status(200).json({ InstitutionalActivity });
  } catch (err) {
    console.error("Error fetching proposal:", err);
    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};
