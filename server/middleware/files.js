import path from "path";
import fs from "fs";
import fsPromises from "fs/promises";
import multer from "multer";

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
  // should log ["document","photo"]
  uploadFields(req, res, (err) => {
    console.log(
      "👀 document files:",
      req.files.document?.map((f) => f.originalname)
    );
    console.log(
      "👀 photo files:",
      req.files.photo?.map((f) => f.originalname)
    );
    if (err) {
      return res.status(500).json({
        error: "File upload failed",
        details: err.message,
      });
    }
    if (err) {
      return res
        .status(500)
        .json({ error: "File upload failed", details: err.message });
    }

    const { orgFolder, orgDocumentClassification } = req.body;
    const documents = req.files?.document;
    const photos = req.files?.photo;

    if (!orgFolder || (!documents && !photos)) {
      return res.status(400).json({
        error:
          "orgFolder and at least one file (document or photo) are required",
      });
    }

    // Log the received data for debugging
    console.log("Received Upload:");
    console.log("Org Folder:", orgFolder);
    console.log("Document Type:", orgDocumentClassification);
    console.log(
      "Documents:",
      documents?.map((file) => file.originalname)
    );
    console.log(
      "Photos:",
      photos?.map((file) => file.originalname)
    );

    next();
  });
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
