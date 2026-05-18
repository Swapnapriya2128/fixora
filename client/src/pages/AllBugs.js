import { useEffect, useState } from "react";
import axios from "axios";
import"./AllBugs.css"

export default function Dashboard({ searchTerm }) {
  const [bugs, setBugs] = useState([]);
  const [filters, setFilters] = useState({
    severity: "ALL",
    status: "ALL",
    assignee: "ALL",
    module: "ALL",
  });

  useEffect(() => {
    fetchBugs();
  }, []);

  const fetchBugs = async () => {
    const res = await axios.get("http://localhost:5000/bugs");
    setBugs(res.data);
  };

  const handleDelete = async (id) => {
  try {
    await axios.delete(
      `http://localhost:5000/bugs/${id}`
    );

    fetchBugs();
  } catch (err) {
    console.log(err);
  }
};
const handleEdit = (id) => {
  window.location.href = `/edit/${id}`;
};
  const handleFilter = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredBugs = bugs.filter((b) => {
    return (
      (filters.severity === "ALL" || b.severity === filters.severity) &&
      (filters.status === "ALL" || b.status === filters.status) &&
      (filters.assignee === "ALL" || b.assignee === filters.assignee) &&
      (filters.module === "ALL" || b.module === filters.module)
    );
  });

  return (
    <div className="page">
      {/* 🔷 Header */}
      <div className="title-row">
        <h2>All Bugs</h2>
        <button className="add-btn">+ Report Bug</button>
      </div>
      
      {/* 🔷 Filters */}
      <div className="filters">
        <label>Filters :</label>
        <select name="severity" onChange={handleFilter}>
          <option value="ALL">All Severity</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
          <option>Critical</option>
        </select>

        <select name="status" onChange={handleFilter}>
          <option value="ALL">Open</option>
          <option>OPEN</option>
          <option>CLOSED</option>
          <option>IN DEVELOPMENT</option>
          <option>RE-TEST</option>
        </select>

        <select name="assignee" onChange={handleFilter}>
          <option value="ALL">All Assignees</option>
          {[...new Set(bugs.map((b) => b.assignee))].map((a, i) => (
            <option key={i}>{a}</option>
          ))}
        </select>

        <select name="module" onChange={handleFilter}>
          <option value="ALL">All Modules</option>
          {[...new Set(bugs.map((b) => b.module))].map((m, i) => (
            <option key={i}>{m}</option>
          ))}
        </select>
      </div>

      {/* 🔷 Table */}
      <table className="bugs-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Module</th>
            <th>Severity</th>
            <th>Status</th>
            <th>Assignee</th>
            <th>Reporter</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredBugs.map((bug) => (
            <tr key={bug._id}>
              <td>{bug.bugId}</td>
              <td>{bug.title}</td>
              <td>{bug.module}</td>
              <td>{bug.severity}</td>
              <td>{bug.status}</td>
              <td>{bug.assignee}</td>
              <td>{bug.reporter}</td>
              <td>
  {new Date(
    bug.createdAt
  ).toLocaleDateString()}
</td>
              <td className="action-buttons">
  <button
    className="edit-btn"
    onClick={() => handleEdit(bug._id)}
  >
    Edit
  </button>

  <button
    className="delete-btn"
    onClick={() => handleDelete(bug._id)}
  >
    Delete
  </button>
</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}