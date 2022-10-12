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
exports.getTopExercises = exports.updateExercise = exports.getExercise = exports.deleteExercise = exports.getExercises = exports.createExercise = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const exerciseModel_1 = __importDefault(require("../models/exerciseModel"));
// @desc    Create a new exercise
// @route   POST /api/exercises
// @access  Private
const createExercise = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, sportType, exerciseDate, calories, duration, distance, userId } = req.body;
    const exercise = yield exerciseModel_1.default.create({
        name,
        sportType,
        exerciseDate,
        calories,
        duration,
        distance,
        userId
    });
    if (exercise) {
        res.status(201).json({
            name: exercise.name,
            sportType: exercise.sportType,
            exerciseDate: exercise.exerciseDate,
            calories: exercise.calories,
            duration: exercise.duration,
            distance: exercise.distance,
            userId: exercise.userId,
        });
    }
    else {
        res.status(400);
        throw new Error("invalid user data");
    }
}));
exports.createExercise = createExercise;
// @desc    Get user exercises
// @route   GET /api/exercises/history
// @access  Private
const getExercises = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pageSize = 4;
    const page = Number(req.query.pageNumber) || 1;
    let count;
    let exercises;
    if (req.user) {
        count = yield exerciseModel_1.default.countDocuments({ "userId": req.user._id });
        exercises = yield exerciseModel_1.default.find({ "userId": req.user._id })
            .sort({ createdAt: -1 })
            .limit(pageSize)
            .skip(pageSize * (page - 1));
    }
    console.log(count);
    res.json({ exercises, page, pages: Math.ceil(count / pageSize) });
}));
exports.getExercises = getExercises;
// @desc    Delete exercise
// @route   DELETE /api/exercise/:id
// @access  Private
const deleteExercise = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const exercise = yield exerciseModel_1.default.findById(req.params.id);
    if (exercise) {
        yield exercise.remove();
        res.json({ message: "Exercise removed" });
    }
    else {
        res.status(404);
        throw new Error("Exercise not found");
    }
}));
exports.deleteExercise = deleteExercise;
// @desc    Get exercise by ID
// @route   GET /api/exercises/:id
// @access  Private
const getExercise = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const exercise = yield exerciseModel_1.default.findById(req.params.id);
    if (exercise) {
        res.json({
            _id: exercise._id,
            name: exercise.name,
            sportType: exercise.sportType,
            exerciseDate: exercise.exerciseDate,
            calories: exercise.calories,
            duration: exercise.duration,
            distance: exercise.distance,
            userId: exercise.userId,
        });
    }
    else {
        res.status(404);
        throw new Error("Exercise not found");
    }
}));
exports.getExercise = getExercise;
// @desc    Update exercise
// @route   PUT /api/exercises/:id
// @access  Private
const updateExercise = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id, name, sportType, calories, duration, distance, userId } = req.body;
    const exercise = yield exerciseModel_1.default.findById(_id);
    if (exercise) {
        exercise._id = _id;
        exercise.name = name;
        exercise.sportType = sportType;
        exercise.calories = calories;
        exercise.duration = duration;
        exercise.distance = distance;
        exercise.userId = userId;
        const updatedExercise = yield exercise.save();
        res.json(updatedExercise);
        console.log(updatedExercise);
    }
    else {
        res.status(404);
        throw new Error("exercise not found");
    }
}));
exports.updateExercise = updateExercise;
// @desc    Get top latest exercises
// @route   GET /api/exercises/
// @access  Public
const getTopExercises = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let exercises;
    if (req.user)
        exercises = yield exerciseModel_1.default.find({ "userId": req.user._id }).sort({ createdAt: -1 }).limit(3);
    res.json(exercises);
}));
exports.getTopExercises = getTopExercises;
