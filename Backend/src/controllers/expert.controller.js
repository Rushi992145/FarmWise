import { Expert } from "../models/expert.model.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
// Get all experts


export const verifyExpert = async (req, res) => {
    try {
      const {
        specialization,
        degreeOrCirtification,
        experience,
        city,
        country,
        about,
      } = req.body;
  
      console.log(specialization, degreeOrCirtification, experience, city, country, about);
      let doc = null;
      let adharPanDoc = null;

      console.log(req.files);
      if (req.files) {
        if (req.files.proofDocument) {
          const uploadedDoc = await uploadOnCloudinary(req.files.proofDocument[0].path);
          doc = {
            public_id: uploadedDoc.public_id,
            url: uploadedDoc.secure_url,
          };
        }
        if (req.files.adharPanDocument) {
          const uploadedAdharPanDoc = await uploadOnCloudinary(req.files.adharPanDocument[0].path);
          adharPanDoc = {
            public_id: uploadedAdharPanDoc.public_id,
            url: uploadedAdharPanDoc.secure_url,
          };
        }
      }
  
      const expert = await Expert.create({
        specialization,
        degreeOrCirtification,
        proofDocument: doc?.url,
        adharPanDocument: adharPanDoc?.url,
        experience,
        city,
        country,
        about,
        userId: req.params.id,
      });
  
      res.status(200).json({
        success: true,
        message: "Expert verified successfully",
        data: expert,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };
  



export const getAllExperts = async (req, res) => {
  try {
    const experts = await Expert.find().populate("userId");

    if (!experts || experts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No experts found"
      });
    }
    // const expertdetails=await User.findById(req.user.id);

    // console.log(expertdetails)
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
export const getExpertBookings = async (req, res) => {
  try {
    const expert = await Expert.findOne({ userId: req.params.id }).populate({
      path: 'bookings',
      populate: {
        path: 'userId',
        model: 'User'
      }
    });
    if (!expert) {
      return res.status(404).json({
        success: false,
        message: "Expert not found"
      });
    }
    res.status(200).json({
      success: true,
      data: expert.bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all expert applications
export const getAllExpertApplications = asyncHandler(async (req, res) => {
  const experts = await Expert.find()
    .populate("userId", "username email")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, experts, "Expert applications fetched successfully"));
});

// Admin verifies an expert
export const adminVerifyExpert = asyncHandler(async (req, res) => {
  const { expertId } = req.params;
  const { status } = req.body;

  if (!["pending", "verified", "rejected"].includes(status)) {
    throw new ApiError(400, "Invalid status value");
  }

  const expert = await Expert.findById(expertId);

  if (!expert) {
    throw new ApiError(404, "Expert application not found");
  }

  expert.verificationStatus = status;
  await expert.save();

  return res
    .status(200)
    .json(new ApiResponse(200, expert, "Expert verification status updated successfully"));
});

