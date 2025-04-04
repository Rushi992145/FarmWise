import Expert from "../models/expert.model.js";

// Create a new expert
export const createExpert = async (req, res) => {
    try {
        // Destructure the required fields from req.body
        const {
            specialization,
            experience,
            city,
            country,
            about,
            userId    // Changed from user to userId
        } = req.body;

        // Get the local paths of uploaded files
        const degreeDocumentLocalPath = req.files?.degreeOrCirtification?.[0]?.path;
        const proofDocumentLocalPath = req.files?.proofDocument?.[0]?.path;

        // Upload both documents to Cloudinary
        const degreeDocument = await uploadOnCloudinary(degreeDocumentLocalPath);
        const proofDocument = await uploadOnCloudinary(proofDocumentLocalPath);

        if (!degreeDocument || !proofDocument) {
            return res.status(400).json({
                success: false,
                message: "Document upload failed"
            });
        }

        // Create expert object with uploaded document URLs
        const expert = await Expert.create({
            specialization,
            degreeOrCirtification: degreeDocument.url,
            proofDocument: proofDocument.url,
            experience,
            city,
            country,
            about,
            userId    // Changed from user to userId
        });

        res.status(201).json({
            success: true,
            message: "Expert created successfully",
            data: expert
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get all experts
export const getAllExperts = async (req, res) => {
    try {
        const experts = await Expert.find();
        res.status(200).json({
            success: true,
            data: experts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get expert by ID
export const getExpertById = async (req, res) => {
    try {
        const expert = await Expert.findById(req.params.id);
        if (!expert) {
            return res.status(404).json({
                success: false,
                message: "Expert not found"
            });
        }
        res.status(200).json({
            success: true,
            data: expert
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update expert
export const updateExpert = async (req, res) => {
    try {
        const expert = await Expert.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!expert) {
            return res.status(404).json({
                success: false,
                message: "Expert not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Expert updated successfully",
            data: expert
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Delete expert
export const deleteExpert = async (req, res) => {
    try {
        const expert = await Expert.findByIdAndDelete(req.params.id);
        if (!expert) {
            return res.status(404).json({
                success: false,
                message: "Expert not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Expert deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Verify expert
export const verifyExpert = async (req, res) => {
    try {
        const expert = await Expert.findByIdAndUpdate(
            req.params.id,
            { verified: true },
            { new: true }
        );
        if (!expert) {
            return res.status(404).json({
                success: false,
                message: "Expert not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Expert verified successfully",
            data: expert
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
