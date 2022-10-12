import express from "express";
const router = express.Router();
import { protect, admin } from "../middleware/authMiddleware";

import {
   createExercise,
   getExercises,
   deleteExercise,
   getExercise,
   updateExercise,
   getTopExercises,
} from "../controllers/exerciseController";

router
   .route("/")
   .post(protect, createExercise)
   .get(protect, getTopExercises)
router.route("/:id")
    .delete(deleteExercise)
    .get(getExercise)
    .put(updateExercise);
router.route("/history/page")
    .get(protect, getExercises);

export default router;
