"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserAdmin = exports.getUserAdmin = exports.deleteUserAdmin = exports.getUsersAdmin = exports.updateUserProfile = exports.getUserProfile = exports.authUser = exports.registerUser = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const userModel_1 = __importDefault(require("../models/userModel"));
// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    const userExists = yield userModel_1.default.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }
    const user = yield userModel_1.default.create({
        name,
        email,
        password,
    });
    if (user) {
        res.status(201).json({
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: (0, generateToken_1.default)(user._id.toString()),
        });
    }
    else {
        res.status(400);
        throw new Error("Invalid user data");
    }
}));
exports.registerUser = registerUser;
// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield userModel_1.default.findOne({ email });
    if (user && (user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: (0, generateToken_1.default)(user._id.toString()),
        });
    }
    else {
        res.status(401);
        throw new Error("Invalid email or password");
    }
}));
exports.authUser = authUser;
// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let user;
    if (req.user) {
        user = yield userModel_1.default.findById(req.user._id);
    }
    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    }
    else {
        res.status(404);
        throw new Error("User not found");
    }
}));
exports.getUserProfile = getUserProfile;
// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let user;
    if (req.user) {
        user = yield userModel_1.default.findById(req.user._id);
    }
    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.isAdmin = req.body.isAdmin || user.isAdmin;
        if (req.body.password) {
            user.password = req.body.password;
        }
        const updatedUser = yield user.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            token: (0, generateToken_1.default)(updatedUser._id.toString()),
        });
    }
    else {
        res.status(404);
        throw new Error("User not found");
    }
}));
exports.updateUserProfile = updateUserProfile;
// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsersAdmin = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield userModel_1.default.find({});
    res.json(users);
}));
exports.getUsersAdmin = getUsersAdmin;
// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUserAdmin = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.default.findById(req.params.id);
    if (user) {
        yield user.remove();
        res.json({ message: "User removed" });
    }
    else {
        res.status(404);
        throw new Error("User not found");
    }
}));
exports.deleteUserAdmin = deleteUserAdmin;
// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserAdmin = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.default.findById(req.params.id).select("-password");
    if (user) {
        res.json(user);
    }
    else {
        res.status(404);
        throw new Error("User not found");
    }
}));
exports.getUserAdmin = getUserAdmin;
// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUserAdmin = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.default.findById(req.params.id);
    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.isAdmin = req.body.isAdmin;
        const updatedUser = yield user.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin
        });
    }
    else {
        res.status(404);
        throw new Error("User not found");
    }
}));
exports.updateUserAdmin = updateUserAdmin;
