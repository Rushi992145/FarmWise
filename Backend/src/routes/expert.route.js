import express from "express";
import {
    getAllExperts,
    getExpertBookings,
    verifyExpert,
    adminVerifyExpert,
    getAllExpertApplications
} from "../controllers/expert.controller.js";
import multer from "multer";
const upload = multer({ dest: "uploads/" }); // temp upload dir

const router = express.Router();

// Public routes
router.get("/", getAllExperts);
router.get("/:id", getExpertBookings);

// Protected routes
router.post("/:id/verify", upload.single("proofDocument"), verifyExpert);

// Make the applications endpoint public so all users can see expert applications
router.get("/applications", getAllExpertApplications);

// But keep the verification action admin-only
router.patch("/:expertId/verify", adminVerifyExpert);

export default router;
