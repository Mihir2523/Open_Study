import { Request, Response } from 'express';
import Post from '../models/Post.js';
import { uploadFile } from '../utils/appwrite';
import User from '../models/User';

export const createPost = async (req: any, res: Response) => {
  try {
    const { title, content, groupId } = req.body;
    const user = req.user;
    let imageUrl;

    if (req.file) {
      const file = await uploadFile(req.file.buffer, req.file.originalname);
      imageUrl = `https://cloud.appwrite.io/v1/storage/buckets/${process.env.APPWRITE_BUCKET_ID}/files/${file.$id}/view?project=${process.env.APPWRITE_PROJECT_ID}`;
    }

    const post = await Post.create({
      title,
      content,
      imageUrl,
      author: user._id,
      group: groupId || null
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error creating post' });
  }
};

export const getPosts = async (req: Request, res: Response) => {
  try {
    const { groupId } = req.query;
    const filter = groupId ? { group: groupId } : {};
    
    const posts = await Post.find(filter)
      .populate('author', 'name')
      .populate('group', 'name')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts' });
  }
};