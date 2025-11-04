// configs/db.js
const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log("⚡ Using existing MongoDB connection");
    return;
  }

  try {
    const mongodbURI = process.env.MONGODB_URI;

    if (!mongodbURI) {
      throw new Error("❌ Missing MONGODB_URI in environment variables");
    }

    console.log("⏳ Connecting to MongoDB...");

    const conn = await mongoose.connect(mongodbURI, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 5,
      family: 4, // prefer IPv4 for serverless environments
    });

    isConnected = conn.connections[0].readyState === 1;
    console.log(`✅ MongoDB connected to: ${conn.connection.host}`);
  } catch (error) {
    console.error("🚨 MongoDB Connection Error:", error.message);
    throw new Error("Database connection failed");
  }
};

module.exports = connectDB;
