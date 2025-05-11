import path from "path";
import fs from "fs";
import fsPromises from "fs/promises";
import multer from "multer";
import { error } from "console";

// Ensure the target directory exists (using an absolute path)
const ensureDirExists = (dir) => {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  } catch (error) {
    console.error("Error creating directory:", error);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Build the base upload path using process.cwd() and orgFolder from the request body
    const baseDir = path.join(
      process.cwd(),
      "../public",
      req.body.orgFolder,
      req.body.orgDocumentClassification,
      req.body.orgDocumentTitle
    );

    // Divide files based on field name: "document" or "photo"
    let subDir = "";
    if (file.fieldname === "document") {
      subDir = "documents";
    } else if (file.fieldname === "photo") {
      subDir = "photos";
    } else {
      subDir = "others";
    }

    const uploadPath = path.join(baseDir, subDir);
    ensureDirExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Prepend a timestamp to the original filename
    cb(null, `${file.originalname}`);
  },
});

const upload = multer({ storage });

// Set up the fields: one for a document and one for photos (allowing multiple photos)
const uploadFields = upload.fields([
  { name: "document", maxCount: 100 },
  { name: "photo", maxCount: 200 },
]);

export const DeleteDocumentTitle = async (req, res, next) => {
  const { orgFolder, orgDocumentClassification, orgDocumentTitle } = req.body;

  if (!orgFolder || !orgDocumentClassification || !orgDocumentTitle) {
    return res.status(400).json({
      error:
        "orgFolder, orgDocumentClassification, and orgDocumentTitle are required",
    });
  }

  const dirPath = path.join(
    process.cwd(),
    "public",
    orgFolder,
    orgDocumentClassification,
    orgDocumentTitle
  );

  if (!fs.existsSync(dirPath)) {
    return res
      .status(404)
      .json({ error: "Document title directory does not exist" });
  }

  try {
    await fsPromises.rm(dirPath, { recursive: true, force: true });
    console.log("Deleted directory:", dirPath);
    return next(); // ✅ only call next, don't respond
  } catch (error) {
    console.error("Error deleting directory:", error);
    return res
      .status(500)
      .json({ error: "Failed to delete directory", details: error.message });
  }
};

export const UploadMultipleFiles = (req, res, next) => {
  try {
    uploadFields(req, res, (err) => {
      const { orgFolder } = req.body;
      const documents = req.files?.document;
      const photos = req.files?.photo;

      if (!orgFolder || (!documents && !photos)) {
        return res.status(400).json({
          error:
            "orgFolder and at least one file (document or photo) are required",
        });
      } else {
        console.log(err);
      }

      next();
    });
  } catch (error) {
    console.error(error);
  } // should log ["document","photo"]
};

// Middleware to accept a single file upload from the "document" field
export const UploadSingleFile = (req, res, next) => {
  upload.single("document")(req, res, (err) => {
    if (err) {
      return res.status(500).json({
        error: "File upload failed",
        details: err.message,
      });
    }

    const { orgFolder, orgDocumentClassification } = req.body;
    const document = req.file;

    if (!orgFolder || !orgDocumentClassification || !document) {
      return res.status(400).json({
        error:
          "orgFolder, orgDocumentClassification and a file (document) are required",
      });
    }

    req.uploadData = { orgFolder, document };

    next();
  });
};

export const GetAllFile = async (req, res) => {
  const baseDir = path.join(process.cwd(), "../public");

  async function getFilesRecursively(dir) {
    let results = [];
    const list = await fsPromises.readdir(dir, { withFileTypes: true });
    for (const file of list) {
      const fullPath = path.join(dir, file.name);
      if (file.isDirectory()) {
        results = results.concat(await getFilesRecursively(fullPath));
      } else {
        results.push(fullPath);
      }
    }
    return results;
  }

  try {
    const files = await getFilesRecursively(baseDir);
    return res.status(200).json({ files });
  } catch (error) {
    console.error("Error reading files:", error);
    return res.status(500).json({ error: "Could not read files" });
  }
};

export const GetAllImageFile = async (req, res) => {
  const baseDir = path.join(process.cwd(), "../public");

  if (!fs.existsSync(baseDir)) {
    console.error("Directory does not exist:", baseDir);
    return res.status(500).json({ error: "Public directory not found" });
  }

  const imageExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".bmp",
    ".webp",
    ".svg",
  ];

  async function getFilesRecursively(dir) {
    let results = [];
    const list = await fsPromises.readdir(dir, { withFileTypes: true });
    for (const file of list) {
      const fullPath = path.join(dir, file.name);
      if (file.isDirectory()) {
        results = results.concat(await getFilesRecursively(fullPath));
      } else {
        const ext = path.extname(file.name).toLowerCase();
        if (imageExtensions.includes(ext)) {
          results.push(fullPath);
        }
      }
    }
    return results;
  }

  try {
    const files = await getFilesRecursively(baseDir);
    return res.status(200).json({ files });
  } catch (error) {
    console.error("Error reading files:", error);
    return res.status(500).json({ error: "Could not read files" });
  }
};

