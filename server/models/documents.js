import mongoose from "mongoose";
import { stringify } from "uuid";

const { Schema } = mongoose;

const AccomplishedProposedSchema = new Schema(
  {
    organization: {
      type: Schema.Types.ObjectId,
      ref: "organizations",
      required: true,
    },
    over_all_status: { type: String },
    activity_type: { type: String },
    event_title: { type: String },
    event_description: { type: String },
    event_status: { type: String },
    event_date: { type: Date },

    event_score: { type: Number, default: null },
    documents: {
      approved_proposal: { type: String },
      attendance_sheet: { type: String },
      narrative_report: { type: String },
      financial_report: { type: String },
      evaluation_summary: { type: String },

      sample_evaluations: [{ type: String }],
      photo_documentation: [{ type: String }],

      attendance_sheet_note: { type: String },
      narrative_report_note: { type: String },
      financial_report_note: { type: String },
      approved_proposal_note: { type: String },
      evaluation_summary_note: { type: String },

      attendance_sheet_status: { type: String },
      narrative_report_status: { type: String },
      financial_report_status: { type: String },
      approved_proposal_status: { type: String },
      evaluation_summary_status: { type: String },
    },
  },
  { timestamps: true }
);

const AccomplishedInstitutionalSchema = new Schema(
  {
    organization: {
      type: Schema.Types.ObjectId,
      ref: "organizations",
      required: true,
    },
    over_all_status: { type: String },
    event_title: { type: String },
    activity_type: { type: String },
    event_description: { type: String },
    event_date: { type: Date },

    event_score: { type: Number, default: null },
    documents: {
      narrative_status: { type: String },
      narrative_notes: { type: String },
      attendance_status: { type: String },
      attendance_notes: { type: String },

      documentation_status: { type: String },
      documentation_notes: { type: String },
      certificate_status: { type: String },
      certificate_notes: { type: String },

      narrative_report: { type: String },
      attendance_sheet: { type: String },
      certificate: [{ type: String }],
      photo_documentations: [{ type: String }],
    },
  },
  { timestamps: true }
);

const AccomplishedExternalSchema = new Schema(
  {
    organization: {
      type: Schema.Types.ObjectId,
      ref: "organizations",
      required: true,
    },

    activity_type: { type: String, require: true },

    over_all_status: { type: String },

    event_title: { type: String },
    event_description: { type: String },
    event_date: { type: Date },

    event_score: { type: Number, default: null },

    documents: {
      narrative_report: { type: String },
      official_invitation: { type: String },
      liquidation_report: { type: String },
      echo_seminar_document: { type: String },
      cm063_documents: [{ type: String }],
      photo_documentation: [{ type: String }],

      narrative_report_notes: { type: String },
      official_invitation_notes: { type: String },
      liquidation_report_notes: { type: String },
      echo_seminar_document_notes: { type: String },
      cm063_documents_notes: { type: String },
      photo_documentation_notes: { type: String },

      narrative_report_status: { type: String },
      official_invitation_status: { type: String },
      liquidation_report_status: { type: String },
      echo_seminar_document_status: { type: String },
      cm063_documents_status: { type: String },
      photo_documentation_status: { type: String },
    },
  },
  { timestamps: true }
);

// Proposal Schema
const proposalSchema = new Schema(
  {
    organization: {
      type: Schema.Types.ObjectId,
      ref: "organizations",
      required: true,
    },

    title: { type: String },
    event_date: { type: Date },

    description: { type: String },
    approval_status: {
      type: String,
    },

    updated_date: { type: Date, default: Date.now },

    meeting: {
      notice_document: { type: String }, // URL to notice of meeting
      minutes_document: { type: String }, // URL to meeting minutes
      proposal_document: { type: String }, // URL to notice of meeting

      notice_document_note: { type: String }, // URL to notice of meeting
      minutes_document_note: { type: String }, // URL to meeting minutes
      proposal_document_note: { type: String }, // URL to notice of meeting

      notice_document_status: { type: String }, // URL to notice of meeting
      minutes_document_status: { type: String }, // URL to meeting minutes
      proposal_document_status: { type: String }, // URL to notice of meeting

      resolution_document: [{ type: String }], // URL to the resolution document
      photo_documentations: [{ type: String }], // URLs to photos
    },
  },
  { timestamps: true }
);

const ExternalAccomplishments = mongoose.model(
  "external_accomplishment",
  AccomplishedExternalSchema
);
const InstutionalAccomplisments = mongoose.model(
  "institutional_accomplishment",
  AccomplishedInstitutionalSchema
);
const ProposedAccomplishments = mongoose.model(
  "proposed_accomplishment",
  AccomplishedProposedSchema
);
const Proposal = mongoose.model("Proposal", proposalSchema);

export {
  Proposal,
  ExternalAccomplishments,
  InstutionalAccomplisments,
  ProposedAccomplishments,
};
