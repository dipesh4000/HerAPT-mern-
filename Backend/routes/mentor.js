const express = require("express");
const axios = require("axios");
const { protect } = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

// ===============================
// ===============================
// @route   POST /api/mentor/match
// @desc    Find mentor matches via ML service
// @access  Private (MENTEE ONLY)
// ===============================
router.post("/match", protect, async (req, res) => {
  try {
    const mentee = await User.findById(req.user._id);

    if (!mentee) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 🚩 Only mentees can request mentor matches
    if (mentee.role !== "mentee") {
      return res.status(403).json({
        success: false,
        message: "Only mentees can request mentor matches.",
      });
    }

    // Fetch all mentors
    const mentors = await User.find({ role: "mentor" }).select("-password");

    if (!mentors || mentors.length === 0) {
      return res.json({
        success: true,
        matches: [],
        message: "No mentors available yet",
      });
    }

    // Call ML service for mentor matching
    const mlResponse = await axios.post(
      `${process.env.ML_SERVICE_URL}/match-mentor`,
      {
        mentee: {
          skills: mentee.profile?.skills || [],
          interests: mentee.profile?.interests || [],
          careerGoals: mentee.profile?.careerGoals || "",
        },
        mentors: mentors.map((m) => ({
          id: m._id,
          name: m.name,
          expertise: m.profile?.expertise || [],
          bio: m.profile?.bio || "",
          experience: m.profile?.experience || "",
        })),
      }
    );

    const matches = mlResponse.data.matches || [];

    // Save top 5 matches to user profile
    mentee.mentorMatches = matches.slice(0, 5).map((match) => ({
      mentorId: match.mentor_id,
      compatibilityScore: match.score,
    }));

    await mentee.save();

    return res.json({
      success: true,
      matches,
    });
  } catch (error) {
    console.error("Mentor matching error:", error.message);

    // Handle ML service error response
    if (error.response) {
      return res.status(error.response.status || 500).json({
        success: false,
        message: "Error from ML service",
        error: error.response.data || error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error finding mentor matches",
      error: error.message,
    });
  }
});
// ===============================
// @route   GET /api/mentor/list
// @desc    Get all mentors
// @access  Private
// ===============================
router.get("/list", protect, async (req, res) => {
  try {
    const mentors = await User.find({ role: "mentor" }).select("-password");
    return res.json({
      success: true,
      mentors,
    });
  } catch (error) {
    console.error("Error fetching mentors:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// ===============================
// @route   GET /api/mentor/matches
// @desc    Get saved mentor matches for the current user (mentee)
// @access  Private
// ===============================
router.get("/matches", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("mentorMatches.mentorId");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      matches: user.mentorMatches || [],
    });
  } catch (error) {
    console.error("Error fetching matches:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// ===============================
// @route   GET /api/mentor/mentees
// @desc    Get mentees matched to the current mentor
// @access  Private
// ===============================
router.get("/mentees", protect, async (req, res) => {
  try {
    const mentees = await User.find({
      "mentorMatches.mentorId": req.user._id,
      role: "mentee"
    }).select("-password");

    res.json({
      success: true,
      mentees,
    });
  } catch (error) {
    console.error("Error fetching mentees:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// ===============================
// @route   GET /api/mentor/requests
// @desc    Get session requests for mentor (stub/demo)
// @access  Private
// ===============================
router.get("/requests", protect, async (req, res) => {
  res.json({
    success: true,
    requests: [
      {
        id: 1,
        from: "Pooja",
        type: "Session Request",
        time: "2m ago",
        desc: "Requested a meeting about resume review."
      }
    ]
  });
});

module.exports = router;
