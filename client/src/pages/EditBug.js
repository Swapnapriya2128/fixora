import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function EditBug() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    module: "",
    reporter: "",
    assignee: "",
    priority: "Medium",
    status: "OPEN",
  });

  useEffect(() => {
    fetchBug();
  }, []);

  const fetchBug = async () => {
    const res = await axios.get(`http://localhost:5000/bugs`);
    const bug = res.data.find((b) => b._id === id);
    setForm(bug);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    await axios.put(`http://localhost:5000/bugs/${id}`, form);
    alert("Bug updated");
    navigate("/");
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Edit Bug</h2>

      <input name="title" value={form.title} onChange={handleChange} /><br/><br/>
      <textarea name="description" value={form.description} onChange={handleChange} /><br/><br/>
      <input name="module" value={form.module} onChange={handleChange} /><br/><br/>
      <input name="reporter" value={form.reporter} onChange={handleChange} /><br/><br/>
      <input name="assignee" value={form.assignee} onChange={handleChange} /><br/><br/>

      <select name="priority" value={form.priority} onChange={handleChange}>
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
        <option>Critical</option>
      </select><br/><br/>

      <select name="status" value={form.status} onChange={handleChange}>
        <option>OPEN</option>
        <option>IN DEVELOPMENT</option>
        <option>CLOSED</option>
      </select><br/><br/>

      <button onClick={handleUpdate}>Update Bug</button>
    </div>
  );
}