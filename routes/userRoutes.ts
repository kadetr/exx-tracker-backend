import express from 'express';
import {registerUser, 
    authUser, 
    getUserProfile, 
    updateUserProfile, 
    getUsersAdmin, 
    deleteUserAdmin, 
    getUserAdmin, 
    updateUserAdmin
} from '../controllers/userController';
import { protect, admin } from "../middleware/authMiddleware";
const router = express.Router();

router.route("/").post(registerUser);
router.post("/login", authUser);
router
    .route("/profile")
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);
router
    .route("/admin")
    .get(protect, admin, getUsersAdmin);
router
    .route("/admin/:id")
    .get(getUserAdmin)
    .delete(protect, admin,deleteUserAdmin)
    .put(protect, admin, updateUserAdmin);

export default router;