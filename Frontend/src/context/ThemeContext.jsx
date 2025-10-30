import React, { createContext, useEffect, useState, useContext } from "react";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

const getSystemTheme = () => window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() =>
    localStorage.getItem("theme") || "system"
  );

  useEffect(() => {
    const root = window.document.documentElement;
    let appliedTheme = theme;
    if (theme === "system") {
      appliedTheme = getSystemTheme();
    }
    root.classList.remove("light", "dark");
    root.classList.add(appliedTheme);
    localStorage.setItem("theme", theme);

    // React to system theme changes in "system" mode
    if (theme === "system") {
      const listener = (e) => {
        root.classList.remove("light", "dark");
        root.classList.add(e.matches ? "dark" : "light");
      };
      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", listener);
      return () => {
        window.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change", listener);
      };
    }
  }, [theme]);

  const toggleTheme = (next) => setTheme(next);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
