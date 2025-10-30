import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "../utils/api";
import { useAuth } from "../context/AuthContext";

const ProfileForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    education: "",
    experience: "",
    currentRole: "",
    skills: "",
    interests: "",
    careerGoals: "",
    careerBreakYears: 0,
    bio: "",
    expertise: "",
    availability: "",
  });

  // Safety: if user not loaded yet, don't render form
  if (!user) {
    return <p>Loading profile...</p>;
  }

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value, 10) || 0 : value,
    }));
  };

  // Normalize comma or space separated inputs
  const normalizeInput = (val) =>
    val
      .split(/[, ]+/)
      .map((s) => s.trim())
      .filter(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const profileData = {
        profile: {
          ...formData,
          skills: normalizeInput(formData.skills),
          interests: normalizeInput(formData.interests),
          expertise:
            user.role === "mentor" && formData.expertise
              ? normalizeInput(formData.expertise)
              : undefined,
          careerBreakYears: parseInt(formData.careerBreakYears, 10) || 0,
        },
      };

      await updateProfile(profileData);

      // SPA navigation instead of full reload
      navigate("/dashboard");
    } catch (error) {
      console.error("Profile update error:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Complete Your Profile
        </h2>
        <p className="text-gray-600 mb-8">
          Tell us about yourself to get personalized recommendations
        </p>

        <form onSubmit={handleSubmit} className="space-y-6" autoComplete="on">
          {/* Education & Experience */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-2">
                Education Background
              </label>
              <input
                id="education"
                type="text"
                name="education"
                value={formData.education}
                onChange={handleChange}
                required
                placeholder="e.g., Computer Science, MBA"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                Years of Experience
              </label>
              <input
                id="experience"
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                required
                placeholder="e.g., 3 years, Entry Level"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Current Role */}
          <div>
            <label htmlFor="currentRole" className="block text-sm font-medium text-gray-700 mb-2">
              Current/Most Recent Role
            </label>
            <input
              id="currentRole"
              type="text"
              name="currentRole"
              value={formData.currentRole}
              onChange={handleChange}
              placeholder="e.g., Software Developer, Student"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Skills & Interests */}
          <div>
            <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-2">
              Skills (comma or space separated)
            </label>
            <input
              id="skills"
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              required
              placeholder="e.g., Python JavaScript Communication"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label htmlFor="interests" className="block text-sm font-medium text-gray-700 mb-2">
              Interests (comma or space separated)
            </label>
            <input
              id="interests"
              type="text"
              name="interests"
              value={formData.interests}
              onChange={handleChange}
              required
              placeholder="e.g., AI Design Leadership"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Mentee Fields */}
          {user.role === "mentee" && (
            <>
              <div>
                <label htmlFor="careerGoals" className="block text-sm font-medium text-gray-700 mb-2">
                  Career Goals
                </label>
                <textarea
                  id="careerGoals"
                  name="careerGoals"
                  value={formData.careerGoals}
                  onChange={handleChange}
                  required
                  rows="4"
                  placeholder="What are your career aspirations?"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label htmlFor="careerBreakYears" className="block text-sm font-medium text-gray-700 mb-2">
                  Career Break (years)
                </label>
                <input
                  id="careerBreakYears"
                  type="number"
                  name="careerBreakYears"
                  value={formData.careerBreakYears}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary"
                />
              </div>
            </>
          )}

          {/* Mentor Fields */}
          {user.role === "mentor" && (
            <>
              <div>
                <label htmlFor="expertise" className="block text-sm font-medium text-gray-700 mb-2">
                  Areas of Expertise (comma or space separated)
                </label>
                <input
                  id="expertise"
                  type="text"
                  name="expertise"
                  value={formData.expertise}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Product Management UX Design"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  required
                  rows="4"
                  placeholder="Tell mentees about your experience and how you can help..."
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-2">
                  Availability
                </label>
                <input
                  id="availability"
                  type="text"
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  placeholder="e.g., Weekends 2 hours/week"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-primary text-white py-3 rounded-lg font-semibold transition ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:bg-primary-dark"
            }`}
            aria-busy={loading}
          >
            {loading ? "Saving..." : "Save Profile & Continue"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;
