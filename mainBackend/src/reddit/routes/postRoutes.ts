import express from 'express';
import { createPost, getPosts } from '../controllers/postController';
import { authenticate } from '../utils/authMiddleware';
import multer from 'multer';

const router = express.Router();
const upload = multer();

router.post('/', authenticate, upload.single('image'), createPost);
router.get('/', authenticate, getPosts);

export default router;