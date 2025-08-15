import dotenv from 'dotenv';
dotenv.config();
console.log("Environment variables:", {
  APPWRITE_ENDPOINT: process.env.APPWRITE_ENDPOINT,
  APPWRITE_PROJECT_ID: process.env.APPWRITE_PROJECT_ID,
  APPWRITE_API_KEY: process.env.APPWRITE_API_KEY,
});
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import redditPostRoutes from './reddit/routes/postRoutes';
import redditGroupRoutes from './reddit/routes/groupRoutes';
import redditCommentRoutes from './reddit/routes/commentRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI!)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/posts', redditPostRoutes);
app.use('/api/groups', redditGroupRoutes);
app.use('/api/comments', redditCommentRoutes);

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});