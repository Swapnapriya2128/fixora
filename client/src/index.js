import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ProjectProvider } from "./context/ProjectContext";  // ✅ here

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <ProjectProvider>
      <App />
    </ProjectProvider>
  </BrowserRouter>
);