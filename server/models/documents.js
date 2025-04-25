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
    event_title: { type: String },
    event_description: { type: String },
    event_date: { type: Date },

    event_score: { type: Number },

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
    event_description: { type: String },
    event_date: { type: Date },

    event_score: { type: Number },

    documents: {
      narrative_report: { type: String },
      attendance_sheet: { type: String },
      certificate: [{ type: String }],
      photo_documentation: [{ type: String }],
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

    event_score: { type: Number },

    over_all_status: { type: String },
    event_title: { type: String },
    event_description: { type: String },
    event_date: { type: Date },

    documents: {
      narrative_report: { type: String },
      official_invitation: { type: String },
      liquidation_report: { type: String },
      echo_seminar_document: { type: String },
      cm063_documents: [{ type: String }],
      photo_documentation: [{ type: String }],
    },
  },
  { timestamps: true }
);

const meetingSchema = new Schema(
  {
    minutes: { type: String },
    photo_documentation: [{ type: String }],
    resolution: [{ type: String }],
  },
  { timestamps: true }
);

const accomplishmentReportSchema = new Schema(
  {
    organization: {
      type: Schema.Types.ObjectId,
      ref: "organizations",
      required: true,
    },

    semester: { type: String },
    academic_year: { type: String },
    cover_page: { type: String },
    table_of_contents: { type: String },
    approved_action_plan: { type: String },

    awards_and_recognition: [{ type: String }],

    meetings: [meetingSchema],
    accomplished_activities: [AccomplishedProposedSchema],
    participation_in_institutional_activities: [
      AccomplishedInstitutionalSchema,
    ],
    participation_in_external_activities: [AccomplishedExternalSchema],
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

// Model Export
const Meeting = mongoose.model("Meeting", meetingSchema);
const Accomplishments = mongoose.model(
  "accomplishment_report",
  accomplishmentReportSchema
);

const ExternalAccomplishments = mongoose.model(
  "external_accomplished",
  AccomplishedExternalSchema
);
const InstutionalAccomplisments = mongoose.model(
  "institutional_accomplished",
  AccomplishedInstitutionalSchema
);
const ProposedAccomplishments = mongoose.model(
  "proposed_accomplished",
  AccomplishedProposedSchema
);
const Proposal = mongoose.model("Proposal", proposalSchema);

export {
  Accomplishments,
  Meeting,
  Proposal,
  ExternalAccomplishments,
  InstutionalAccomplisments,
  ProposedAccomplishments,
};
