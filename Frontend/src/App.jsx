import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Login from "./components/Login";
import Register from "./components/Register";
import ProfileForm from "./components/ProfileForm";
import Dashboard from "./components/Dashboard";
import MentorDashboard from "./components/MentorDashboard";
import FAQ from "./components/FAQ";

// PrivateRoute for protected routes
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-primary">Loading...</div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Main App
function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Role-based dashboard redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/faq" element={<FAQ />} />

          {/* Private routes */}
          <Route
            path="/profile-setup"
            element={
              <PrivateRoute>
                <ProfileForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/mentor-dashboard"
            element={
              <PrivateRoute>
                <MentorDashboard />
              </PrivateRoute>
            }
          />
          {/* Optional: Add a 404 fallback or landing page */}
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
