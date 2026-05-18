import "./ProjectDetails.css";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [testCases, setTestCases] = useState([]);
  const [tcModal, setTcModal] = useState(false);
  const [bugModal, setBugModal] = useState(false);
  const [devMembers, setDevMembers] = useState([]);

  const [bugForm, setBugForm] = useState({
  title: "",
  description: "",
  module: "",
  priority: "Low",
  severity: "Low",
  assignee: "Unassigned",
  status: "Open",
  tcId: "",
});

  // ✅ Load Test Cases
  const loadTestCases = async () => {
    const res = await axios.get(`http://localhost:5000/testcases/${id}`);
    setTestCases(res.data);
  };

  useEffect(() => {
    loadTestCases();
    fetchDevMembers();
  }, [id]);

  const fetchDevMembers = async () => {
  const res = await axios.get("http://localhost:5000/api/devmembers");
  setDevMembers(res.data);
};

  // ✅ Add Test Case
  const addTestCase = async () => {
    await axios.post("http://localhost:5000/testcases", {
      projectId: id,
      description: document.getElementById("desc").value,
      steps: document.getElementById("steps").value,
      testData: document.getElementById("data").value,
      expectedResult: document.getElementById("exp").value,
      actualResult: document.getElementById("act").value,
      status: document.getElementById("status").value,
    });

    setTcModal(false);
    loadTestCases();
  };

  // ✅ Submit Bug linked with TC
  const submitBug = async () => {
  await axios.post("http://localhost:5000/bugs", {
    title: bugForm.title,
    description: bugForm.description,
    module: bugForm.module,
    reporter: user.email,
    priority: bugForm.priority,
    severity: bugForm.severity,   
    assignee: bugForm.assignee,   
    status: bugForm.status,       
    tcId: bugForm.tcId,
  });

  setBugModal(false);
  alert("Bug Reported Successfully");
};

  return (
    <div className="pd-page">

      {/* Header */}
      <div className="pd-header">
        <button onClick={() => navigate("/projects")}>← Back</button>
        <h2>Project Test Cases</h2>

        <div>
          <button onClick={() => setTcModal(true)}>+ Add Test Case</button>
          <button onClick={() => setBugModal(true)}>🐞 Report Bug</button>
        </div>
      </div>

      {/* ================= Test Case Modal ================= */}
      {tcModal && (
        <div className="bug-modal-overlay">
          <div className="bug-modal">
            <h3>Add Test Case</h3>

            <input id="desc" placeholder="TC Description" />
            <textarea id="steps" placeholder="Steps" />
            <input id="data" placeholder="Test Data" />
            <input id="exp" placeholder="Expected Result" />
            <input id="act" placeholder="Actual Result" />

            <select id="status">
              <option value="PASS">PASS</option>
              <option value="FAIL">FAIL</option>
            </select>

            <div className="bug-footer">
              <button onClick={() => setTcModal(false)}>Cancel</button>
              <button onClick={addTestCase}>Save</button>
            </div>
          </div>
        </div>
      )}

     {/* ================= Bug Modal ================= */}
{bugModal && (
  <div className="bug-modal-overlay">
    <div className="bug-modal">
      <h3>Report Bug from Failed Test Case</h3>

      <input
        placeholder="Bug Title"
        onChange={(e) =>
          setBugForm({ ...bugForm, title: e.target.value })
        }
      />

      <textarea
        placeholder="Bug Description"
        onChange={(e) =>
          setBugForm({ ...bugForm, description: e.target.value })
        }
      />

      <input
        placeholder="Module"
        onChange={(e) =>
          setBugForm({ ...bugForm, module: e.target.value })
        }
      />

      {/* Severity (NEW) */}
      <label>Severity</label>
      <select
  value={bugForm.severity}
  onChange={(e) =>
    setBugForm({ ...bugForm, severity: e.target.value })
  }
      >
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
        <option>Critical</option>
      </select>

      {/* Assignee (NEW - dynamic from Dev Team) */}
      <label>Assignee</label>
      <select
  value={bugForm.assignee}
  onChange={(e) =>
    setBugForm({ ...bugForm, assignee: e.target.value })
  }
      >
        <option value="Unassigned">Unassigned</option>
        {devMembers.map((dev) => (
          <option key={dev._id} value={dev.name}>
            {dev.name} ({dev.role})
          </option>
        ))}
      </select>

      {/* Status (NEW) */}
      <label>Status</label>
      <select
  value={bugForm.status}
  onChange={(e) =>
    setBugForm({ ...bugForm, status: e.target.value })
  }
      >
        <option>Open</option>
        <option>In Progress</option>
        <option>Resolved</option>
        <option>Closed</option>
      </select>

      {/* ===== KEEPING YOUR TC ID PART SAME ===== */}
      <label>Select Failed TC</label>
      <select
        onChange={(e) =>
          setBugForm({ ...bugForm, tcId: e.target.value })
        }
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

      <div className="bug-footer">
        <button onClick={() => setBugModal(false)}>Cancel</button>
        <button onClick={submitBug}>Submit Bug</button>
      </div>
    </div>
  </div>
)}

      {/* ================= Test Case Table ================= */}
      <div className="pd-table">
        <div className="table-head">
          <span>TC ID</span>
          <span>Description</span>
          <span>Status</span>
          <span>Expected</span>
          <span>Actual</span>
        </div>

        {testCases.map((tc) => (
          <div
            key={tc._id}
            className="table-row"
            style={{
              backgroundColor: tc.status === "FAIL" ? "#ffe6e6" : "#e6ffe6",
            }}
          >
            <span>{tc.tcId}</span>
            <span>{tc.description}</span>
            <span>{tc.status}</span>
            <span>{tc.expectedResult}</span>
            <span>{tc.actualResult}</span>
          </div>
        ))}
      </div>
    </div>
  );
}