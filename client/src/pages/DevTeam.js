import { useEffect, useState } from "react";
import axios from "axios";
import "./DevTeam.css";


export default function DevTeam() {
  const [members, setMembers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "" });
  

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
  const res = await axios.get("http://localhost:5000/api/devmembers");
  setMembers(res.data);
};

  const addMember = async () => {
  if (!form.name || !form.email || !form.role) return;

  await axios.post("http://localhost:5000/api/devmembers", form);
  setForm({ name: "", email: "", role: "" });
  setShowModal(false);
  fetchMembers();
};

  const deleteMember = async (id) => {
  await axios.delete(`http://localhost:5000/api/devmembers/${id}`);
  fetchMembers();
};

  return (
    <div className="devteam-container">
      <div className="devteam-header">
        <h2>👥 Dev Team</h2>
        <button className="add-member-btn" onClick={() => setShowModal(true)}>
          + Add Member
        </button>
      </div>

      <div className="devteam-grid">
        {members.map((m) => (
          <div className="devteam-card" key={m.id}>
            <div className="devteam-avatar">{m.name[0]}</div>
            <h3>{m.name}</h3>
            <p className="devteam-role">{m.role}</p>
            <p className="devteam-email">{m.email}</p>

            <div className="devteam-stats">
              <div><span>0</span> Open</div>
              <div><span>0</span> Assigned</div>
              <div><span>0</span> Resolved</div>
            </div>

            <button
              className="delete-btn"
              key={m._id}
              onClick={() => deleteMember(m._id)}
            >
              🗑 Delete
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="dev-modal-overlay">
          <div className="dev-modal-box">
            <h3>Add Team Member</h3>

            <label>Full name <span>*</span> </label>
            <input
              placeholder="Full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <label>Email <span>*</span> </label>
            <input
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <label>Role <span>*</span> </label>
            <input
              placeholder="Role (Frontend Dev, Backend Dev...)"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            />

            <div className="dev-modal-actions">
              <button onClick={() => setShowModal(false)}>Cancel</button>
              <button className="save-btn" onClick={addMember}>
                Add Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}