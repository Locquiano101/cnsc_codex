import mongoose from "mongoose";
// Define the User schema
const UserSchema = new mongoose.Schema(
  {
    username: { type: String },
    password: { type: String, minlength: 6 },
    position: { type: String, trim: true }, // adviser, student rep, ossd coordinator, dean, ossd & SDU head
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "organizations",
    },
  },
  { timestamps: true }
);

// Create the User model
const User = mongoose.model("User", UserSchema);

// Seed function
const seedUser = async () => {
  try {
    // Connect to your MongoDB instance (adjust the URI as needed)
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/CapstoneProject",
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
    console.log("Connected to MongoDB");

    // Clear previous users (optional)

    // Create a new user with the organization field set to null
    const seedData = {
      username: "testuser",
      password: "password123", // Ensure you meet any required password policies
      position: "student rep",
      organization: null, // Setting organization as null
    };

    const newUser = await User.create(seedData);
    console.log("User seeded successfully:", newUser);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding user:", error);
    process.exit(1);
  }
};

seedUser();
