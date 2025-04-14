import express from "express";
import { privateRouteMiddleware } from "../middleware/private_router.js";
import {
  ConfirmAccreditation,
  Login,
  GetAllAccreditations,
  ProcessAccreditation,
  GetAccreditationById,
  testUpdate,
} from "../controllers/users.js";
import {
  getAllFile,
  getAllImageFile,
  UploadMultipleFiles,
} from "../middleware/files.js";
import { UpdateAccreditationSandbox } from "../controllers/sandbox.js";

const router = express.Router();

router.get("/protected", privateRouteMiddleware, (req, res) => {
  res.json({ message: "This is a protected route.", user: req.user });
});
router.post("/login", Login);
router.get("/get-all-files", getAllFile);
router.get("/get-all-images", getAllImageFile);

router.post("/accredit", UploadMultipleFiles, ProcessAccreditation);

router.put("/edit-accreditation/:id", UpdateAccreditationSandbox);

router.get("/get-accreditation", GetAllAccreditations);
router.get("/get-accreditation/:id", GetAccreditationById);
// router.get("/get-accreditation", getOrganizations);

router.get("/generate-otp", ConfirmAccreditation);

export default router;
