import { Request, Response } from 'express';
import Comment from '../models/Comment';
import User from '../models/User';

export const createComment = async (req: any, res: Response) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const user = req.user;

    const comment = await Comment.create({
      content,
      author: user._id,
      post: postId
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Error creating comment' });
  }
};

export const getComments = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ post: postId })
      .populate('author', 'name')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching comments' });
  }
};