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

import mongoose from "mongoose";

let isConnected = false; // track connection

const connectDB = async () => {
  if (isConnected) return; // reuse existing connection

  try {
    let mongodbURI = process.env.MONGODB_URI;
    const projectName = "ResumeBuilder";

    if (!mongodbURI) {
      throw new Error("MONGODB_URI not found in environment variables");
    }

    // Remove trailing slash if exists
    if (mongodbURI.endsWith("/")) {
      mongodbURI = mongodbURI.slice(0, -1);
    }

    await mongoose.connect(`${mongodbURI}/${projectName}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = true;
    console.log("✅ Mongoose connected to MongoDB");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
  }
};

export default connectDB;
    