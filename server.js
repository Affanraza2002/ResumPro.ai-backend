const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./configs/db.js');
const userRouter = require('./routes/userRoutes.js');
const resumeRouter = require('./routes/resumeRoutes.js');
const aiRoutes = require('./routes/aiRoutes.js');
const serverless = require('serverless-http');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Connect database
connectDB();

// Routes
app.use('/api/users', userRouter);
app.use('/api/resumes', resumeRouter);
app.use('/api/ai', aiRoutes);

// Default route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Server is live!' });
});

// ✅ Export a single handler function for Vercel
module.exports = serverless(app);
