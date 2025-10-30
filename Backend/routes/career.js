const express = require("express");
const axios = require("axios");
const { protect } = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

// ===============================
// @route   POST /api/career/recommend
// @desc    Get AI career recommendations from ML service
// @access  Private
// ===============================
router.post("/recommend", protect, async (req, res) => {
  try {
    const { education, experience, skills, interests, careerGoals } = req.body;

    if (!education && !skills && !interests) {
      return res.status(400).json({
        success: false,
        message: "Please provide relevant profile details for recommendations",
      });
    }

    // Call ML service
    const mlResponse = await axios.post(
      `${process.env.ML_SERVICE_URL}/predict-career`,
      { education, experience, skills, interests, careerGoals }
    );

    const recommendations = mlResponse.data.predictions;

    // Validate user exists
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Option A — Overwrite previous recommendations:
    user.careerRecommendations = recommendations.map((rec) => ({
      careerPath: rec.career,
      confidence: rec.confidence,
      skills: rec.required_skills,
    }));

    // Option B — Append instead of overwrite:
    // user.careerRecommendations.push(
    //   ...recommendations.map((rec) => ({
    //     careerPath: rec.career,
    //     confidence: rec.confidence,
    //     skills: rec.required_skills,
    //   }))
    // );

    await user.save();

    return res.json({
      success: true,
      recommendations: user.careerRecommendations,
    });
  } catch (error) {
    console.error("Career recommendation error:", error.message);

    // Check if ML service returned an error response
    if (error.response) {
      return res.status(error.response.status || 500).json({
        success: false,
        message: "ML service error",
        error: error.response.data || error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error getting career recommendations",
      error: error.message,
    });
  }
});

// ===============================
// @route   GET /api/career/recommendations
// @desc    Get saved career recommendations for current user
// @access  Private
// ===============================
router.get("/recommendations", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      recommendations: user.careerRecommendations || [],
    });
  } catch (error) {
    console.error("Get recommendations error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

module.exports = router;
