import React, { useState } from "react";

const faqData = [
  {
    question: "How do I register as a mentor or mentee?",
    answer:
      "Click on 'Register', fill in your details, and select either 'Mentor' if you want to guide others, or 'Mentee' if you’re seeking guidance.",
  },
  {
    question: "How do I update my profile or interests?",
    answer:
      "Navigate to your dashboard and click 'Edit Profile' at the top-right. Complete your fields and save your progress.",
  },
  {
    question: "How are mentor-mentee matches made?",
    answer:
      "Our system analyzes your skills, interests, and goals and matches you with the best possible mentors/mentees.",
  },
  {
    question: "Can I book sessions directly in the app?",
    answer:
      "If you find a suitable mentor, click 'Connect' to send them a message or set up a meeting.",
  },
  {
    question: "Who can I contact for support?",
    answer:
      "Reach out via the 'Contact Support' link at the bottom of this FAQ, or email support@heraapt.com.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-8 my-8">
      <h2 className="text-3xl font-bold text-primary mb-6">FAQ & Help Center</h2>
      <p className="text-gray-600 mb-4">Onboarding, troubleshooting, and best practices.</p>
      <div>
        {faqData.map((item, idx) => (
          <div key={idx} className="mb-4 border-b border-pink-100 pb-4">
            <button
              onClick={() => handleToggle(idx)}
              className="w-full text-left font-semibold text-lg text-pink-600 hover:text-primary-dark transition flex justify-between items-center"
            >
              {item.question}
              <span className="ml-2 text-xl">{openIndex === idx ? "–" : "+"}</span>
            </button>
            {openIndex === idx && (
              <div className="mt-2 text-gray-700 text-base">{item.answer}</div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-6 text-sm text-right">
        <a
          href="mailto:support@heraapt.com"
          className="text-accent hover:text-primary underline"
        >
          Contact Support
        </a>
      </div>
    </div>
  );
}
