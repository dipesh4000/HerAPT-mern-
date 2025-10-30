import React from "react";
import PropTypes from "prop-types";

// Main CareerResults component – displays career recommendations
const CareerResults = ({ recommendations }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">
        Your Career Recommendations
      </h3>

      <div className="space-y-6">
        {/* Defensive rendering: check if recommendations exist and have items */}
        {recommendations.length > 0 ? (
          recommendations.map((rec) => (
            <div
              key={rec.careerPath} // Use unique key if available (careerPath assumed unique)
              className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition"
            >
              {/* Top section: career name and confidence */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-xl font-bold text-gray-800">
                    {rec.careerPath}
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">
                    Match Confidence: {rec.confidence}%
                  </p>
                </div>
                <div className="flex items-center">
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
                    {rec.confidence}%
                  </div>
                </div>
              </div>

              {/* Required skills with badges */}
              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Required Skills:
                </p>
                <div className="flex flex-wrap gap-2">
                  {rec.skills.map((skill) => (
                    <span
                      key={skill} // Use skill string as key for uniqueness
                      className="bg-purple-100 text-primary px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Confidence progress bar */}
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full"
                    style={{ width: `${rec.confidence}%` }}
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          // Fallback if no recommendations
          <p className="text-gray-500">No recommendations found.</p>
        )}
      </div>

      {/* Next steps section */}
      <div className="mt-8 bg-purple-50 border border-purple-200 rounded-xl p-6">
        <h4 className="font-bold text-gray-800 mb-2">Next Steps:</h4>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Explore online courses for your recommended career paths</li>
          <li>Connect with mentors in these fields</li>
          <li>Build a portfolio showcasing relevant skills</li>
          <li>Join communities and attend networking events</li>
        </ul>
      </div>
    </div>
  );
};

// Prop types for runtime validation and developer clarity
CareerResults.propTypes = {
  recommendations: PropTypes.arrayOf(
    PropTypes.shape({
      careerPath: PropTypes.string.isRequired,
      confidence: PropTypes.number.isRequired,
      skills: PropTypes.arrayOf(PropTypes.string).isRequired,
    })
  ),
};

// Default props for robustness
CareerResults.defaultProps = {
  recommendations: [],
};

export default CareerResults;
