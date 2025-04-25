import mongoose from "mongoose";

const AccreditationStatusSchema = new mongoose.Schema(
  {
    accreditation_type: {
      type: String,
      required: true,
      enum: ["renewal", "recognition"],
    },
    over_all_status: {
      type: String,
      enum: ["Pending", "Accredited", "Revision Required", "HardCopy Required"],
      required: true,
    },
    // Change this to an array so multiple files can be stored individually.
    documents_and_status: [
      {
        label: { type: String, required: true },
        Status: { type: String, required: true, default: "pending" },
        revision_notes: { type: String, default: "" },
        file: { type: String, required: true }, // URL or filepath
      },
    ],
  },
  { timestamps: true }
);

const OrganizationSchema = new mongoose.Schema(
  {
    adviser_name: { type: String, required: true },
    adviser_email: { type: String, required: true },
    adviser_department: { type: String, required: true },

    org_name: { type: String, required: true },
    org_acronym: { type: String, required: true },
    org_president: { type: String, required: true },
    org_class: { type: Object, required: true },
    org_email: { type: String, required: true },
    logo: { type: String },

    recognition_date: { type: Date },

    accreditation_status: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "accreditations",
    },
  },
  { timestamps: true }
);

const UserSchema = new mongoose.Schema(
  {
    username: { type: String },
    password: { type: String, minlength: 6 },
    position: {
      type: String,
      trim: true,
      enum: ["student-leader", "adviser", "dean", "SDU", "OSSD"],
    }, // adviser, student rep, ossd coordinator, dean, ossd &SDU head,

    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "organizations",
    },
  },
  { timestamps: true }
);

const Users = mongoose.model("user", UserSchema);
const Organizations = mongoose.model("organizations", OrganizationSchema);

const Accreditation = mongoose.model(
  "accreditations",
  AccreditationStatusSchema
);

export { Users, Organizations, Accreditation };
