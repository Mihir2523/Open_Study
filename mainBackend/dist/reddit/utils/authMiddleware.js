"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const appwrite_1 = require("./appwrite");
const User_1 = __importDefault(require("../models/User"));
const authenticate = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }
    try {
        const { $id, name, email } = await (0, appwrite_1.verifyToken)(token);
        let user = await User_1.default.findOne({ appwriteId: $id });
        if (!user) {
            user = await User_1.default.create({ appwriteId: $id, name, email });
        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(403).json({ message: 'Invalid token' });
    }
};
exports.authenticate = authenticate;
