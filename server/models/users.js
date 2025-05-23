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
    org_type: { type: Object, required: true },
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
    name: { type: String },
    delivery_unit: { type: String },
    username: { type: String },
    password: { type: String, minlength: 6 },
    position: {
      type: String,
      trim: true,
      enum: [
        "student-leader",
        "adviser",
        "dean",
        "SDU",
        "OSSD",
        "OSSD Coordinator",
      ],
    }, // adviser, student rep, ossd coordinator, dean, ossd &SDU head,

    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "organizations",
    },
  },
  { timestamps: true }
);

const PostSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "organizations",
    },
    title: { type: String },
    caption: { type: String },
    status: { type: String },
    revision_notes: { type: String },
    tags: [{ type: String }],
    content: { type: Object },
  },
  { timestamps: true }
);

const FileSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "organizations",
    },
    pinned_files: {
      type: Array,
    },
  },
  { timestamps: true }
);

const LogSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "organizations",
    },
    action: { type: String },
  },
  { timestamps: true }
);

const Users = mongoose.model("user", UserSchema);
const SystemLogs = mongoose.model("system log", LogSchema);
const Posts = mongoose.model("Posts", PostSchema);
const PinnedFiles = mongoose.model("Pinned Files", FileSchema);
const Organizations = mongoose.model("organizations", OrganizationSchema);

const Accreditation = mongoose.model(
  "accreditations",
  AccreditationStatusSchema
);

export { Users, SystemLogs, Posts, PinnedFiles, Organizations, Accreditation };
