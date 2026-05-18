import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const user = JSON.parse(sessionStorage.getItem("user"));
  return user ? children : <Navigate to="/login" replace />;
}