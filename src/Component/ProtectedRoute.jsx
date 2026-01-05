import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

export default function ProtectedRoute({ children, adminOnly = false, employeeOnly = false }) {
  const role = sessionStorage.getItem("role");

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // 🛡️ SUPER ADMIN BYPASS: If role is superadmin, they pass every check
  if (role === "superadmin") {
    return children;
  }

  // Regular Role Restrictions
  if (employeeOnly && role === "admin") {
    return <Navigate to="/" replace />;
  }

  if (adminOnly && role === "employee") {
    return <Navigate to="/employee/dashboard" replace />;
  }

  return children;
}