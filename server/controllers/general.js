import jwt from "jsonwebtoken";
import { Organizations, SystemLogs, Users } from "../models/users.js";
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
      { expiresIn: "1hr" }
    );

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

export const GetOrganizationByOrgName = async (req, res) => {
  try {
    const { orgname } = req.params;

    // Find one organization with the matching orgname
    const organization = await Organizations.findOne({ org_name: orgname });

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    res.status(200).json(organization);
  } catch (error) {
    console.error("Error fetching organization:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const localSystemLogs = async (req, res) => {
  const { organizationId } = req.params;

  try {
    const Logs = await SystemLogs.find({ organization: organizationId }) // ← filter by org
      .populate("organization") // populate only name
      .sort({ event_date: -1 }); // most recent first

    return res.status(200).json({ "System Logs": Logs });
  } catch (err) {
    console.error("Error fetching proposals:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

export const DepartmentalSystemLogs = async (req, res) => {
  const { organizationIds } = req.body; // expecting an array
  console.log(req.body);

  if (!Array.isArray(organizationIds) || organizationIds.length === 0) {
    return res.status(400).json({
      success: false,
      message: "organizationIds must be a non-empty array.",
    });
  }

  try {
    const logs = await SystemLogs.find({
      organization: { $in: organizationIds },
    })
      .populate({
        path: "organization",
        select: "name", // only populate the name field of the organization
      })
      .sort({ event_date: -1 }); // most recent first

    return res.status(200).json({
      data: logs,
    });
  } catch (err) {
    console.error("Error fetching system logs:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch system logs",
      error: err.message,
    });
  }
};
export const SystemWideSystemLogs = async (req, res) => {
  try {
    // First find all system-wide organizations
    const systemWideOrgs = await Organizations.find({
      org_class: "System-wide",
    });
    const orgIds = systemWideOrgs.map((org) => org._id);

    // Then find proposals from those organizations
    const systemWideLogs = await SystemLogs.find({
      organization: { $in: orgIds },
    })
      .populate("organization")
      .sort({ event_date: -1 }); // most recent first

    return res.status(200).json({ "System Logs": systemWideLogs });
  } catch (err) {
    console.error("Error fetching system-wide proposals:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

export const AllSystemLogs = async (req, res) => {
  try {
    // Then find proposals from those organizations
    const Logs = await SystemLogs.find()
      .populate("organization")
      .sort({ event_date: -1 }); // most recent first

    return res.status(200).json(Logs);
  } catch (err) {
    console.error("Error fetching system-wide proposals:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
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

export const GetProposalsSystemWide = async (req, res) => {
  try {
    // First find all system-wide organizations
    const systemWideOrgs = await Organizations.find({
      org_class: "System-wide",
    });
    const orgIds = systemWideOrgs.map((org) => org._id);

    // Then find proposals from those organizations
    const systemWideProposals = await Proposal.find({
      organization: { $in: orgIds },
    })
      .populate("organization")
      .sort({ event_date: -1 }); // most recent first

    return res.status(200).json({ proposals: systemWideProposals });
  } catch (err) {
    console.error("Error fetching system-wide proposals:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};
export const GetProposalsByOrganizationClass = async (req, res) => {
  try {
    const orgClass = req.params.orgClass; // e.g., "System-wide"

    // First find organizations with the specified class
    const organizations = await Organization.find({ org_class: orgClass });
    const orgIds = organizations.map((org) => org._id);

    // Then find proposals with those organization IDs
    const proposals = await Proposal.find({ organization: { $in: orgIds } })
      .populate("organization")
      .sort({ event_date: -1 });

    return res.status(200).json({ proposals });
  } catch (err) {
    console.error("Error fetching proposals by organization class:", err);
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

export const GetAccomplishmentsByOrganizationsDean = async (req, res) => {
  const { organizationIds } = req.body; // expecting an array

  if (!Array.isArray(organizationIds) || organizationIds.length === 0) {
    return res
      .status(400)
      .json({ message: "organizationIds must be a non-empty array." });
  }

  try {
    const InstitutionalActivity = await InstutionalAccomplisments.find({
      organization: { $in: organizationIds },
    }).sort({ createdAt: -1 });

    const ExternalActivity = await ExternalAccomplishments.find({
      organization: { $in: organizationIds },
    }).sort({ createdAt: -1 });

    const ProposedActivity = await ProposedAccomplishments.find({
      organization: { $in: organizationIds },
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      InstitutionalActivity,
      ExternalActivity,
      ProposedActivity,
    });
  } catch (err) {
    console.error("Error fetching accomplishments:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

// controller, accomplishments
export const GetAccomplishments = async (req, res) => {
  try {
    const InstitutionalActivity =
      await InstutionalAccomplisments.find().populate("organization"); // ← filter by org
    const ExternalActivity = await ExternalAccomplishments.find().populate(
      "organization"
    ); // most recent first
    const ProposedActivity = await ProposedAccomplishments.find().populate(
      "organization"
    );

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
export const GetSystemWideAccomplishments = async (req, res) => {
  try {
    // First, find all system-wide organizations
    const systemWideOrgs = await Organizations.find({
      org_class: "System-wide",
    });

    // Extract the organization IDs
    const orgIds = systemWideOrgs.map((org) => org._id);

    // Query accomplishments for these organizations
    const InstitutionalActivity = await InstutionalAccomplisments.find({
      organization: { $in: orgIds },
    })
      .populate("organization")
      .sort({ event_date: -1 });

    const ExternalActivity = await ExternalAccomplishments.find({
      organization: { $in: orgIds },
    })
      .populate("organization")
      .sort({ event_date: -1 });

    const ProposedActivity = await ProposedAccomplishments.find({
      organization: { $in: orgIds },
    })
      .populate("organization")
      .sort({ event_date: -1 });

    return res
      .status(200)
      .json({ InstitutionalActivity, ExternalActivity, ProposedActivity });
  } catch (err) {
    console.error("Error fetching system-wide accomplishments:", err);
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
