import React from "react";
import { useTheme } from "../context/ThemeContext";

const themes = [
  { value: "light", label: "🌞 Light" },
  { value: "dark", label: "🌙 Dark" },
  { value: "system", label: "🖥️ System" }
];

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex gap-2 items-center">
      {themes.map((t) => (
        <button
          key={t.value}
          onClick={() => setTheme(t.value)}
          className={`px-3 py-1 rounded ${
            theme === t.value
              ? "bg-primary text-white font-bold"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
};

export default ThemeToggle;
