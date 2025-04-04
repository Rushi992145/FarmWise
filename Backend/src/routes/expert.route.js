import express from "express";
import {
    createExpert,
    getAllExperts,
    getExpertById,
    updateExpert,
    deleteExpert,
    verifyExpert
} from "../controllers/expert.controller.js";

const router = express.Router();

// Create expert
router.post("/", createExpert);

// Get all experts
router.get("/", getAllExperts);

// Get expert by ID
router.get("/:id", getExpertById);

// Update expert
router.put("/:id", updateExpert);

// Delete expert
router.delete("/:id", deleteExpert);

// Verify expert
router.patch("/:id/verify", verifyExpert);

export default router;
