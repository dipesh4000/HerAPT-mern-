import React from "react";
import PropTypes from "prop-types";

const MentorMatch = ({ matches }) => {
  if (!matches || matches.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Mentor Matches</h3>
        <p className="text-gray-600">No mentors available yet. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Your Mentor Matches</h3>
      <div className="grid md:grid-cols-2 gap-6">
        {matches.map((match) => (
          <div
            key={match.mentor_id || match.mentor_name} // Prefer unique mentor_id if available
            className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xl">
                  {match.mentor_name?.charAt(0) || "M"}
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold text-gray-800">
                    {match.mentor_name || "Mentor"}
                  </h4>
                  <p className="text-sm text-gray-500">
                    Compatibility: {match.score}%
                  </p>
                </div>
              </div>
              <div className="bg-accent text-white px-3 py-1 rounded-full text-sm font-semibold">
                {match.score}% Match
              </div>
            </div>

            {match.expertise && match.expertise.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">Expertise:</p>
                <div className="flex flex-wrap gap-2">
                  {match.expertise.map((exp) => (
                    <span
                      key={exp}
                      className="bg-teal-100 text-accent px-3 py-1 rounded-full text-sm"
                    >
                      {exp}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {match.bio && (
              <p className="text-sm text-gray-600 mb-4">
                {match.bio.substring(0, 150)}
                {match.bio.length > 150 ? "..." : ""}
              </p>
            )}

            <button
              type="button"
              className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-primary-dark transition"
              aria-label={`Connect with ${match.mentor_name || "mentor"}`}
            >
              Connect
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Prop types for runtime validation
MentorMatch.propTypes = {
  matches: PropTypes.arrayOf(
    PropTypes.shape({
      mentor_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      mentor_name: PropTypes.string,
      score: PropTypes.number,
      bio: PropTypes.string,
      expertise: PropTypes.arrayOf(PropTypes.string),
    })
  ),
};

MentorMatch.defaultProps = {
  matches: [],
};

export default MentorMatch;
