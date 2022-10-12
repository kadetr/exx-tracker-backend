import { Response } from "express";
import asyncHandler from "express-async-handler";
import Exercise from "../models/exerciseModel";
import { IUserRequest } from "../types/custom";


// @desc    Create a new exercise
// @route   POST /api/exercises
// @access  Private
const createExercise = asyncHandler(async (req, res) => {
    const {
       name,
       sportType,
       exerciseDate,
       calories,
       duration,
       distance,
       userId
    } = req.body;
 
    const exercise = await Exercise.create({
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
    } else {
       res.status(400);
       throw new Error("invalid user data");
    }
 });

// @desc    Get user exercises
// @route   GET /api/exercises/history
// @access  Private
 const getExercises = asyncHandler(async (req:IUserRequest, res: Response) => {
    const pageSize = 4;
    const page = Number(req.query.pageNumber) || 1;

    let count: any;
    let exercises: any ;
   if(req.user){
      count = await Exercise.countDocuments({"userId": req.user._id});
      exercises = await Exercise.find({"userId": req.user._id})
         .sort({ createdAt: -1 })
         .limit(pageSize)
         .skip(pageSize * (page - 1));
   }
   
   console.log(count);
    res.json({ exercises, page, pages: Math.ceil(count / pageSize) });
 });
 
 // @desc    Delete exercise
 // @route   DELETE /api/exercise/:id
 // @access  Private
 const deleteExercise = asyncHandler(async (req, res) => {
    const exercise = await Exercise.findById(req.params.id);
 
    if (exercise) {
       await exercise.remove();
       res.json({ message: "Exercise removed" });
    } else {
       res.status(404);
       throw new Error("Exercise not found");
    }
 });

// @desc    Get exercise by ID
// @route   GET /api/exercises/:id
// @access  Private
 const getExercise = asyncHandler(async (req, res) => {
    const exercise = await Exercise.findById(req.params.id);
 
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
     } else {
        res.status(404);
        throw new Error("Exercise not found");
     }
 });

 // @desc    Update exercise
 // @route   PUT /api/exercises/:id
 // @access  Private
const updateExercise = asyncHandler(async (req, res) => {
   const {
      _id,
      name,
      sportType,
      calories,
      duration,
      distance,
      userId
   } = req.body;

   const exercise = await Exercise.findById(_id);

   if (exercise) {
      exercise._id = _id;
      exercise.name = name;
      exercise.sportType = sportType;
      exercise.calories = calories;
      exercise.duration = duration;
      exercise.distance = distance;
      exercise.userId = userId;

      const updatedExercise = await exercise.save();
      res.json(updatedExercise);

      console.log(updatedExercise);
   } else {
      res.status(404);
      throw new Error("exercise not found");
   }
});

// @desc    Get top latest exercises
// @route   GET /api/exercises/
// @access  Public
const getTopExercises = asyncHandler(async (req:IUserRequest, res: Response) => {

   let exercises: any ;
   if(req.user)
      exercises = await Exercise.find({"userId": req.user._id}).sort({createdAt: -1}).limit(3);
 
   res.json(exercises)
 })

 export {createExercise, getExercises, deleteExercise, getExercise, updateExercise,getTopExercises};