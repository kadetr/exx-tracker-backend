import { Request } from "express";
import {Types, Document} from "mongoose";

export interface IUser extends Document {
    _id: Types.ObjectId,
    name: string;
    password: string,
    email: string;
    isAdmin: boolean;
 }
 
 export interface IUserDoc extends IUser {
    matchPassword(password: string): string
 }

 export interface IExercise extends Document {
    name?: string;
    sportType: string,
    exerciseDate: Date,
    calories: string;
    sets?: number;
    duration: string;
    distance: string;
    userId: string;
 }

 export interface IUserRequest extends Request{
    user?: IUserDoc;
 }
 