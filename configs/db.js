import mongoose from "mongoose";


const connectDB = async () => {
    try{
           mongoose.connection.on("connected", () => {
            console.log(`Mongoose Connected to DB`);
           })
             let mongodbURI = process.env.MONGODB_URI;
             const projectName ="ResumeBuilder";
        
        if(!mongodbURI){
            throw new Error("MONGODB_URI not found in environment variables");
        }
        if(mongodbURI.endsWith('/')){
            mongodbURI = mongodbURI.slice(0, -1);
        }
        await mongoose.connect(`${mongodbURI}/${projectName}`)
        
            }catch(error){
                console.error("Error connecting to MongoDB:", error);
            }

}

export default connectDB;