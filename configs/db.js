//  local host code
// import mongoose from "mongoose";


// const connectDB = async () => {
//     try{
//            mongoose.connection.on("connected", () => {
//             console.log(`Mongoose Connected to DB`);
//            })
//              let mongodbURI = process.env.MONGODB_URI;
//              const projectName ="ResumeBuilder";
        
//         if(!mongodbURI){
//             throw new Error("MONGODB_URI not found in environment variables");
//         }
//         if(mongodbURI.endsWith('/')){
//             mongodbURI = mongodbURI.slice(0, -1);
//         }
//         await mongoose.connect(`${mongodbURI}/${projectName}`)
        
//             }catch(error){
//                 console.error("Error connecting to MongoDB:", error);
//             }

// }

// export default connectDB;

// db.js
import mongoose from "mongoose";

let isConnected = false; // Track connection state

const connectDB = async () => {
  if (isConnected) {
    console.log("⚡ Using existing MongoDB connection");
    return;
  }

  try {
    const mongodbURI = process.env.MONGODB_URI;

    if (!mongodbURI) {
      throw new Error("❌ MONGODB_URI not found in environment variables");
    }

    const conn = await mongoose.connect(mongodbURI, {
      serverSelectionTimeoutMS: 5000, // Avoid long timeouts
      maxPoolSize: 1, // Use a small connection pool for serverless
    });

    isConnected = conn.connections[0].readyState === 1;

    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error.message);
    throw error;
  }
};

export default connectDB;
