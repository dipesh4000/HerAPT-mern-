const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    enum: ["mentee", "mentor"],
    default: "mentee",
  },
  profile: {
    education: String,
    experience: String,
    currentRole: String,
    skills: [String],
    interests: [String],
    careerGoals: String,
    careerBreakYears: Number,
    bio: String,
    expertise: [String],
    availability: String, // for mentors
  },
  careerRecommendations: [
    {
      careerPath: String,
      confidence: Number,
      skills: [String],
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  mentorMatches: [
    {
      mentorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      compatibilityScore: Number,
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ===============================
// Hash password before saving
// ===============================
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next(); // ✅ stop here if password not modified
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ===============================
// Compare entered password
// ===============================
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password); // ✅ returns true/false
};

module.exports = mongoose.model("User", UserSchema);
