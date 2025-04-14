import { Expert } from "../models/expert.model.js";
import {User} from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
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

      console.log(req.file);
      if (req.file) {
        const uploadedDoc = await uploadOnCloudinary(req.file.path);
        doc = {
          public_id: uploadedDoc.public_id,
          url: uploadedDoc.secure_url,
        };
      }
  
      const expert = await Expert.create({
        specialization,
        degreeOrCirtification,
        proofDocument:doc?.url,
        experience,
        city,
        country,
        about,
        userId: req.params.id, // make sure this is populated before
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
        const experts = await Expert.find({ verified: true }).populate("userId");

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
          const expert = await Expert.findOne({userId:req.params.id}).populate({
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

