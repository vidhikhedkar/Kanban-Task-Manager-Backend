import express from "express";

import {
    registerUser,
    loginUser,
    logoutUser,
    getProfile,
    changePassword
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/logout", logoutUser);

router.get("/profile", protect, getProfile);

router.put("/change-password", protect, changePassword); 

export default router;