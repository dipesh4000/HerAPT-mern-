import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // If using direct API calls, else use your utils/api

// Example Badges
const BADGES = [
  { label: "Star Mentor", emoji: "🌟", desc: "Rated highly by mentees" },
  { label: "Active Listener", emoji: "👂", desc: "Responded to 10+ requests" },
];

// Example Resources
const MENTOR_RESOURCES = [
  { title: "Effective Mentoring Tips", link: "https://leanin.org/mentoring" },
  { title: "Career Conversation Guides", link: "https://www.themuse.com/advice/mentoring" },
];

const MentorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mentees, setMentees] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🚩 Protect route so only mentors can access
  useEffect(() => {
    if (user && user.role !== "mentor") {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  // Fetch matched mentees and notifications
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch matched mentees
        const menteeRes = await axios.get("/api/mentor/mentees", { withCredentials: true });
        setMentees(menteeRes.data.mentees || []);

        // Fetch mentor requests/notifications (stubbed/demo endpoint)
        const notifyRes = await axios.get("/api/mentor/requests", { withCredentials: true });
        setNotifications(notifyRes.data.requests || []);
      } catch (err) {
        setMentees([]);
        setNotifications([]);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (!user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-primary">Loading mentor dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blush">
      {/* Header */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-primary">HerApt Mentor</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Hello, {user?.name}</span>
              <button
                type="button"
                onClick={() => navigate("/profile-setup")}
                className="text-primary hover:text-primary-dark"
              >
                Edit Profile
              </button>
              <button
                type="button"
                onClick={logout}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Dashboard */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mentor Profile Overview */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome, Mentor!
            </h2>
            <p className="text-gray-600 mb-4">Help women reach their full potential and grow your own leadership brand.</p>
            {/* Badges/achievements */}
            <div className="flex gap-2 mb-2">
              {BADGES.map((b, i) => (
                <span key={i} title={b.desc} className="inline-flex items-center px-2 py-1 border rounded text-xs text-pink-600 bg-pink-50 font-semibold">
                  <span className="mr-1">{b.emoji}</span>{b.label}
                </span>
              ))}
            </div>
          </div>
          {/* Quick profile info */}
          <div className="flex-1 min-w-0">
            <h4 className="text-lg font-semibold text-primary mb-2">Your Profile</h4>
            <ul className="text-gray-700">
              <li><b>Name:</b> {user?.name}</li>
              <li><b>Email:</b> {user?.email}</li>
              <li><b>Expertise:</b> {Array.isArray(user?.profile?.expertise) ? user.profile.expertise.join(", ") : "Not set"}</li>
              <li><b>Bio:</b> {user?.profile?.bio || "Not set"}</li>
              <li><b>Availability:</b> {user?.profile?.availability || "Not set"}</li>
            </ul>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Notifications</h3>
          <ul>
            {notifications.length === 0
              ? <li className="text-gray-600">No notifications.</li>
              : notifications.map((n) => (
                  <li key={n.id} className="flex justify-between border-b last:border-none py-2">
                    <div>
                      <span className="font-semibold text-primary">{n.from}</span> — {n.type}
                      <div className="text-sm text-gray-500">{n.desc}</div>
                    </div>
                    <div className="text-xs text-gray-400">{n.time}</div>
                  </li>
                ))}
          </ul>
        </div>

        {/* Schedule */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Your Schedule</h3>
          <p className="mb-2 text-gray-600">
            Coming soon: Calendar integration & session management.
          </p>
          <div className="px-4 py-2 bg-pink-50 border border-pink-100 rounded text-gray-500">
            You can set your weekly availability and see upcoming sessions here.
          </div>
        </div>

        {/* Matched Mentees Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Your Matched Mentees</h3>
          {mentees.length === 0
            ? <div className="text-gray-600">No mentee matches yet.</div>
            : (
              <div className="grid md:grid-cols-2 gap-4">
                {mentees.map((m, idx) => (
                  <div key={m._id || idx} className="border rounded-xl p-4 bg-blush">
                    <div className="font-semibold text-primary">{m.name}</div>
                    <div className="text-sm text-gray-500 mb-2">{m.profile?.bio || "No bio yet."}</div>
                    <div className="text-xs mb-2"><b>Email:</b> {m.email || "N/A"}</div>
                    <div className="flex gap-2">
                      <button className="bg-primary text-white px-3 py-1 rounded hover:bg-primary-dark text-sm">View Profile</button>
                      <button className="bg-pink-600 text-white px-3 py-1 rounded hover:bg-primary-dark text-sm" onClick={() => setShowChat(true)}>Message</button>
                    </div>
                  </div>
                ))}
              </div>
            )
          }
        </div>

        {/* Simple chat inbox modal (stub logic) */}
        {showChat && (
          <div className="fixed inset-0 z-20 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-8 shadow-2xl w-full max-w-lg relative">
              <button className="absolute top-2 right-4 text-gray-400 text-xl" onClick={() => setShowChat(false)}>×</button>
              <h3 className="text-xl font-bold text-primary mb-2">Inbox (Preview)</h3>
              <div className="bg-pink-50 p-6 rounded border mb-2 text-gray-700">
                Messaging system coming soon.
              </div>
              <input className="w-full border rounded px-3 py-2 mb-2" placeholder="Type a message..." disabled />
              <button className="w-full bg-primary text-white py-2 rounded font-semibold cursor-not-allowed opacity-70">Send</button>
            </div>
          </div>
        )}

        {/* Mentor Resources Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 my-8">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Mentor Resources & Help</h3>
          <ul className="list-disc pl-5">
            {MENTOR_RESOURCES.map((r, i) => (
              <li key={i}>
                <a href={r.link} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary-dark">{r.title}</a>
              </li>
            ))}
            <li>
              <a href="/faq" className="text-primary underline hover:text-primary-dark">FAQ & Help Center</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;
