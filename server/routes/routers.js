import express from "express";
import path from "path";
import fs from "fs";

import {
  UploadMultipleFiles,
  GetAllFile,
  GetAllImageFile,
  GetAllOrganizationFile,
  GetAllStudentPostFiles,
  GetOrganizationFiles,
} from "../middleware/files.js";

import {
  Login,
  GetAllUsername,
  GetProposals,
  GetProposalsbyOrganization,
  GetSingleProposalsbyOrganization,
  GetAccomplishmentsbyOrganization,
  GetAccomplishments,
  GetAllUsernameInfo,
  GetAllOrganization,
  GetSingleInstitutiuonalAccomplishmentbyOrganization,
  GetOrganizationsByDepartment,
  GetProposalsByOrganizationsDean,
  GetAccomplishmentsByOrganizationsDean,
  GetOrganizationByOrgName,
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
  UpdateProposedAccomplishments,
  UpdateInstutionalAccomplishments,
  UpdateExternalAccomplishments,
} from "../controllers/student_admin/accomplishment_controller.js";
import { CreateNewUser } from "../controllers/SDU_admin/user_creations.js";
import multer from "multer";
import {
  CreateNewPosts,
  GetAllOrgPosts,
  UpdatePosts,
  ApprovedPosts,
  RevisionPosts,
  GetAllPosts,
} from "../controllers/posts.js";
import {
  AddPinnedFiles,
  GetFileNames,
} from "../controllers/file_controller.js";
import {
  UpdateExternalAccomplishmentNotesAdviser,
  UpdateInternalAccomplishmentNotesAdviser,
  UpdateProposalAccomplishmentNotesAdviser,
} from "../controllers/adviser_admin/accomplishment_controller.js";

const upload = multer();

const router = express.Router();

/* GENERAL ROUTE */
router.post("/login", Login);
router.get("/get-all-files", GetAllFile);
router.get("/get-all-organization-files", GetAllOrganizationFile);
router.post("/get-organization-files", GetOrganizationFiles);
router.get("/get-all-student-post", GetAllStudentPostFiles);
router.get("/get-org/:orgname", GetOrganizationByOrgName);

router.post("/get-by-organization", GetOrganizationsByDepartment);

router.get("/get-all-images", GetAllImageFile);
router.get("/get-all-organization", GetAllOrganization);
router.get("/get-all-username", GetAllUsername);
router.get("/get-all-username-info", GetAllUsernameInfo);

router.get("/get-pinned-files/:organizationId", GetFileNames);

router.post("/create-new-user", CreateNewUser);

/*ACCREDITATION ROUTE*/
router.get("/get-accreditation", GetAllAccreditations);
router.get("/get-accreditation/:id", GetAccreditationById);
router.post("/confirm-verification-accreditation", ConfirmAccreditation);
router.post("/pin-files", AddPinnedFiles);

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
router.post("/proposals/dean", GetProposalsByOrganizationsDean);
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

router.post(
  `/get-accomplishments-ossd/`,
  GetAccomplishmentsByOrganizationsDean
);

//Accomplishment Route
router.get("/accomplishments", GetAccomplishments);

router.get(
  "/accomplishments/:organizationId",
  GetAccomplishmentsbyOrganization
);
router.get(
  "/accomplishments/:organizationId/:proposalId",
  GetSingleInstitutiuonalAccomplishmentbyOrganization
);

router.post(
  "/update-proposed-accomplishment/:accomplishmentId",
  UploadMultipleFiles,
  UpdateProposedAccomplishments
);
router.post(
  "/update-instutional-accomplishment/:accomplishmentId",
  UploadMultipleFiles,
  UpdateInstutionalAccomplishments
);
router.post(
  "/update-external-accomplishment/:accomplishmentId",
  UploadMultipleFiles,
  UpdateExternalAccomplishments
);

// adviser note
router.post(
  "/update-proposed-accomplishment/adviser/:accomplishmentId",
  UpdateProposalAccomplishmentNotesAdviser
);
router.post(
  "/update-institutional-accomplishment/adviser/:accomplishmentId",
  UpdateInternalAccomplishmentNotesAdviser
);

router.post(
  "/update-external-accomplishment/adviser/:accomplishmentId",
  UpdateExternalAccomplishmentNotesAdviser
);

router.post(
  "/submit-proposed-accomplishment",
  UploadMultipleFiles,
  SubmitProposedAccomplishments
);

router.post(
  "/submit-institutional-accomplishment",
  UploadMultipleFiles,
  SubmitInstutionalAccomplisments
);
router.post(
  "/submit-external-accomplishment",
  UploadMultipleFiles,
  SubmitExternalAccomplishments
);

//POSTING ROUTES

router.post("/upload-post", UploadMultipleFiles, CreateNewPosts);
router.post("/update-post/:postId", UploadMultipleFiles, UpdatePosts);
router.post("/approve-post/:postId", upload.any(), ApprovedPosts);
router.post("/revision-post/:postId", upload.any(), RevisionPosts);
router.get("/get-post/:orgId", GetAllOrgPosts);
router.get("/get-post", GetAllPosts);
export default router;
