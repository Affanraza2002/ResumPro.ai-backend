import User from "../models/User.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Resume from "../models/Resume.js";

const  generateToken = (userId) => {
  const token = jwt.sign({userId}, process.env.JWT_SECRET, { expiresIn: '10d' })
  return token 
  ; 
}
//POST :/api/users/registers
export  const registerUser = async (req,res) => {
 try {
    const {name,email,password} = req.body;
    //check if required fields are present
    if(!name|| !email ||!password){
        return res.status(400).json({message: 'Please enter all fields'});
    
    }
   const user= await User.findOne({email});
   if(user){
    return res.status(400).json({message: 'User already exists'});
   }

   //create a new user
   const hashedPassword = await bcrypt.hash(password,10);
  const newUser = await  User.create ({name,email,password:hashedPassword});
   
  //return successful response with token
  const token = generateToken(newUser._id);
  newUser.password = undefined; 
  return res.status(200).json({message:"User Created Successfully",user:newUser,token});

} 
 
 catch (error) { 
  return res.status(400).json({message: error.message});  
 }
}
//controller for login
//POST :/api/users/login
export  const loginUser = async (req,res) => {
 try {
    const {email,password} = req.body;  
    
    //check if User exists
    const user= await User.findOne({email});
   if(!user){
    return res.status(400).json({message: 'Invalid email or password'});
   }

   //check if password is correct
   if(!user.comparePassword(password)){
    return  res.status(400).json({message: 'Invalid email or password'});
   }
   const newUser = user.toObject();


  //return successful response with token
  const token = generateToken(newUser._id);
  newUser.password = undefined; 
  return res.status(200).json({message:"User Login Successfully",token,user});

} catch (error) {  
  return res.status(400).json({message:error.message});  
 }
}


//controller for get user by id
//Get:/app/users/data
export  const getUserById = async (req,res) => {
 try {
    const userId= req.userId;  
    
    //check if User exists 
    const user= await User.findById(userId);
   if(!user){
     return res.status(404).json({message: "User not found "});  
   }
   //return user data
   user.password = undefined; 
 return res.status(200).json({user})

} catch (error) { 
  return res.status(400).json({message: error.message});  
 }
}


//Controller for getting user resume 
//GET: /app/users/resume
export const getUserResumes = async (req,res) => {
    try {
       const userId =req.userId;
       //return user resumes
       const resumes  = await Resume.find({userId});
       return res.status(200).json({resumes});        
    } catch (error) {
        return res.status(400).json({message: error.message});
    }
}
