import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    Department: String,
    Courses: [String],
  },
  { _id: false }
);

const fieldSchema = new mongoose.Schema(
  {
    Field: String,
    Specializations: [String],
  },
  { _id: false }
);

const programSchema = new mongoose.Schema({
  Classification: {
    type: String,
    enum: ["Local", "System-Wide"],
    required: true,
  },
  Departments: [departmentSchema],
  Fields: [fieldSchema],
});

// Middleware to enforce conditional logic
programSchema.pre("save", function (next) {
  if (this.Classification === "Local") {
    this.Fields = undefined;
    if (!this.Departments || this.Departments.length === 0) {
      return next(
        new Error("Departments are required for Local classification.")
      );
    }
  } else if (this.Classification === "System-Wide") {
    this.Departments = undefined;
    if (!this.Fields || this.Fields.length === 0) {
      return next(
        new Error("Fields are required for System-Wide classification.")
      );
    }
  }
  next();
});

const Program = mongoose.model("Program", programSchema);

export { Program };
