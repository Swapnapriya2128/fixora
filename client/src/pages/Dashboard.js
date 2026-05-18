import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ProjectContext } from "../context/ProjectContext";
import api from "../api";




export default function Dashboard({ searchTerm }) {

  
  const [bugs, setBugs] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [showModal, setShowModal] = useState(false);
  const { projects } = useContext(ProjectContext);
  const [selectedBug, setSelectedBug] = useState(null);
const [showBugModal, setShowBugModal] = useState(false);
const [devMembers, setDevMembers] = useState([]);

  const user = JSON.parse(localStorage.getItem("user") || "null");

const [form, setForm] = useState({
  project: "[FWA] Fixora Web App",
  title: "",
  description: "",
  module: "Authentication",
  severity: "High",
  version: "1.0.0",
  reporter: user?.email || "",
  assignee: "Unassigned",
  tcId: "",
  screenshot: null,
  status: "Open",
});


const [testCases, setTestCases] = useState([]);
const selectedProject = projects.find(
  (p) => p.name === form.project
);

const failedTcIds =
  selectedProject?.testCases
    ?.filter((tc) => tc.status === "Fail" && tc.tcId)
    .map((tc) => tc.tcId) || [];
  useEffect(() => {
  fetchBugs();
  fetchDevMembers();
  fetchTestCases();   // ADD THIS
}, []);

const fetchTestCases = async () => {
    const res = await api.get("/testcases");
    setTestCases(res.data);
  };

  const fetchDevMembers = async () => {
    const res = await api.get("/api/devmembers");
    setDevMembers(res.data);
  };
  const fetchBugs = async () => {
    const res = await api.get("/bugs");
    setBugs(res.data);
  };
  
// ✅ FORM CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


 const handleSubmit = async (e) => {

  e.preventDefault();

  try {

    const formData = new FormData();

    formData.append(
      "project",
      form.project
    );

    formData.append(
      "title",
      form.title
    );

    formData.append(
      "description",
      form.description
    );

    formData.append(
      "module",
      form.module
    );

    formData.append(
      "severity",
      form.severity
    );

    formData.append(
      "reporter",
      form.reporter
    );

    formData.append(
      "assignee",
      form.assignee
    );

    formData.append(
      "status",
      form.status
    );

    formData.append(
      "tcId",
      form.tcId
    );

    // screenshot
    if (form.screenshot) {

      formData.append(
        "screenshot",
        form.screenshot
      );
    }

    await api.post("/bugs", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    alert("Bug Added");

    setShowModal(false);

    fetchBugs();

  } catch (err) {

    console.log(err);

  }
};



  const filtered = bugs
  .filter((b) => {
    const status = b.status?.toLowerCase();

    if (filter === "ALL") return true;
    if (filter === "CRITICAL")
      return b.severity?.toLowerCase() === "critical";

    return status === filter.toLowerCase();
  })
  .filter((b) => {
    if (!searchTerm) return true;

    const term = searchTerm.toLowerCase();

    return (
      b.title?.toLowerCase().includes(term) ||
      b.module?.toLowerCase().includes(term) ||
      b.assignee?.toLowerCase().includes(term)
    );
  });



  return (
    <div>
      {/* 🔷 Title Row */}
      <div className="title-row">
        <div>
        <h2>Dashboard</h2>
        <h5>Overview of your bug tracking activity</h5>
        </div>
        <div>
        
        <button className="add-btn" onClick={() => setShowModal(true)}>
          + Report Bug
        </button>
        </div>
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
  <h3>Report a Bug</h3>
  

  {/* Bug ID */}
  <label>Bug ID</label>
  <input value="Auto Generated" disabled />

  {/* Project Dropdown */}
  <label>Select Project</label>
  <select name="project" value={form.project} onChange={handleChange}>
    {projects.map((p) => (
      <option key={p._id} value={p.name}>
        {p.name}
      </option>
    ))}
  </select>

  {/* Title */}
  <label>Bug Title</label>
  <input
    name="title"
    value={form.title}
    onChange={handleChange}
    placeholder="Brief, descriptive title"
  />

  {/* Description */}
  <label>Description</label>
  <textarea
    name="description"
    value={form.description}
    onChange={handleChange}
    placeholder="Steps, expected vs actual result"
  />

  {/* Row: Module | Severity */}
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

  {/* Row: Assignee | Reporter */}
  <div className="row-2">
    <div>
  <label>Assignee</label>
  <select
    name="assignee"
    value={form.assignee}
    onChange={handleChange}
  >
    <option value="Unassigned">Unassigned</option>

    {devMembers.map((dev) => (
      <option key={dev._id} value={dev.name}>
        {dev.name} ({dev.role})
      </option>
    ))}
  </select>
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
  <option>Open</option>
  <option>In Development</option>
  <option>Re-Testing</option>
  <option>Closed</option>
</select>

  {/* TC ID */}
  <select
  name="tcId"
  value={form.tcId}
  onChange={handleChange}
>
              <option value="">Select TC</option>
              {testCases
                .filter((tc) => tc.status === "FAIL")
                .map((tc) => (
                  <option key={tc._id} value={tc.tcId}>
                    {tc.tcId}
                  </option>
                ))}
            </select>

  {/* Screenshot */}
  <label>Upload Screenshot</label>
  <input
    type="file"
    onChange={(e) =>
      setForm({ ...form, screenshot: e.target.files[0] })
    }
  />

  {/* Footer Buttons */}
  <div className="modal-footer">
    <button onClick={() => setShowModal(false)}>Cancel</button>
    <button
  type="button"
  onClick={handleSubmit}
>
  Submit
</button>
  </div>
</div>
</div>
        </div>
      )}

      {/* card */}

      <div className="cards">
  <Card
    type="total"
    title="TOTAL BUGS"
    count={bugs.length}
    onClick={() => setFilter("ALL")}
  />

  <Card
  type="open"
  title="OPEN"
  count={bugs.filter(b => b.status?.toLowerCase() === "open").length}
  onClick={() => setFilter("Open")}
/>

<Card
  type="progress"
  title="IN PROGRESS"
  count={bugs.filter(b => b.status?.toLowerCase() === "in development").length}
  onClick={() => setFilter("In Development")}
/>

<Card
  type="resolved"
  title="RESOLVED"
  count={bugs.filter(b => b.status?.toLowerCase() === "closed").length}
  onClick={() => setFilter("Closed")}
/>

  <Card
    type="critical"
    title="CRITICAL"
    count={bugs.filter(b => b.severity === "Critical").length}
    onClick={() => setFilter("CRITICAL")}
  />
  
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
      <th>Screenshot</th>
    </tr>
  </thead>

  <tbody>
    {filtered.map((bug) => (
      <tr
        key={bug._id}
        className="clickable-row"
      >
        <td
          onClick={() => {
            setSelectedBug(bug);
            setShowBugModal(true);
          }}
        >
          {bug.bugId || "AUTO"}
        </td>

        <td
          onClick={() => {
            setSelectedBug(bug);
            setShowBugModal(true);
          }}
        >
          {bug.title}
        </td>

        <td>{bug.status}</td>

        <td>{bug.severity}</td>

        <td>{bug.assignee || "Unassigned"}</td>

        <td>
          {new Date(
            bug.createdAt
          ).toLocaleDateString()}
        </td>

        <td>
          {bug.screenshot ? (
            <button
              className="view-shot-btn"
              onClick={() =>
                window.open(`${api.defaults.baseURL}/uploads/${bug.screenshot}`, "_blank")
              }
            >
              View
            </button>
          ) : (
            "No Image"
          )}
        </td>
      </tr>
    ))}
  </tbody>
</table>
{/* Bug Details Modal */}
{showBugModal && selectedBug && (
  <div className="modal-overlay">
    <div className="modal">

      <div className="modal-header">
        <h3>Bug Details</h3>

        <span
          className="close"
          onClick={() =>
            setShowBugModal(false)
          }
        >
          ×
        </span>
      </div>

      <div className="modal-body">

        <p>
          <strong>Bug ID:</strong>{" "}
          {selectedBug.bugId || "AUTO"}
        </p>

        <p>
          <strong>Title:</strong>{" "}
          {selectedBug.title}
        </p>

        <p>
          <strong>Description:</strong>{" "}
          {selectedBug.description}
        </p>

        <p>
          <strong>Module:</strong>{" "}
          {selectedBug.module}
        </p>

        <p>
          <strong>Severity:</strong>{" "}
          {selectedBug.severity}
        </p>

        <p>
          <strong>Status:</strong>{" "}
          {selectedBug.status}
        </p>

        <p>
          <strong>Reporter:</strong>{" "}
          {selectedBug.reporter || "Automation"}
        </p>

        <p>
          <strong>Assignee:</strong>{" "}
          {selectedBug.assignee || "Unassigned"}
        </p>

        <p>
          <strong>TC ID:</strong>{" "}
          {selectedBug.tcId || "-"}
        </p>

        <p>
          <strong>Logs:</strong>{" "}
          {selectedBug.logs || "-"}
        </p>

        <p>
          <strong>Project:</strong>{" "}
          {selectedBug.project || "-"}
        </p>

        {selectedBug.screenshot && (
          <div>
            <strong>Screenshot:</strong>

            <br />

            <img
              src={`${api.defaults.baseURL}/uploads/${selectedBug.screenshot}`}
              alt="bug"
              style={{
                width: "100%",
                maxHeight: "300px",
                objectFit: "contain",
                marginTop: "10px",
                borderRadius: "10px",
              }}
            />
          </div>
        )}
      </div>
    </div>
  </div>
)}
    </div>
  );
  function Card({ type, title, count, onClick }) {
  return (
    <div className={`dash-card ${type}`} onClick={onClick}>
      <div className="card-left">
        <div className="card-icon">
          {type === "total" && "🐞"}
          {type === "open" && "🟦"}
          {type === "progress" && "📈"}
          {type === "resolved" && "✅"}
          {type === "critical" && "⚠️"}
        </div>
        <div className="card-text">
          <span>{title}</span>
          <h2>{count}</h2>
        </div>
      </div>
    </div>
  );
}
}
