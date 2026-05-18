import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h3>NAVIGATE</h3>

      <Link to="/">🏠 Dashboard</Link>
      <Link to="/projects">📁 Projects</Link> {/* ✅ New Tab */}
      <Link to="/allbugs">🐞 All Bugs</Link>
      <Link to="/myreports">📝 My Reports</Link>
      <Link to="/devteam">👨‍💻 Dev Team</Link>
      
      <h3>ACTIVITY</h3>
      <Link to="/notifications">🔔 Notifications</Link>
    </div>
  );
}