// server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import apiRoutes from "./routes/routers.js";
dotenv.config();
import path from "path";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For form-data (URL-encoded)
app.use(express.json({ limit: "50mb" }));
app.use("/public", express.static(path.resolve("public")));

const DB = process.env.MONGO_URI;

async function connectDB() {
  try {
    await mongoose
      .connect(DB)
      .then(() => console.log(`Connected to MongoDB ${DB}`))
      .catch((err) => console.error("MongoDB connection error:", err));
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    process.exit(1);
  }
}
connectDB();

// Routes
app.use("/api", apiRoutes);

app.listen(PORT, () =>
  console.log(`Server running on port localhost//${PORT}`)
);
