import "./App.css";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import AllBugs from "./pages/AllBugs";
import DevTeam from "./pages/DevTeam";
import MyReports from "./pages/MyReports";
import Notifications from "./pages/Notifications";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import Login from "./pages/Login";
import EditBug from "./pages/EditBug";

function Layout() {
  const user = JSON.parse(sessionStorage.getItem("user"));

  if (!user) return <Navigate to="/login" replace />;

  return (
    <>
      <div className="topbar">Fixora</div>
      <div className="layout">
        <Sidebar />
        <div className="main">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Login */}
      <Route path="/login" element={<Login />} />

      {/* Protected layout */}
      <Route path="/" element={<Layout />}>
        {/* THIS IS VERY IMPORTANT */}
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:id" element={<ProjectDetails />} />
        <Route path="allbugs" element={<AllBugs />} />
        <Route path="devteam" element={<DevTeam />} />
        <Route path="myreports" element={<MyReports />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="edit/:id" element={<EditBug />} />
      </Route>
    </Routes>
  );
}