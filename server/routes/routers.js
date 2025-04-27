import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import {
  UploadMultipleFiles,
  GetAllFile,
  GetAllImageFile,
} from "../middleware/files.js";

import {
  Login,
  GetAllUsername,
  GetProposals,
  GetProposalsbyOrganization,
  GetSingleProposalsbyOrganization,
  GetAccomplishmentsbyOrganization,
  GetSingleAccomplishmentbyOrganization,
  GetAccomplishments,
  GetAllUsernameInfo,
  GetAllOrganization,
} from "../controllers/general.js";

import { UpdateProposalsNotesAdviser } from "../controllers/adviser_admin/document_controller.js";

import {
  SubmitProposalsStudent,
  UpdateProposalsStudent,
} from "../controllers/student_admin/proposal_controller.js";

import {
  SendConfirmationCodeAccreditation,
  ConfirmAccreditation,
  SubmitAccreditation,
  GetAllAccreditations,
  GetAccreditationById,
  UpdateAccreditationSDU,
} from "../controllers/accreditation_controller.js";

import {
  SubmitProposedAccomplishments,
  SubmitExternalAccomplishments,
  SubmitInstutionalAccomplisments,
} from "../controllers/student_admin/accomplishment_controller.js";
import { CreateNewUser } from "../controllers/SDU_admin/user_creations.js";

const router = express.Router();

const ensureDirExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true }); // 🔁 create path recursively
  }
};

const upload = multer();

/* GENERAL ROUTE */
router.post("/login", Login);
router.get("/get-all-files", GetAllFile);

router.get("/get-all-images", GetAllImageFile);
router.get("/get-all-organization", GetAllOrganization);
router.get("/get-all-username", GetAllUsername);
router.get("/get-all-username-info", GetAllUsernameInfo);

router.post("/create-new-user", CreateNewUser);

/*ACCREDITATION ROUTE*/
router.get("/get-accreditation", GetAllAccreditations);
router.get("/get-accreditation/:id", GetAccreditationById);
router.post("/confirm-verification-accreditation", ConfirmAccreditation);

router.post(
  "/send-verification-accreditation",
  SendConfirmationCodeAccreditation
);

router.post(
  "/upload-accreditation-student",
  UploadMultipleFiles,
  SubmitAccreditation
);
router.put("/process-accreditation-sdu/:id", UpdateAccreditationSDU);

//Proposal Route
router.get("/proposals/", GetProposals);
router.get("/proposals/:organizationId", GetProposalsbyOrganization);
router.get(
  "/proposals/:organizationId/:proposalId",
  GetSingleProposalsbyOrganization
);

router.post("/submit-proposals", UploadMultipleFiles, SubmitProposalsStudent);
router.post(
  "/update-proposal-student/:proposalId",
  UploadMultipleFiles,
  UpdateProposalsStudent
);
router.put(
  `/update-proposals-adviser/:proposalId`,
  UpdateProposalsNotesAdviser
);

//Accomplishment Route
router.get("/accomplishments", GetAccomplishments);

router.get(
  "/accomplishments/:organizationId",
  GetAccomplishmentsbyOrganization
);
router.get(
  "/accomplishments/:organizationId/:proposalId",
  GetSingleAccomplishmentbyOrganization
);

router.post(
  "/submit-proposed-accomplishment",
  UploadMultipleFiles,
  SubmitProposedAccomplishments
);
router.post(
  "/submit-instutional-accomplishment",
  UploadMultipleFiles,
  SubmitInstutionalAccomplisments
);
router.post(
  "/submit-external-accomplishment",
  UploadMultipleFiles,
  SubmitExternalAccomplishments
);

export default router;
