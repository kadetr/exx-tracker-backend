"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const authMiddleware_1 = require("../middleware/authMiddleware");
const exerciseController_1 = require("../controllers/exerciseController");
router
    .route("/")
    .post(authMiddleware_1.protect, exerciseController_1.createExercise)
    .get(authMiddleware_1.protect, exerciseController_1.getTopExercises);
router.route("/:id")
    .delete(exerciseController_1.deleteExercise)
    .get(exerciseController_1.getExercise)
    .put(exerciseController_1.updateExercise);
router.route("/history/page")
    .get(authMiddleware_1.protect, exerciseController_1.getExercises);
exports.default = router;
