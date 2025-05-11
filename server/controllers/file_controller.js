import { PinnedFiles } from "../models/users.js";
const File = PinnedFiles;
7;

// Import the File model
/**
 * Add a new file name to the organization's files
 * Manages a maximum of 5 file names with FIFO behavior
 */
export const AddPinnedFiles = async (req, res) => {
  try {
    const { organizationId, fileName } = req.body;

    // Validate required fields
    if (!organizationId || !fileName) {
      return res
        .status(400)
        .json({ message: "Organization ID and file name are required" });
    }

    // Find the file document for this organization or create a new one
    let fileDoc = await File.findOne({ organization: organizationId });

    if (!fileDoc) {
      fileDoc = new File({
        organization: organizationId,
        pinned_files: [],
      });
    }

    // Implement FIFO behavior when the array reaches 5 elements
    if (fileDoc.pinned_files.length >= 5) {
      // Remove the first (oldest) element
      fileDoc.pinned_files.shift();
    }

    // Add the new file name at the end
    fileDoc.pinned_files.push(fileName);

    // Save the updated document
    await fileDoc.save();

    res.status(200).json(fileDoc);
  } catch (error) {
    console.error("Error adding file name:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Get all file names for an organization
 */
export const GetFileNames = async (req, res) => {
  try {
    const { organizationId } = req.params;

    // Validate required parameter
    if (!organizationId) {
      return res.status(400).json({ message: "Organization ID is required" });
    }

    const fileDoc = await File.findOne({ organization: organizationId });

    if (!fileDoc) {
      return res
        .status(404)
        .json({ message: "No files found for this organization" });
    }

    res.status(200).json(fileDoc.pinned_files);
  } catch (error) {
    console.error("Error fetching file names:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Remove a specific file name from the array
 */
export const RemoveFileName = async (req, res) => {
  try {
    const { organizationId, fileName } = req.body;

    // Validate required fields
    if (!organizationId || !fileName) {
      return res
        .status(400)
        .json({ message: "Organization ID and file name are required" });
    }

    const fileDoc = await File.findOne({ organization: organizationId });

    if (!fileDoc) {
      return res
        .status(404)
        .json({ message: "No files found for this organization" });
    }

    // Remove the specified file name
    fileDoc.file_name = fileDoc.file_name.filter((name) => name !== fileName);
    await fileDoc.save();

    res.status(200).json(fileDoc);
  } catch (error) {
    console.error("Error removing file name:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Clear all file names for an organization
 */
export const ClearFileNames = async (req, res) => {
  try {
    const { organizationId } = req.body;

    // Validate required field
    if (!organizationId) {
      return res.status(400).json({ message: "Organization ID is required" });
    }

    const fileDoc = await File.findOne({ organization: organizationId });

    if (!fileDoc) {
      return res
        .status(404)
        .json({ message: "No files found for this organization" });
    }

    // Clear the file_name array
    fileDoc.file_name = [];
    await fileDoc.save();

    res.status(200).json(fileDoc);
  } catch (error) {
    console.error("Error clearing file names:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
