import express from "express";
import { privateRouteMiddleware } from "../middleware/private_router.js";
import {
  ConfirmAccreditation,
  Login,
  GetAllAccreditations,
  ProcessAccreditation,
  UpdateAccreditation,
  GetAccreditationById,
} from "../controllers/users.js";
import {
  getAllFile,
  getAllImageFile,
  UploadMultipleFiles,
} from "../middleware/files.js";
import { getOrganizations } from "../controllers/organization.js";

const router = express.Router();

router.get("/protected", privateRouteMiddleware, (req, res) => {
  res.json({ message: "This is a protected route.", user: req.user });
});
router.post("/login", Login);
router.get("/get-all-files", getAllFile);
router.get("/get-all-images", getAllImageFile);

router.post("/accredit", UploadMultipleFiles, ProcessAccreditation);
router.put("/edit-accreditation/:id", UpdateAccreditation);
router.get("/get-accreditation", GetAllAccreditations);
router.get("/get-accreditation/:id", GetAccreditationById);
// router.get("/get-accreditation", getOrganizations);

router.get("/generate-otp", ConfirmAccreditation);

export default router;
