"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const postController_1 = require("../controllers/postController");
const authMiddleware_1 = require("../utils/authMiddleware");
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
const upload = (0, multer_1.default)();
router.post('/', authMiddleware_1.authenticate, upload.single('image'), postController_1.createPost);
router.get('/', authMiddleware_1.authenticate, postController_1.getPosts);
exports.default = router;
