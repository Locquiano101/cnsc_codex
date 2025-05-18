const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema({
  label: { type: String, required: true },
  status: {
    type: String,
    enum: ["completed", "for revisions", "pending"],
    default: "pending",
  },
  revision_notes: { type: String, default: "" },
  file: { type: String, required: true },
});

const TimelineEntrySchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  action: { type: String, required: true }, // e.g., "Submitted Document 1", "Marked for Revisions", etc.
});

const AccreditationStatusSchema = new mongoose.Schema(
  {
    accreditation_type: {
      type: String,
      required: true,
      enum: ["renewal", "recognition"],
    },
    overall_status: {
      type: String,
      enum: ["pending", "accredited", "revision required"],
      required: true,
      default: "pending",
    },
    documents_and_status: [DocumentSchema],
    tracking_timeline: [TimelineEntrySchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "AccreditationStatus",
  AccreditationStatusSchema
);

function calculateProgress(documents) {
  const completedCount = documents.filter(
    (doc) => doc.status === "completed"
  ).length;
  return {
    total: documents.length,
    completed: completedCount,
    percent: Math.round((completedCount / documents.length) * 100),
  };
}

const newEntry = {
  timestamp: new Date(),
  action: `Document ${doc.label} marked as ${doc.status}`,
};

accreditationStatus.tracking_timeline.push(newEntry);

app.put("/accreditation/:id/document/:label", async (req, res) => {
  const { id, label } = req.params;
  const { status, revision_notes, file } = req.body;

  const accreditation = await AccreditationStatus.findById(id);
  const doc = accreditation.documents_and_status.find((d) => d.label === label);
  if (!doc) return res.status(404).send("Document not found");

  doc.status = status;
  doc.revision_notes = revision_notes || "";
  doc.file = file || doc.file;

  accreditation.tracking_timeline.push({
    timestamp: new Date(),
    action: `Document ${label} updated to status: ${status}`,
  });

  accreditation.overall_status = determineOverallStatus(
    accreditation.documents_and_status
  );

  await accreditation.save();
  res.send(accreditation);
});
