"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const commentController_1 = require("../controllers/commentController");
const authMiddleware_1 = require("../utils/authMiddleware");
const router = express_1.default.Router();
router.post('/:postId', authMiddleware_1.authenticate, commentController_1.createComment);
router.get('/:postId', authMiddleware_1.authenticate, commentController_1.getComments);
exports.default = router;
