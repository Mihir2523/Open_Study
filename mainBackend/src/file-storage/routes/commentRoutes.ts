import express from 'express';
import { createComment, getComments } from '../controllers/commentController';
import { authenticate } from '../utils/authMiddleware';

const router = express.Router();

router.post('/:postId', authenticate, createComment);
router.get('/:postId', authenticate, getComments);

export default router;