import { Request, Response } from 'express';
import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken";
import User from "../models/userModel";
import { IUserRequest } from '../types/custom';

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
 
    const userExists = await User.findOne({ email });
 
    if (userExists) {
       res.status(400);
       throw new Error("User already exists");
    }
 
    const user = await User.create({
       name,
       email,
       password,
    });
 
    if (user) {
       res.status(201).json({
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user._id.toString()),
       });
    } else {
       res.status(400);
       throw new Error("Invalid user data");
    }
 });


 // @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
 const authUser = asyncHandler(async (req: Request, res: Response) => {
   const { email, password } = req.body;

   const user = await User.findOne({ email });

   if (user && (user.matchPassword(password))) {
       res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user._id.toString()),
       });
    } else {
       res.status(401);
       throw new Error("Invalid email or password");
    }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req: IUserRequest, res: Response) => {
   let user;
   if(req.user) { user = await User.findById(req.user._id);}

   if (user) {
      res.json({
         _id: user._id,
         name: user.name,
         email: user.email,
         isAdmin: user.isAdmin,
      });
   } else {
      res.status(404);
      throw new Error("User not found");
   }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req: IUserRequest, res: Response) => {
   let user;
   if(req.user) { user = await User.findById(req.user._id);}

   if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.isAdmin = req.body.isAdmin || user.isAdmin;
      if (req.body.password) {
         user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
         _id: updatedUser._id,
         name: updatedUser.name,
         email: updatedUser.email,
         isAdmin: updatedUser.isAdmin,
         token: generateToken(updatedUser._id.toString()),
      });
   } else {
      res.status(404);
      throw new Error("User not found");
   }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsersAdmin = asyncHandler(async (req: Request, res: Response) => {
   const users = await User.find({});
   res.json(users);
});

// @desc    Delete user
 // @route   DELETE /api/users/:id
 // @access  Private/Admin
 const deleteUserAdmin = asyncHandler(async (req: Request, res: Response) => {
   const user = await User.findById(req.params.id);

   if (user) {
      await user.remove();
      res.json({ message: "User removed" });
   } else {
      res.status(404);
      throw new Error("User not found");
   }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserAdmin = asyncHandler(async (req: Request, res: Response) => {
   const user = await User.findById(req.params.id).select("-password");

   if (user) {
      res.json(user);
   } else {
      res.status(404);
      throw new Error("User not found");
   }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUserAdmin = asyncHandler(async (req: Request, res: Response) => {
   const user = await User.findById(req.params.id);

   if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.isAdmin = req.body.isAdmin;

      const updatedUser = await user.save();

      res.json({
         _id: updatedUser._id,
         name: updatedUser.name,
         email: updatedUser.email,
         isAdmin: updatedUser.isAdmin
      });
   } else {
      res.status(404);
      throw new Error("User not found");
   }
});

 export {registerUser, authUser, getUserProfile, updateUserProfile, getUsersAdmin, deleteUserAdmin, getUserAdmin, updateUserAdmin};