import mongoose, {Document, Schema, Types} from "mongoose";
import { IExercise } from "../types/custom";

const exerciseSchema = new Schema<IExercise>(
   {
      name: {
         type: String,
         required: false,
      },
      sportType: {
         type: String
      },
      exerciseDate:{
         type: Date,
      },
      calories:{
         type: String,
      },
      sets: {
         type: Number,
      },
      duration: {
         type: String,
      },
      distance:{
         type: String,
      },
      userId: { 
         type: String,
      },
   },
   {
      timestamps: true,
   }
);

const Exercise = mongoose.model<IExercise>('Exercise', exerciseSchema);

export default Exercise;