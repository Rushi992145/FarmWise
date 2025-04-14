import express from "express";
import {
    getAllExperts,
    getExpertBookings,
    verifyExpert
} from "../controllers/expert.controller.js";
import multer from "multer";
const upload = multer({ dest: "uploads/" }); // temp upload dir


const router = express.Router();

router.get("/", getAllExperts);

router.get("/:id", getExpertBookings);

router.post("/:id/verify", upload.single("proofDocument"), verifyExpert);


export default router;
