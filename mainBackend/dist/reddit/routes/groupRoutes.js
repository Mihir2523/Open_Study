"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const groupController_1 = require("../controllers/groupController");
const authMiddleware_1 = require("../utils/authMiddleware");
const router = express_1.default.Router();
router.post('/', authMiddleware_1.authenticate, groupController_1.createGroup);
router.post('/:groupId/join', authMiddleware_1.authenticate, groupController_1.joinGroup);
exports.default = router;
