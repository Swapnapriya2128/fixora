import { useState, useEffect } from "react";
import axios from "axios";

export default function Dashboard({ searchTerm }) {
  const [showModal, setShowModal] = useState(false);
  const [bugs, setBugs] = useState([]);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [form, setForm] = useState({
    project: "[FWA] Fixora Web App",
    title: "",
    description: "",
    module: "",
    severity: "High",
    assignee: "Unassigned",
    reporter: user?.email || "",
    status: "OPEN",
    tcId: "",
    screenshot: null,
  });

  useEffect(() => {
    fetchBugs();
  }, []);

  // ✅ Fetch only my bugs
  const fetchBugs = async () => {
    const res = await axios.get("http://localhost:5000/bugs");

    const myBugs = res.data.filter(
      (bug) => bug.reporter === user?.email
    );

    setBugs(myBugs);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post("http://localhost:5000/bugs", form);

    setShowModal(false);
    fetchBugs();

    // reset
    setForm({
      project: "[FWA] Fixora Web App",
      title: "",
      description: "",
      module: "",
      severity: "High",
      assignee: "Unassigned",
      reporter: user?.email || "",
      status: "OPEN",
      tcId: "",
      screenshot: null,
    });
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/bugs/${id}`);
    fetchBugs();
  };

  return (
    <div>
      {/* Header */}
      <div className="title-row">
        <h2>My Reports</h2>
        <button className="add-btn" onClick={() => setShowModal(true)}>
          + Report Bug
        </button>
      </div>

      {/* Table */}
      <table className="bug-table">
        <thead>
          <tr>
            <th>Bug ID</th>
            <th>Title</th>
            <th>Status</th>
            <th>Severity</th>
            <th>Assignee</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {bugs.map((bug) => (
            <tr key={bug._id}>
              <td>{bug.bugId}</td>
              <td>{bug.title}</td>
              <td>{bug.status}</td>
              <td>{bug.severity}</td>
              <td>{bug.assignee}</td>
              <td>{new Date(bug.createdAt).toLocaleDateString()}</td>
              <td>
                <button onClick={() => handleDelete(bug._id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Report a Bug</h3>
              <span onClick={() => setShowModal(false)}>×</span>
            </div>

            <div className="modal-body">
              <label>Project</label>
              <input value={form.project} disabled />

              <label>Bug Title</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
              />

              <label>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
              />

              <div className="row-2">
                <div>
                  <label>Module</label>
                  <input
                    name="module"
                    value={form.module}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label>Severity</label>
                  <select
                    name="severity"
                    value={form.severity}
                    onChange={handleChange}
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Critical</option>
                  </select>
                </div>
              </div>

              <div className="row-2">
                <div>
                  <label>Assignee</label>
                  <input
                    name="assignee"
                    value={form.assignee}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label>Reporter</label>
                  <input value={form.reporter} disabled />
                </div>
              </div>

              <label>Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option>OPEN</option>
                <option>IN DEVELOPMENT</option>
                <option>CLOSED</option>
              </select>
            </div>

            <div className="modal-footer">
              <button onClick={() => setShowModal(false)}>Cancel</button>
              <button onClick={handleSubmit}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}