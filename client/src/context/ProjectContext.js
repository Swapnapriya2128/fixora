import { createContext, useState, useEffect } from "react";

export const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  // ✅ Load from localStorage first time
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem("fixora-projects");
    return saved ? JSON.parse(saved) : [];
  });

  // ✅ Save whenever projects change
  useEffect(() => {
    localStorage.setItem("fixora-projects", JSON.stringify(projects));
  }, [projects]);

  return (
    <ProjectContext.Provider value={{ projects, setProjects }}>
      {children}
    </ProjectContext.Provider>
  );
};