export const DownloadFile = (req, res) => {
  const { orgFolder, orgDocumentClassification, subDir, file } = req.body;

  // Corrected base directory path
  const filePath = path.join(
    process.cwd(),
    "public",
    orgFolder,
    orgDocumentClassification,
    subDir,
    file
  );

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error("File not found:", filePath);
      return res.status(404).send("File not found");
    }

    res.download(filePath, file, (err) => {
      if (err) {
        console.error("Error downloading file:", err);
        res.status(500).send("Error downloading file.");
      }
    });
  });
};

export const GetAllOrganizationFile = async (req, res) => {
  const baseDir = path.join(process.cwd(), "../public");

  async function getFilesGroupedByOrg(dir) {
    const orgs = await fsPromises.readdir(dir, { withFileTypes: true });
    const result = {};

    for (const org of orgs) {
      if (org.isDirectory()) {
        const orgName = org.name;
        const orgDir = path.join(dir, orgName);
        const allFiles = await getFilesRecursively(orgDir);
        result[orgName] = allFiles.map((file) =>
          path
            .relative(path.join(process.cwd(), "public"), file)
            .replace(/\\/g, "/")
        );
      }
    }

    return result;
  }

  async function getFilesRecursively(dir) {
    let results = [];
    const list = await fsPromises.readdir(dir, { withFileTypes: true });

    for (const file of list) {
      const fullPath = path.join(dir, file.name);
      if (file.isDirectory()) {
        results = results.concat(await getFilesRecursively(fullPath));
      } else {
        results.push(fullPath);
      }
    }

    return results;
  }

  try {
    const filesGrouped = await getFilesGroupedByOrg(baseDir);
    return res.status(200).json({ filesByOrganization: filesGrouped });
  } catch (error) {
    console.error("Error reading files:", error);
    return res.status(500).json({ error: "Could not read files" });
  }
};

export const GetOrganizationFiles = async (req, res) => {
  const { organization } = req.body;

  if (!organization) {
    return res
      .status(400)
      .json({ error: "Organization name is required in the request body." });
  }

  const orgDir = path.join(process.cwd(), "../public", organization);

  async function getFilesRecursively(dir) {
    let results = [];
    const list = await fsPromises.readdir(dir, { withFileTypes: true });

    for (const file of list) {
      const fullPath = path.join(dir, file.name);
      if (file.isDirectory()) {
        results = results.concat(await getFilesRecursively(fullPath));
      } else {
        results.push(fullPath);
      }
    }

    return results;
  }

  try {
    const allFiles = await getFilesRecursively(orgDir);
    const relativePaths = allFiles.map((file) =>
      path
        .relative(path.join(process.cwd(), "public"), file)
        .replace(/\\/g, "/")
    );

    return res.status(200).json({ [organization]: relativePaths });
  } catch (error) {
    console.error("Error reading files:", error);
    return res
      .status(500)
      .json({ error: "Could not read files for the specified organization." });
  }
};

export const GetAllStudentPostFiles = async (req, res) => {
  const baseDir = path.join(process.cwd(), "../public");

  const getFilesRecursively = async (dir) => {
    const entries = await fsPromises.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(
      entries.map(async (entry) => {
        const fullPath = path.join(dir, entry.name);
        return entry.isDirectory()
          ? await getFilesRecursively(fullPath)
          : fullPath;
      })
    );
    return files.flat();
  };

  const getStudentPostFilesInOrg = async (orgDir) => {
    const results = [];

    const walk = async (dir) => {
      const entries = await fsPromises.readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          if (entry.name === "StudentPost") {
            const files = await getFilesRecursively(fullPath);
            results.push(...files);
          } else {
            await walk(fullPath);
          }
        }
      }
    };

    await walk(orgDir);
    return results;
  };

  try {
    const orgs = await fsPromises.readdir(baseDir, { withFileTypes: true });
    const filesByOrganization = {};

    for (const org of orgs) {
      if (org.isDirectory()) {
        const orgDir = path.join(baseDir, org.name);
        const studentPostFiles = await getStudentPostFilesInOrg(orgDir);

        if (studentPostFiles.length > 0) {
          filesByOrganization[org.name] = studentPostFiles.map((filePath) =>
            path.relative(baseDir, filePath).replace(/\\/g, "/")
          );
        }
      }
    }

    return res.status(200).json({ StudentPosts: filesByOrganization });
  } catch (err) {
    console.error("Error retrieving StudentPost files:", err);
    return res
      .status(500)
      .json({ error: "Could not retrieve StudentPost files" });
  }
};

export const GetFilesByDirectory = async (req, res) => {
  const { orgFolder, orgDocumentClassification, subDir } = req.params;

  // Construct full path from params
  const targetDir = path.join(
    process.cwd(),
    "public",
    orgFolder,
    orgDocumentClassification,
    subDir || ""
  );

  if (!fs.existsSync(targetDir)) {
    return res.status(404).json({ error: "Directory does not exist" });
  }

  try {
    const files = await fsPromises.readdir(targetDir, {
      withFileTypes: true,
    });

    const fileList = files
      .filter((f) => f.isFile())
      .map((file) => ({
        name: file.name,
        path: path.join(
          "/",
          orgFolder,
          orgDocumentClassification,
          subDir || "",
          file.name
        ),
      }));

    return res.status(200).json({ files: fileList });
  } catch (error) {
    console.error("Error listing files:", error);
    return res.status(500).json({ error: "Could not list files" });
  }
};
