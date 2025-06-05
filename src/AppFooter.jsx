import React, { useContext } from "react";

import "./AppFooter.css";

import { WeatherContext } from "./context/WeatherContext";

function AppFooter() {
  const { darkMode } = useContext(WeatherContext);

  return (
    <footer className={`app-footer ${darkMode ? "dark-mode" : "light-mode"}`}>
      <p>© Jim Kennedy 2025</p>
      <a
        href="https://developer-jim-kennedy.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
      >
        My Portfolio
      </a>
    </footer>
  );
}

export default AppFooter;
