import "./Projects.css";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ProjectContext } from "../context/ProjectContext";

export default function Projects() {
  const { projects, setProjects } = useContext(ProjectContext);
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", key: "", description: "" });

  const handleCreate = () => {
    if (!form.name || !form.key) return alert("Fill required fields");

    setProjects([
      ...projects,
      {
        ...form,
        id: Date.now(),
        bugs: [],
        createdAt: new Date().toISOString(),
      },
    ]);

    setShowModal(false);
    setForm({ name: "", key: "", description: "" });
  };

  return (
    <>
      <div className="projects-page">
        <div className="projects-header">
  <div className="projects-title">
    <h2>Projects</h2>
    <p>{projects.length} projects</p>
  </div>

  <button
    className="new-project-btn"
    onClick={() => setShowModal(true)}
  >
    + New Project
  </button>
</div>

        <div className="projects-grid">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="project-card"
              onClick={() => navigate(`/projects/${proj.id}`)}  // ✅ CLICK WORKS
            >
              <button
                className="delete-project-btn"
                onClick={(e) => {
                  e.stopPropagation(); // ✅ prevent navigation
                  setProjects(projects.filter((p) => p.id !== proj.id));
                }}
              >
                🗑
              </button>

              <div className="project-code">{proj.key}</div>

              <div className="project-content">
                <h3>{proj.name}</h3>
                {proj.description && (
                  <p className="project-desc">{proj.description}</p>
                )}

                <div className="project-footer">
                  <span>{proj.bugs.length} bugs</span>
                  <span>
                    {new Date(proj.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="proj-modal-overlay">
          <div className="proj-modal">
            <div className="proj-modal-header">
              <h3>Create Project</h3>
              <span onClick={() => setShowModal(false)}>✕</span>
            </div>

            <div className="proj-modal-body">
              <label>Project Name *</label>
              <input
                placeholder="Project Name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
              <label>Project Key *</label>
              <input
                placeholder="Project Key"
                value={form.key}
                onChange={(e) =>
                  setForm({ ...form, key: e.target.value })
                }
              />
              <label>Description <span>(Optional)</span></label>
              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            <div className="proj-modal-footer">
  <button
    className="cancel-btn"
    onClick={() => setShowModal(false)}
  >
    Cancel
  </button>

  <button
    className="create-btn"
    onClick={handleCreate}
  >
    Create Project
  </button>
</div>
          </div>
        </div>
      )}
    </>
  );
}