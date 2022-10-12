"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.route("/").post(userController_1.registerUser);
router.post("/login", userController_1.authUser);
router
    .route("/profile")
    .get(authMiddleware_1.protect, userController_1.getUserProfile)
    .put(authMiddleware_1.protect, userController_1.updateUserProfile);
router
    .route("/admin")
    .get(authMiddleware_1.protect, authMiddleware_1.admin, userController_1.getUsersAdmin);
router
    .route("/admin/:id")
    .get(authMiddleware_1.protect, authMiddleware_1.admin, userController_1.getUserAdmin)
    .delete(authMiddleware_1.protect, authMiddleware_1.admin, userController_1.deleteUserAdmin)
    .put(authMiddleware_1.protect, authMiddleware_1.admin, userController_1.updateUserAdmin);
exports.default = router;
