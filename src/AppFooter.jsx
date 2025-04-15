import React from "react";

import "./AppFooter.css";

function AppFooter({ darkMode }) {
  return (
    <footer className={`app-footer ${darkMode ? "dark-mode" : "light-mode"}`}>
      <p>© Jim Kennedy 2025</p>
      <a
        href="https://jimkennedy.netlify.app/"
        target="_blank"
        rel="noopener noreferrer"
      >
        My Portfolio
      </a>
    </footer>
  );
}

export default AppFooter;
