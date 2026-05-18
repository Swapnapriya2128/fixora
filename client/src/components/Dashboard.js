import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";


export default function Dashboard({ searchTerm }) {
  const [bugs, setBugs] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [showModal, setShowModal] = useState(false);
  const [selectedBug, setSelectedBug] = useState(null);

  const [errors, setErrors] = useState({});

  const filteredBugs = bugs.filter((bug) => {
  const term = searchTerm.toLowerCase();

  return (
    bug.title?.toLowerCase().includes(term) ||
    bug.module?.toLowerCase().includes(term) ||
    bug.assignee?.toLowerCase().includes(term)
  );
});

  const [form, setForm] = useState({
  title: "",
  description: "",
  module: "",
  reporter: "",
  assignee: "Unassigned",
  priority: "Medium",
  status: "OPEN",
  files: []
});

  useEffect(() => {
    fetchBugs();
  }, []);

  const fetchBugs = async () => {
    const res = await axios.get("http://localhost:5000/bugs");
    setBugs(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFiles = (e) => {
    setForm({ ...form, files: Array.from(e.target.files) });
  };

  const validate = () => {
    let newErrors = {};
    if (!form.title) newErrors.title = "Bug title is required";
    if (!form.description) newErrors.description = "Description is required";
    if (!form.module) newErrors.module = "Module is required";
    if (!form.reporter) newErrors.reporter = "Reporter name is required";
    if (!form.priority) newErrors.priority = "Priority is required";
    if (!form.status) newErrors.status = "Status is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const data = new FormData();
    Object.keys(form).forEach(key => {
      if (key === "files") {
        form.files.forEach(file => data.append("files", file));
      } else {
        data.append(key, form[key]);
      }
    });

    await axios.post("http://localhost:5000/bugs", data);

    alert("Bug Reported Successfully!");
    setShowModal(false);
    fetchBugs();
  };

  const finalBugs = bugs
  .filter((b) => {
    if (filter === "ALL") return true;
    if (filter === "CRITICAL") return b.priority === "Critical";
    return b.status === filter;
  })
  .filter((bug) => {
    const term = searchTerm.toLowerCase();
    return (
      bug.title?.toLowerCase().includes(term) ||
      bug.module?.toLowerCase().includes(term) ||
      bug.assignee?.toLowerCase().includes(term)
    );
  });

  return (
    <div>
      

      <div className="layout">
        {/* 🔷 SIDEBAR */}
        <div className="sidebar">
          <div className="nav-title">Navigation</div>
          <div className="nav-item active">📊 <span>Dashboard</span></div>
          <div className="nav-item">🐞 <span>All Bugs</span></div>
          <div className="nav-item">📝 <span>My Reports</span></div>
          <div className="nav-item">👨‍💻 <span>Dev Team</span></div>
          <div className="nav-title">Activity</div>
          <div className="nav-item">🔔 <span>Notifications</span></div>

          <div className="sidebar-bottom">
            <div className="nav-item settings">⚙️ <span>Settings</span></div>
            <div className="nav-item help">❓ <span>Help</span></div>
          </div>
        </div>

        {/* 🔷 MAIN */}
        <div className="main">
          <div className="title-row">
            <h2>Dashboard</h2>
            <button className="add-btn" onClick={() => setShowModal(true)}>
              + Add Report
            </button>
          </div>

          {/* ✅ MODAL */}
          {showModal && (
            <div className="modal-overlay">
              <div className="modal">
                <div className="modal-header">
                  <h3>Report New Bug</h3>
                  <span className="close" onClick={() => setShowModal(false)}>×</span>
                </div>

                <div className="modal-body">
                  <label>Bug Title *</label>
                  <input name="title" onChange={handleChange} />
                  {errors.title && <span className="error">{errors.title}</span>}

                  <label>Description *</label>
                  <textarea name="description" onChange={handleChange} />
                  {errors.description && <span className="error">{errors.description}</span>}

                  <label>Module / Component *</label>
                  <input name="module" onChange={handleChange} />
                  {errors.module && <span className="error">{errors.module}</span>}

                  <label>Reporter Name *</label>
                  <input name="reporter" onChange={handleChange} />
                  {errors.reporter && <span className="error">{errors.reporter}</span>}

                  <label>Assign To</label>
                  <select name="assignee" onChange={handleChange}>
                    <option>Unassigned</option>
                    <option>Dev1</option>
                    <option>Dev2</option>
                  </select>

                  <label>Priority *</label>
                  <select name="priority" onChange={handleChange}>
                    <option>Medium</option>
                    <option>Low</option>
                    <option>High</option>
                    <option>Critical</option>
                  </select>

                  <label>Status *</label>
                  <select name="status" onChange={handleChange}>
                    <option value="OPEN">Open</option>
                    <option value="CLOSED">Closed</option>
                    <option value="REOPEN">Reopen</option>
                    <option value="IN DEVELOPMENT">In Development</option>
                    <option value="RE-TEST">Re-Test</option>
                    <option value="NOT A BUG">Not a Bug</option>
                    <option value="CANNOT BE FIXED">Cannot be Fixed</option>
                  </select>

                  <label>Screenshots / Files (optional)</label>
                  <input
                    type="file"
                    multiple
                    accept=".png,.jpg,.jpeg,.gif,.doc,.docx,.xls,.xlsx,.pdf"
                    onChange={handleFiles}
                  />
                </div>

                <div className="modal-footer">
                  <button onClick={() => setShowModal(false)}>Cancel</button>
                  <button className="submit-btn" onClick={handleSubmit}>
                    Submit 
                  </button>

                  
                </div>
              </div>
            </div>
          )}

          {/* Cards */}
          <div className="cards">
            <Card title="Total Bugs" count={bugs.length} onClick={() => setFilter("ALL")} />
            <Card title="Open" count={bugs.filter(b => b.status === "OPEN").length} onClick={() => setFilter("OPEN")} />
            <Card title="In Progress" count={bugs.filter(b => b.status === "IN PROGRESS").length} onClick={() => setFilter("IN PROGRESS")} />
            <Card title="Critical" count={bugs.filter(b => b.priority === "Critical").length} onClick={() => setFilter("CRITICAL")} />
            <Card title="Resolved" count={bugs.filter(b => b.status === "RESOLVED").length} onClick={() => setFilter("RESOLVED")} />
          </div>

          {/* Table */}
<table>
  <thead>
    <tr>
      <th>Bug ID</th>
      <th>Bug Title</th>
      <th>Severity</th>
      <th>Status</th>
      <th>Assignee</th>
    </tr>
  </thead>

  <tbody>
    {finalBugs.map((bug) => (
      <tr
        key={bug._id}
        onClick={() => setSelectedBug(bug)}
        className="click-row"
      >
        <td>{bug.bugId}</td>
        <td>{bug.title}</td>
        <td>
          <span className={`badge severity-${bug.priority}`}>
            {bug.priority}
          </span>
        </td>
        <td>
          <span className={`badge status-${bug.status.replace(/\s/g, "")}`}>
            {bug.status}
          </span>
        </td>
        <td>{bug.assignee || "Unassigned"}</td>
      </tr>
    ))}
  </tbody>
</table>
        </div>
      </div>
    </div>
  );
}

function Card({ title, count, onClick }) {
  return (
    <div className="card" onClick={onClick}>
      <h3>{title}</h3>
      <p>{count}</p>
    </div>
  );
}
