import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import CareerResults from "./CareerResults";
import MentorMatch from "./MentorMatch";
import ThemeToggle from "./ThemeToggle";
import { getCareerRecommendations, matchMentors } from "../utils/api";

const Dashboard = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [careerData, setCareerData] = useState(null);
  const [mentorData, setMentorData] = useState(null);
  const [activeTab, setActiveTab] = useState("career");

  // 🚩 Role-based redirect and profile completeness check
  useEffect(() => {
    if (!loading && user) {
      if (user.role === "mentor") {
        navigate("/mentor-dashboard", { replace: true });
        return;
      }

      // ✅ Ensure profile exists
      const profile = user.profile || {};

      // Robust completeness check
      const isComplete =
        profile.education?.trim() &&
        profile.experience?.trim() &&
        Array.isArray(profile.skills) &&
        profile.skills.length > 0 &&
        profile.skills.some((skill) => skill.trim() !== "");

      if (!isComplete) {
        navigate("/profile-setup", { replace: true });
      }
    }
  }, [user, loading, navigate]);

  const handleGetRecommendations = async () => {
    setDashboardLoading(true);
    try {
      const response = await getCareerRecommendations({
        education: user?.profile?.education || "",
        experience: user?.profile?.experience || "",
        skills: user?.profile?.skills || [],
        interests: user?.profile?.interests || [],
        careerGoals: user?.profile?.careerGoals || "",
      });
      setCareerData(response.data.recommendations);
      setActiveTab("career");
    } catch (error) {
      console.error("Error getting recommendations:", error);
      alert("Failed to get recommendations. Please try again.");
    } finally {
      setDashboardLoading(false);
    }
  };

  const handleFindMentors = async () => {
    setDashboardLoading(true);
    try {
      const response = await matchMentors();
      setMentorData(response.data.matches);
      setActiveTab("mentors");
    } catch (error) {
      console.error("Error finding mentors:", error);
      alert("Failed to find mentors. Please try again.");
    } finally {
      setDashboardLoading(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blush">
      {/* Header */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary">HerApt</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Hello, {user?.name}</span>
              <button
                type="button"
                onClick={() => navigate("/profile-setup")}
                className="text-primary hover:text-primary-dark"
                disabled={dashboardLoading}
              >
                Edit Profile
              </button>
              <button
                type="button"
                onClick={logout}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark"
                disabled={dashboardLoading}
              >
                Logout
              </button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Welcome to Your Career Dashboard
          </h2>
          <p className="text-gray-600 mb-6">
            Get AI-powered career recommendations and connect with mentors who can guide you.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={handleGetRecommendations}
              disabled={dashboardLoading}
              className={`bg-primary text-white py-4 px-6 rounded-xl font-semibold transition ${
                dashboardLoading && activeTab === "career"
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:bg-primary-dark"
              }`}
            >
              🎯 {dashboardLoading && activeTab === "career"
                ? "Getting Recommendations..."
                : "Get Career Recommendations"}
            </button>
            <button
              type="button"
              onClick={handleFindMentors}
              disabled={dashboardLoading}
              className={`bg-secondary text-white py-4 px-6 rounded-xl font-semibold transition ${
                dashboardLoading && activeTab === "mentors"
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:bg-secondary-dark"
              }`}
            >
              🤝 {dashboardLoading && activeTab === "mentors"
                ? "Finding Mentors..."
                : "Find Mentors"}
            </button>
          </div>
        </div>

        {/* Profile Summary */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Your Profile</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500">Education</p>
              <p className="font-semibold">{user?.profile?.education || "Not set"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Experience</p>
              <p className="font-semibold">{user?.profile?.experience || "Not set"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Skills</p>
              <p className="font-semibold">
                {Array.isArray(user?.profile?.skills) && user.profile.skills.length > 0
                  ? user.profile.skills.join(", ")
                  : "Not set"}
              </p>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {careerData && activeTab === "career" && <CareerResults recommendations={careerData} />}
        {mentorData && activeTab === "mentors" && <MentorMatch matches={mentorData} />}
      </div>
    </div>
  );
};

export default Dashboard;
