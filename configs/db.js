// config/db.js
import mongoose from "mongoose";

let isConnected = false; // Track the connection state

const connectDB = async () => {
  if (isConnected) {
    console.log("⚡ Using existing MongoDB connection");
    return;
  }

  try {
    const mongodbURI = process.env.MONGODB_URI;

    // --- 1️⃣ Fail-fast validation ---
    if (!mongodbURI) {
      throw new Error("❌ Missing MONGODB_URI in environment variables");
    }

    if (!mongodbURI.startsWith("mongodb+srv://")) {
      throw new Error("❌ Invalid MONGODB_URI format. It must start with 'mongodb+srv://'");
    }

    // --- 2️⃣ Optional: Ensure a DB name exists in the URI ---
    const uriParts = mongodbURI.split("/");
    const lastPart = uriParts[uriParts.length - 1];
    if (!lastPart.includes("?")) {
      throw new Error("❌ MongoDB URI missing database name before query params (e.g. /YourDBName?...)");
    }

    console.log("⏳ Connecting to MongoDB...");

    // --- 3️⃣ Connect ---
    const conn = await mongoose.connect(mongodbURI, {
      serverSelectionTimeoutMS: 5000, // Fail fast on bad clusters
      maxPoolSize: 5, // Small pool for serverless/Vercel
      family: 4, // IPv4 preferred for Vercel
    });

    isConnected = conn.connections[0].readyState === 1;
    console.log(`✅ MongoDB connected to: ${conn.connection.host}`);

  } catch (error) {
    console.error("🚨 MongoDB Connection Error:", error.message);
    // Fail-fast: stop app startup if DB is invalid
    process.exit(1);
  }
};

export default connectDB;
