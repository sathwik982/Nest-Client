// components/ThemeToggle.tsx
"use client";

import { useState, useEffect } from "react";
// Assuming you have lucide-react or similar icons library installed
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  // State to track the current theme
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false); // To prevent Hydration Mismatch

  // 1. On Mount: Check local storage and system preference
  useEffect(() => {
    setMounted(true);
    const storedTheme = localStorage.getItem("theme");
    const systemDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    let initialTheme = "light";

    if (storedTheme) {
      initialTheme = storedTheme;
    } else if (systemDark) {
      initialTheme = "dark";
    }

    setTheme(initialTheme);
    document.documentElement.classList.add(initialTheme);
    document.documentElement.classList.remove(
      initialTheme === "light" ? "dark" : "light"
    );
  }, []);

  // 2. Handler to switch the theme
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";

    // Update state and local storage
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    // Apply the class to the global HTML tag
    document.documentElement.classList.remove(theme);
    document.documentElement.classList.add(newTheme);
  };

  if (!mounted) {
    return <div className="w-10 h-10" />; // Render placeholder during mounting
  }

  // 3. Render the button
  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle Dark Mode"
      className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
    >
      {theme === "dark" ? (
        <Sun className="h-6 w-6 text-yellow-400" />
      ) : (
        <Moon className="h-6 w-6 text-gray-500" />
      )}
    </button>
  );
}
