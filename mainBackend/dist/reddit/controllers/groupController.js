"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinGroup = exports.createGroup = void 0;
const Group_1 = __importDefault(require("../models/Group"));
const User_1 = __importDefault(require("../models/User"));
const createGroup = async (req, res) => {
    try {
        const { name, description } = req.body;
        const user = req.user;
        const group = await Group_1.default.create({
            name,
            description,
            admin: user._id,
            members: [user._id]
        });
        await User_1.default.findByIdAndUpdate(user._id, {
            $push: { groups: group._id }
        });
        res.status(201).json(group);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating group' });
    }
};
exports.createGroup = createGroup;
const joinGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const user = req.user;
        const group = await Group_1.default.findByIdAndUpdate(groupId, { $addToSet: { members: user._id } }, { new: true });
        await User_1.default.findByIdAndUpdate(user._id, {
            $addToSet: { groups: groupId }
        });
        res.json(group);
    }
    catch (error) {
        res.status(500).json({ message: 'Error joining group' });
    }
};
exports.joinGroup = joinGroup;
