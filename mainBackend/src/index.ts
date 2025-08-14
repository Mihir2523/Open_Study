import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import postRoutes from './reddit/routes/postRoutes';
import groupRoutes from './reddit/routes/groupRoutes';
import commentRoutes from './reddit/routes/commentRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI!)
  .then(() => {
    console.log('MongoDB connected')

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });    
  })
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/posts', postRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/comments', commentRoutes);